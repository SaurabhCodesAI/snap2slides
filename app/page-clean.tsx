'use client';

import { useState, useCallback } from 'react';

// Clean, functional SVG icons
const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="progress-bar">
    <div className="progress-fill" style={{ width: `${progress}%` }} />
  </div>
);

export default function Home() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFile(files[0]);
      setError(null);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setError(null);
    }
  }, []);

  const processImage = useCallback(async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Call the Gemini API
      const response = await fetch('/api/gemini-vision', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      
      // Generate PowerPoint slides
      if (data.content) {
        const pptResponse = await fetch('/api/generate-pptx-slides', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: data.content }),
        });

        if (pptResponse.ok) {
          const blob = await pptResponse.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'presentation.pptx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      }
      
    } catch (error) {
      console.error('Processing error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  }, [file]);

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-semibold mb-6">Snap2Slides</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform images into professional presentation slides using AI
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <div 
            className={`upload-zone ${isDragOver ? 'active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <UploadIcon />
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">
                  Drop an image here or click to browse
                </h3>
                <p className="text-gray-400 text-sm">
                  Supports JPG, PNG, WebP up to 10MB
                </p>
              </div>
              <input
                type="file"
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="btn-primary">
                Choose File
              </label>
            </div>
          </div>

          {file && (
            <div className="mt-8 card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-medium">IMG</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{file.name}</h4>
                    <p className="text-gray-400 text-sm">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={resetForm}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={processImage}
                    disabled={isProcessing}
                    className="btn-primary"
                  >
                    {isProcessing ? 'Processing...' : 'Generate Slides'}
                  </button>
                </div>
              </div>
              
              {isProcessing && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Analyzing image and generating content...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <ProgressBar progress={progress} />
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-900/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="card mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <CheckIcon />
              <h3 className="text-lg font-medium">Processing Complete</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Generated Content:</h4>
                <div className="bg-gray-900/50 rounded-lg p-4 text-sm">
                  <pre className="whitespace-pre-wrap">{result.content}</pre>
                </div>
              </div>
              <p className="text-green-400 text-sm">
                ✓ PowerPoint file has been generated and downloaded
              </p>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="feature-card">
            <div className="mb-4">
              <div className="status-indicator mb-3"></div>
              <h3 className="font-medium mb-2">AI Analysis</h3>
              <p className="text-gray-400 text-sm">
                Advanced computer vision analyzes your images to understand content and context
              </p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="mb-4">
              <div className="status-indicator processing mb-3"></div>
              <h3 className="font-medium mb-2">Smart Generation</h3>
              <p className="text-gray-400 text-sm">
                Automatically creates structured presentation content with relevant talking points
              </p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="mb-4">
              <div className="status-indicator mb-3"></div>
              <h3 className="font-medium mb-2">Instant Export</h3>
              <p className="text-gray-400 text-sm">
                Download professional PowerPoint presentations ready for immediate use
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Powered by Google Gemini AI • Built with Next.js
          </p>
        </div>
      </div>
    </div>
  );
}
