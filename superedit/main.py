import os
from time import sleep
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

def process_video(video_path: str) -> str:
    """
    Process a video file using Google's Generative AI.
    
    Args:
        video_path (str): Path to the video file
        
    Returns:
        str: Generated summary and quiz
    """
    # Initialize the client
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    
    # Upload the video file
    video_file = client.files.upload(file=video_path)

    if video_file.name is None:
        raise Exception("File has no name")

    # Wait for file to become active
    while True:
        file_status = client.files.get(name=video_file.name).state
        if file_status == "ACTIVE":
            break
        sleep(1)
    
    # Generate content
    response = client.models.generate_content(
        model="gemini-2.5-flash-preview-05-20",
        contents=[
            video_file,
            "Give timestamps for each section of the video in terms of what is happening. Make sure to timestamp every scene change and describe what's happening at each scene"
        ]
    )
    
    return response.text

if __name__ == '__main__':
    # Example usage
    video_path = "sample.mp4"  # Replace with actual video path
    result = process_video(video_path)
    print(result) 