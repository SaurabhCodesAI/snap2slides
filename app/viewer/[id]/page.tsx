'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import '../../../app/globals.css';

// Elite SVG icons
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-300">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-300 group-hover:scale-110">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-300 group-hover:scale-110">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const PdfIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-300 group-hover:scale-110">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-300 animate-pulse">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

interface SlideData {
  content: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadDate?: string;
  imageMetadata?: {
    dimensions: string;
    format: string;
    quality: string;
  };
}

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="progress-bar elite-interactive">
    <div className="progress-fill" style={{ width: `${progress}%` }} />
  </div>
);

export default function SlidesViewer({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [slidesData, setSlidesData] = useState<SlideData | null>(null);
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        // First try to get data from API
        const response = await fetch(`/api/slides?id=${params.id}`);
        
        if (response.ok) {
          const data = await response.json();
          setSlidesData(data);
        } else {
          // Fallback to localStorage
          const data = localStorage.getItem(`slides_${params.id}`);
          if (data) {
            try {
              setSlidesData(JSON.parse(data));
            } catch (err) {
              setError('Failed to load slides data');
            }
          } else {
            setError('Slides data not found');
          }
        }
      } catch (err) {
        // Fallback to localStorage
        const data = localStorage.getItem(`slides_${params.id}`);
        if (data) {
          try {
            setSlidesData(JSON.parse(data));
          } catch (parseErr) {
            setError('Failed to load slides data');
          }
        } else {
          setError('Slides data not found');
        }
      }
    };
    
    loadSlides();
  }, [params.id]);

  const parseSlides = (content: string) => {
    const slides = content.split('Slide ').slice(1).map((slide, index) => {
      const lines = slide.trim().split('\n');
      const title = lines[0].replace(/^\d+:\s*/, '').trim();
      const slideContent = lines.slice(1).join('\n').trim();
      
      return {
        id: index + 1,
        title,
        content: slideContent
      };
    });
    
    return slides.length > 0 ? slides : [{ id: 1, title: 'Generated Slide', content: 'Content processed successfully' }];
  };

  const generatePowerPoint = useCallback(async () => {
    if (!slidesData?.content) return;
    
    try {
      setIsGeneratingPPT(true);
      setProgress(0);
      setError(null);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 200);
      
      const response = await fetch('/api/generate-pptx-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: slidesData.content }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);
        
        // Auto-download
        const a = document.createElement('a');
        a.href = url;
        a.download = `snap2slides-pro-${new Date().toISOString().slice(0, 10)}.pptx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to generate PowerPoint');
      }
    } catch (error) {
      console.error('Error generating PowerPoint:', error);
      setError('Failed to generate PowerPoint. Please try again.');
    } finally {
      setIsGeneratingPPT(false);
      setProgress(0);
    }
  }, [slidesData]);

  const generatePDF = useCallback(async () => {
    if (!slidesData?.content) return;
    
    try {
      setIsGeneratingPDF(true);
      setProgress(0);
      setError(null);
      
      const slides = parseSlides(slidesData.content);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 85));
      }, 150);
      
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          slides,
          title: slidesData.fileName?.replace(/\.[^/.]+$/, "") || 'AI Generated Presentation'
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Auto-download
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slidesData.fileName?.replace(/\.[^/.]+$/, "") || 'snap2slides-presentation'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
      setProgress(0);
    }
  }, [slidesData]);

  const handleDownloadPPT = useCallback(() => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `snap2slides-pro-${new Date().toISOString().slice(0, 10)}.pptx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [downloadUrl]);

  const goToEditor = () => {
    router.push(`/editor/${params.id}`);
  };

  const goBack = () => {
    router.push('/');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={goBack} className="btn-primary">
            <BackIcon />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!slidesData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading slides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button onClick={goBack} className="btn-secondary group">
              <BackIcon />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold elite-title">
                Generated <span className="text-blue-500">Slides</span>
              </h1>
              <p className="text-gray-400">Professional presentation ready</p>
            </div>
          </div>
          
          {/* PowerPoint Download */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={goToEditor}
              className="btn-secondary elite-interactive bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50 hover:bg-purple-600/30 flex items-center space-x-2"
            >
              <EditIcon />
              <span>Edit Live</span>
            </button>
            
            <button 
              onClick={generatePowerPoint}
              disabled={isGeneratingPPT || isGeneratingPDF}
              className="btn-primary elite-interactive bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DownloadIcon />
              <span>{isGeneratingPPT ? 'Generating...' : 'Download PowerPoint'}</span>
            </button>
            
            <button 
              onClick={generatePDF}
              disabled={isGeneratingPDF || isGeneratingPPT}
              className="btn-primary elite-interactive bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PdfIcon />
              <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
            </button>
            {downloadUrl && (
              <button 
                onClick={handleDownloadPPT}
                className="btn-secondary group flex items-center space-x-2 bg-green-900/30 border-green-900/50 hover:bg-green-900/50"
              >
                <DownloadIcon />
                <span>Download Again</span>
              </button>
            )}
          </div>
        </div>

        {/* Download Progress */}
        {(isGeneratingPPT || isGeneratingPDF) && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-900/30 rounded-xl">
            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
              <span>
                {isGeneratingPPT && 'Generating PowerPoint presentation...'}
                {isGeneratingPDF && 'Generating PDF document...'}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <ProgressBar progress={progress} />
          </div>
        )}

        {/* Download Success */}
        {downloadUrl && !isGeneratingPPT && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-900/30 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckIcon />
              </div>
              <div>
                <p className="text-green-400 font-semibold text-lg">PowerPoint Ready!</p>
                <p className="text-green-500 text-sm">Professional slides downloaded successfully</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-900/30 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Slides Grid */}
        <div className="grid gap-8">
          {slidesData && parseSlides(slidesData.content).map((slide, index) => {
            const slideNumber = slide.id;
            const title = slide.title;
            const content = slide.content;
            
            return (
              <div key={index} className="card elite-interactive bg-gradient-to-br from-gray-900/60 to-gray-800/60 border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {slideNumber}
                    </div>
                    <div>
                      <h2 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors duration-300">
                        {title}
                      </h2>
                      <p className="text-gray-500 text-sm">Slide {slideNumber}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
                    AI Generated
                  </div>
                </div>
                
                <div className="bg-gray-900/30 rounded-xl p-6 border-l-4 border-blue-500/50">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* File Information */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="card elite-interactive">
            <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>File Information</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-900/30 rounded-lg">
                <span className="text-gray-400">Original File:</span>
                <span className="font-medium text-sm">{slidesData.fileName}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-900/30 rounded-lg">
                <span className="text-gray-400">File Size:</span>
                <span className="font-medium">{(slidesData.fileSize / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-900/30 rounded-lg">
                <span className="text-gray-400">Format:</span>
                <span className="font-medium">{slidesData.imageMetadata?.format || slidesData.mimeType.split('/')[1]?.toUpperCase()}</span>
              </div>
              {slidesData.uploadDate && (
                <div className="flex justify-between p-3 bg-gray-900/30 rounded-lg">
                  <span className="text-gray-400">Uploaded:</span>
                  <span className="font-medium">{new Date(slidesData.uploadDate).toLocaleString()}</span>
                </div>
              )}
              {slidesData.imageMetadata && (
                <>
                  <div className="flex justify-between p-3 bg-gray-900/30 rounded-lg">
                    <span className="text-gray-400">Dimensions:</span>
                    <span className="font-medium">{slidesData.imageMetadata.dimensions}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-900/30 rounded-lg">
                    <span className="text-gray-400">Quality:</span>
                    <span className="font-medium text-green-400">{slidesData.imageMetadata.quality}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="card elite-interactive">
            <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Processing Stats</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-900/30 rounded-lg">
                <span className="text-gray-400">Total Slides:</span>
                <span className="font-medium">{parseSlides(slidesData.content).length}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-900/30 rounded-lg">
                <span className="text-gray-400">AI Engine:</span>
                <span className="font-medium">Google Gemini</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-900/30 rounded-lg">
                <span className="text-gray-400">Status:</span>
                <span className="font-medium text-green-400">Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Snap2Slides Pro • Powered by Google Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}
