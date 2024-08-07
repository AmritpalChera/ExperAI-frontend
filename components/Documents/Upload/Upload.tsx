"use client";
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import React, { useRef, useState } from 'react';

interface FileUploadInterface {
    setFile: any,
    file: File | null
}

function FileUpload({file, setFile}: FileUploadInterface) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (event: any) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    // Handle dropped files here
    console.log(files);
  };

  const handleFileInputChange = (event: any) => {
    const files = event.target.files;
    // Handle selected files here
    console.log(files);
    setFile(files[0]);

  };

  return (
    <div className="">
      <div
        id="drag-container"

        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={isDragging ? 'drag-over' : ''}
      >
        <div className='border px-8 h-40 flex bg-gray-100 flex-col items-center justify-center text-blue-600 rounded-xl cursor-pointer hover:border-blue-200'>
            <div className='flex items-center text-black gap-4'>
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${file? 'bg-green-300' : 'bg-primary'}`}>
                    <DocumentArrowUpIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    
                </div>
                <h3 className='font-bold text-lg'>Upload PDF</h3>
            </div>
            {file ? <div className='mt-4 text-gray-500 text-sm'>{file.name}</div> : <div className='text-gray-500 mt-4'>
                {isDragging ? <p>Drop the files here</p>
                : (
                <p>Drag files here or click to select </p> 
                )
                }
                <p className='mt-2'>Up to 20 MB</p>
            </div>
            }
            
        </div>
        
        <input
          type="file"
          id="fileInput"
          accept="application/pdf"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
          multiple
        />
      </div>
    </div>
  );
}

export default FileUpload;
