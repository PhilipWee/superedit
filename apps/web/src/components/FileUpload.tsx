import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

interface FileItem {
  id: string;
  name: string;
  url: string;
  type: string;
  created_at: string;
}

interface StorageFile {
  id: string;
  name: string;
  metadata: {
    mimetype?: string;
  };
  created_at: string;
}

export const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);

  // Fetch existing files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data: filesData, error } = await supabase
      .storage
      .from('uploads')
      .list();

    if (error) {
      console.error('Error fetching files:', error);
      return;
    }

    const fileItems: FileItem[] = await Promise.all(
      (filesData as StorageFile[]).map(async (file) => {
        const { data: { publicUrl } } = supabase
          .storage
          .from('uploads')
          .getPublicUrl(file.name);

        return {
          id: file.id,
          name: file.name,
          url: publicUrl,
          type: file.metadata?.mimetype || 'unknown',
          created_at: file.created_at,
        };
      })
    );

    setFiles(fileItems);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    
    for (const file of acceptedFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error } = await supabase
        .storage
        .from('uploads')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading file:', error);
      }
    }

    await fetchFiles();
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
      'audio/*': [],
    }
  });

  const removeFile = async (fileName: string) => {
    const { error } = await supabase
      .storage
      .from('uploads')
      .remove([fileName]);

    if (error) {
      console.error('Error removing file:', error);
      return;
    }

    await fetchFiles();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-gray-600">Uploading files...</p>
        ) : isDragActive ? (
          <p className="text-blue-500">Drop the files here...</p>
        ) : (
          <p className="text-gray-600">
            Drag and drop files here, or click to select files
            <br />
            <span className="text-sm">(Images, Videos, and Audio files are accepted)</span>
          </p>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="border rounded-lg p-4 shadow-sm"
          >
            {file.type.startsWith('image/') ? (
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-40 object-cover rounded-md"
              />
            ) : file.type.startsWith('video/') ? (
              <video
                src={file.url}
                controls
                className="w-full h-40 object-cover rounded-md"
              />
            ) : file.type.startsWith('audio/') ? (
              <audio
                src={file.url}
                controls
                className="w-full mt-2"
              />
            ) : null}
            
            <div className="mt-2">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <button
                onClick={() => removeFile(file.name)}
                className="mt-2 text-red-500 text-sm hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 