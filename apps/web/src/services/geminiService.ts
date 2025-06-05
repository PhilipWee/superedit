import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
const genAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_DANGER_GOOGLE_API_KEY,
});

interface VideoSegment {
  startTime: number;
  endTime: number;
  label: string;
}

export async function analyzeVideoWithGemini(
  videoFile: File
): Promise<VideoSegment[]> {
  try {
    // Convert video file to base64
    const base64Video = await fileToBase64(videoFile);

    // Create content parts for the model
    const contents = [
      {
        inlineData: {
          mimeType: videoFile.type,
          data: base64Video,
        },
      },
      {
        text: `Please analyze this video and provide a detailed breakdown of key events. 
        For each event, provide:
        1. The start time (in MM:SS format)
        2. The end time (in MM:SS format)
        3. A clear, concise description of what happens during that segment
        
        Format each segment exactly as:
        MM:SS - MM:SS: DESCRIPTION`,
      },
    ];

    // Generate content with the video and prompt
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
    });
    const text = result.text;

    // Parse the response into segments
    return parseGeminiResponse(text);
  } catch (error) {
    console.error("Error analyzing video with Gemini:", error);
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes("API key")) {
        throw new Error(
          "Invalid or missing API key. Please check your environment variables."
        );
      } else if (error.message.includes("video format")) {
        throw new Error(
          "Unsupported video format. Please use MP4, MPEG, MOV, AVI, FLV, MPG, WEBM, WMV, or 3GPP."
        );
      }
    }
    throw error;
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove the data URL prefix (e.g., "data:video/mp4;base64,")
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

function parseGeminiResponse(response: string): VideoSegment[] {
  const segments: VideoSegment[] = [];

  // Split response into lines and process each line
  const lines = response.split("\n");

  for (const line of lines) {
    // Look for patterns like "00:00 - 00:05: Person drops from sky"
    const match = line.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2}):\s*(.+)/);

    if (match) {
      const [_, startTimeStr, endTimeStr, description] = match;

      // Validate time format
      if (isValidTimeFormat(startTimeStr) && isValidTimeFormat(endTimeStr)) {
        segments.push({
          startTime: timeToSeconds(startTimeStr),
          endTime: timeToSeconds(endTimeStr),
          label: description.trim(),
        });
      }
    }
  }

  return segments;
}

function timeToSeconds(timeStr: string): number {
  const [minutes, seconds] = timeStr.split(":").map(Number);
  return minutes * 60 + seconds;
}

function isValidTimeFormat(timeStr: string): boolean {
  const [minutes, seconds] = timeStr.split(":").map(Number);
  return (
    !isNaN(minutes) &&
    !isNaN(seconds) &&
    minutes >= 0 &&
    minutes < 60 &&
    seconds >= 0 &&
    seconds < 60
  );
}
