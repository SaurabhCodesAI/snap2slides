'use client';

import { useState, useCallback, useRef, useEffect, memo, useMemo } from 'react';
import { useRouter } from 'next/navigation';


// Elite SVG icons with enhanced animations
const UploadIcon = memo(() => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
));
UploadIcon.displayName = 'UploadIcon';

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-300 animate-pulse">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-300 group-hover:scale-110">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-300 group-hover:scale-110">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const ProgressBar = memo(({ progress }: { progress: number }) => (
  <div className="progress-bar elite-interactive">
    <div 
      className="progress-fill" 
      style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} 
    />
  </div>
));
ProgressBar.displayName = 'ProgressBar';

const EliteStatusIndicator = memo(({ status }: { status: string }) => (
  <div className={`status-indicator ${status} elite-interactive`} />
));
EliteStatusIndicator.displayName = 'EliteStatusIndicator';

interface AIResult {
  content: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadDate?: string;
  documentType?: string;
  extractedText?: string;
  hasTextContent?: boolean;
  contentQuality?: {
    score: number;
    level: string;
    wordCount: number;
    dataPoints: number;
    entities: number;
    dates: number;
  };
  imageMetadata?: {
    dimensions: string;
    format: string;
    quality: string;
    analysis?: string;
  };
  insights?: string;
  perplexityResearch?: {
    hasResearch: boolean;
    researchQuality: string;
    insightCount: number;
    categories: string[];
    hasFollowUpQuestions?: boolean;
    hasMarketInsights?: boolean;
  };
  analysisMetrics?: {
    comprehensiveness: string;
    detailLevel: string;
    slideCount: number;
    contentDepth: string;
    textExtractionQuality?: string;
    qualityScore?: number;
  };
  apiUsed?: string;
  message?: string;
}

export default function Home() {
  
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [realTimeStatus, setRealTimeStatus] = useState('ready');
  const [showSuccess, setShowSuccess] = useState(false);
  const [slidesId, setSlidesId] = useState<string | null>(null);
  const processingRef = useRef(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Real-time status updates
  useEffect(() => {
    if (isProcessing) {
      setRealTimeStatus('processing');
    } else if (result) {
      setRealTimeStatus('complete');
    } else if (error) {
      setRealTimeStatus('error');
    } else {
      setRealTimeStatus('ready');
    }
  }, [isProcessing, result, error]);

  // Elite drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    setError(null);
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
      const selectedFile = files[0];
      
      // Real-time validation
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG, WebP)');
        return;
      }
      
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      
      // Warn about large files but allow upload
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError('⚠️ Large file (>20MB) - Processing may take 2-5 minutes. Consider compressing for faster results.');
      } else {
        setError(null);
      }
      
      setFile(selectedFile);
      setResult(null);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      
      // Real-time validation
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG, WebP)');
        return;
      }
      
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      
      // Warn about large files but allow upload
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError('⚠️ Large file (>20MB) - Processing may take 2-5 minutes. Consider compressing for faster results.');
      } else {
        setError(null);
      }
      
      setFile(selectedFile);
      setResult(null);
    }
  }, []);

  // Elite real-time processing with enhanced UX
  const processImage = useCallback(async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);
    
    try {
      // Enhanced progress simulation with realistic phases
      let currentProgress = 0;
      const updateProgress = (target: number, duration: number): Promise<void> => {
        return new Promise(resolve => {
          const interval = setInterval(() => {
            currentProgress += (target - currentProgress) * 0.1;
            setProgress(Math.min(currentProgress, target));
            if (currentProgress >= target - 1) {
              clearInterval(interval);
              resolve();
            }
          }, duration / 10);
        });
      };

      // Phase 1: Image upload and preprocessing
      await updateProgress(20, 500);
      
      // Call the Gemini API with enhanced error handling
      const formData = new FormData();
      formData.append('image', file);
      
      // Phase 2: AI analysis in progress
      await updateProgress(40, 300);
      
      // Add timeout for large files (5 minutes)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);
      
      const response = await fetch('/api/gemini-vision', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      // Phase 3: Processing AI response
      await updateProgress(70, 200);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Phase 4: Generating slides
      await updateProgress(90, 300);
      
      setResult(data);
      
      // Phase 5: Finalizing
      await updateProgress(100, 200);
      
      // Store slides data via API
      if (data.content) {
        try {
          const saveResponse = await fetch('/api/slides', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          
          if (saveResponse.ok) {
            const { id } = await saveResponse.json();
            setSlidesId(id);
            setShowSuccess(true);
            
            // Store in localStorage as backup
            localStorage.setItem(`slides_${id}`, JSON.stringify(data));
          } else {
            // Fallback to localStorage if API fails
            const fallbackId = Date.now().toString();
            localStorage.setItem(`slides_${fallbackId}`, JSON.stringify(data));
            setSlidesId(fallbackId);
            setShowSuccess(true);
          }
        } catch (err) {
          // Fallback to localStorage if API fails
          const fallbackId = Date.now().toString();
          localStorage.setItem(`slides_${fallbackId}`, JSON.stringify(data));
          setSlidesId(fallbackId);
          setShowSuccess(true);
        }
      }

    } catch (error) {
      console.error('Error processing image:', error);
      
      let errorMessage = 'Failed to process image. Please try again.';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Upload timeout - Your file is too large or took too long to process. Please try a smaller file (under 20MB) or compress your image.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Processing timeout - Large files may take longer. Please try a smaller file or compress your document.';
        } else if (error.message.includes('50MB')) {
          errorMessage = 'File too large - Please upload files smaller than 50MB. Try compressing your image or document.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error - Please check your internet connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 2000);
    }
  }, [file]);

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setRealTimeStatus('ready');
    setShowSuccess(false);
    setSlidesId(null);
  };

  const viewSlides = () => {
    if (slidesId) {
      router.push(`/viewer/${slidesId}`);
    }
  };

  const editSlides = () => {
    if (slidesId) {
      router.push(`/editor/${slidesId}`);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-16 ios-safe container-portrait">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6 elite-title text-crisp">
            Snap<span className="text-blue-500">2</span>Slides
            <span className="text-blue-400">.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto elite-subtitle px-4 md:px-0">
            Transform images into professional presentation slides using advanced AI
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8 md:mb-12">
          <div 
            className={`upload-zone group ${isDragOver ? 'active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mobile-stack items-center">
              <div className="transition-transform duration-200 md:duration-300 group-hover:scale-105">
                <UploadIcon />
              </div>
              <div className="text-center mobile-full">
                <h3 className="text-base md:text-lg font-medium mb-2 transition-colors duration-300 group-hover:text-blue-400">
                  Drop an image here or tap to browse
                </h3>
                <p className="text-gray-400 text-sm transition-colors duration-300 group-hover:text-gray-300 px-2">
                  Supports JPG, PNG, WebP • Up to 50MB
                </p>
              </div>
              <input
                type="file"
                onChange={handleFileSelect}
                accept="image/*,application/pdf,.pptx,.ppt,.txt,.docx"
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="btn-primary mobile-full cursor-pointer">
                Choose File
              </label>
            </div>
          </div>

          {file && (
            <div className="mt-6 md:mt-8 card elite-interactive">
              <div className="portrait-stack md:flex md:items-center md:justify-between mb-4">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center transition-all duration-200 md:duration-300 hover:scale-110 elite-morph flex-shrink-0">
                    <span className="text-white text-xs md:text-sm font-bold">
                      {file.type.startsWith('image/') ? 'IMG' : 
                       file.type.includes('pdf') ? 'PDF' : 
                       file.type.includes('presentation') ? 'PPT' : 'DOC'}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-base md:text-lg transition-colors duration-300 hover:text-blue-400 truncate">{file.name}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-400">
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                        <EliteStatusIndicator status={realTimeStatus} />
                        <span className="capitalize">{realTimeStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mobile-stack w-full md:w-auto">
                  <button 
                    onClick={resetForm}
                    className="btn-secondary group mobile-full"
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={processImage}
                    disabled={isProcessing}
                    className="btn-primary group mobile-full"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </span>
                    ) : (
                      'Generate Slides'
                    )}
                  </button>
                </div>
              </div>
              
              {isProcessing && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="transition-opacity duration-300 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>
                        {progress < 20 && 'Preparing image for AI analysis...'}
                        {progress >= 20 && progress < 40 && 'Uploading to Google Gemini AI...'}
                        {progress >= 40 && progress < 70 && 'AI analyzing image content and structure...'}
                        {progress >= 70 && progress < 90 && 'Generating professional slide content...'}
                        {progress >= 90 && 'Finalizing your presentation...'}
                      </span>
                    </span>
                    <span className="font-mono font-bold text-blue-400">{Math.round(progress)}%</span>
                  </div>
                  <ProgressBar progress={progress} />
                  <div className="text-xs text-gray-500 animate-pulse">
                    Using Google Gemini AI • Creating intelligent slides • Almost ready!
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-900/30 rounded-xl transition-all duration-300 hover:bg-red-900/30 elite-interactive">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Elite Results Section with Smooth Success Transition */}
        {showSuccess && result && (
          <div className="card mb-12 elite-interactive animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="transition-transform duration-300 hover:scale-110">
                  <CheckIcon />
                </div>
                <h3 className="text-xl font-semibold text-green-400">Processing Complete!</h3>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-900/30 rounded-xl">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <CheckIcon />
                    </div>
                    <div>
                      <p className="text-green-400 font-semibold text-lg">Slides Generated Successfully!</p>
                      <p className="text-green-500 text-sm">Your presentation is ready to view, edit, and download</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto mobile-stack">
                    <button 
                      onClick={viewSlides}
                      className="btn-primary elite-interactive bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 flex items-center justify-center space-x-2 w-full sm:w-auto mobile-full"
                    >
                      <EyeIcon />
                      <span>View Slides</span>
                    </button>
                    <button 
                      onClick={editSlides}
                      className="btn-secondary elite-interactive bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50 hover:bg-purple-600/30 flex items-center space-x-2 w-full sm:w-auto mobile-full"
                    >
                      <EditIcon />
                      <span>Edit Live</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Analysis Summary */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900/30 rounded-xl p-4">
                  <h4 className="font-semibold text-sm text-gray-400 mb-2">File Processed</h4>
                  <p className="text-white font-medium">{result.fileName}</p>
                  <p className="text-gray-500 text-sm">{(result.fileSize / 1024 / 1024).toFixed(2)} MB • {result.mimeType}</p>
                  {result.documentType && (
                    <p className="text-blue-400 text-xs mt-1">📄 {result.documentType}</p>
                  )}
                </div>
                <div className="bg-gray-900/30 rounded-xl p-4">
                  <h4 className="font-semibold text-sm text-gray-400 mb-2">Slides Generated</h4>
                  <p className="text-white font-medium">{result.analysisMetrics?.slideCount || 0} Professional Slides</p>
                  <p className="text-gray-500 text-sm">Quality: {result.contentQuality?.level || 'Standard'}</p>
                  {result.hasTextContent && (
                    <p className="text-green-400 text-xs mt-1">✓ {result.contentQuality?.wordCount || 0} Words Extracted</p>
                  )}
                </div>
                <div className="bg-gray-900/30 rounded-xl p-4">
                  <h4 className="font-semibold text-sm text-gray-400 mb-2">Content Quality</h4>
                  <p className="text-white font-medium">{result.analysisMetrics?.comprehensiveness || 'Standard'}</p>
                  <p className="text-gray-500 text-sm">Score: {result.contentQuality?.score || 0}/100</p>
                  {result.contentQuality && result.contentQuality.dataPoints > 0 && (
                    <p className="text-blue-400 text-xs mt-1">� {result.contentQuality.dataPoints} Data Points</p>
                  )}
                </div>
              </div>

              {/* Extracted Text Content */}
              {result.hasTextContent && result.extractedText && (
                <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-900/30 rounded-xl p-6 mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">📄</span>
                    </div>
                    <h4 className="font-semibold text-lg text-green-400">Extracted Document Content</h4>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                      {result.extractedText}
                    </pre>
                  </div>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className="text-xs text-green-300 bg-green-800/30 px-2 py-1 rounded-full">
                      OCR Complete
                    </span>
                    <span className="text-xs text-gray-400">
                      {result.extractedText.length} characters extracted
                    </span>
                  </div>
                </div>
              )}

              {/* Comprehensive Perplexity Research Insights */}
              {result.insights && result.perplexityResearch?.hasResearch && (
                <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-900/30 rounded-xl p-6 mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">�</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-purple-400">Comprehensive Research & Insights</h4>
                      <p className="text-xs text-purple-300">Powered by Perplexity AI • {result.perplexityResearch.researchQuality}</p>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
                    <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {result.insights}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-purple-900/20 rounded-lg p-3">
                      <h5 className="text-sm font-semibold text-purple-300 mb-2">Research Features</h5>
                      <div className="space-y-1">
                        {result.perplexityResearch.hasFollowUpQuestions && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-400 text-xs">✓</span>
                            <span className="text-xs text-gray-300">Follow-up Questions Generated</span>
                          </div>
                        )}
                        {result.perplexityResearch.hasMarketInsights && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-400 text-xs">✓</span>
                            <span className="text-xs text-gray-300">Market & Industry Analysis</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400 text-xs">✓</span>
                          <span className="text-xs text-gray-300">Strategic Recommendations</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400 text-xs">✓</span>
                          <span className="text-xs text-gray-300">Actionable Insights</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-900/20 rounded-lg p-3">
                      <h5 className="text-sm font-semibold text-indigo-300 mb-2">Research Metrics</h5>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Insight Lines:</span>
                          <span className="text-xs text-indigo-300">{result.perplexityResearch.insightCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Categories:</span>
                          <span className="text-xs text-indigo-300">{result.perplexityResearch.categories.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Quality:</span>
                          <span className="text-xs text-indigo-300">Research Grade</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {result.perplexityResearch.categories.map((category: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-gradient-to-r from-purple-800/30 to-indigo-800/30 border border-purple-600/50 rounded-full text-xs text-purple-300">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Analysis Metrics */}
              {result.analysisMetrics && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-gray-900/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Quality Score</p>
                    <p className="font-medium text-green-400">{result.analysisMetrics.qualityScore || 0}/100</p>
                  </div>
                  <div className="bg-gray-900/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Slides Created</p>
                    <p className="font-medium text-blue-400">{result.analysisMetrics.slideCount}</p>
                  </div>
                  <div className="bg-gray-900/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Words Extracted</p>
                    <p className="font-medium text-yellow-400">{result.contentQuality?.wordCount || 0}</p>
                  </div>
                  <div className="bg-gray-900/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Data Points</p>
                    <p className="font-medium text-purple-400">{result.contentQuality?.dataPoints || 0}</p>
                  </div>
                  <div className="bg-gray-900/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Entities Found</p>
                    <p className="font-medium text-indigo-400">{result.contentQuality?.entities || 0}</p>
                  </div>
                </div>
              )}

              {/* Content Quality Breakdown */}
              {result.contentQuality && result.contentQuality.score > 0 && (
                <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                  <h5 className="text-sm font-semibold text-gray-300 mb-3">Content Analysis Breakdown</h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Content Quality Level:</span>
                        <span className="text-xs font-medium text-green-300">{result.contentQuality.level}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Text Extraction:</span>
                        <span className="text-xs font-medium text-blue-300">{result.contentQuality.wordCount > 0 ? 'Complete' : 'None'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Data Recognition:</span>
                        <span className="text-xs font-medium text-purple-300">{result.contentQuality.dataPoints > 0 ? 'Detected' : 'None'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Named Entities:</span>
                        <span className="text-xs font-medium text-yellow-300">{result.contentQuality.entities > 0 ? `${result.contentQuality.entities} Found` : 'None'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Dates Identified:</span>
                        <span className="text-xs font-medium text-indigo-300">{result.contentQuality.dates > 0 ? `${result.contentQuality.dates} Found` : 'None'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Comprehensiveness:</span>
                        <span className="text-xs font-medium text-green-300">{result.analysisMetrics?.comprehensiveness}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Elite Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="feature-card">
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-4">
                <EliteStatusIndicator status="ready" />
                <h3 className="font-semibold text-lg transition-colors duration-300 hover:text-blue-400">AI Analysis</h3>
              </div>
              <p className="text-gray-400 transition-colors duration-300 hover:text-gray-300 leading-relaxed">
                Advanced computer vision powered by Google Gemini AI analyzes your images to understand content, context, and key visual elements
              </p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-4">
                <EliteStatusIndicator status="processing" />
                <h3 className="font-semibold text-lg transition-colors duration-300 hover:text-blue-400">Smart Generation</h3>
              </div>
              <p className="text-gray-400 transition-colors duration-300 hover:text-gray-300 leading-relaxed">
                Automatically creates structured presentation content with relevant talking points, professional layouts, and compelling narratives
              </p>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-4">
                <EliteStatusIndicator status="ready" />
                <h3 className="font-semibold text-lg transition-colors duration-300 hover:text-blue-400">Instant Export</h3>
              </div>
              <p className="text-gray-400 transition-colors duration-300 hover:text-gray-300 leading-relaxed">
                Download professional PowerPoint presentations with multiple slides, ready for immediate use in meetings and presentations
              </p>
            </div>
          </div>
        </div>

        {/* Elite Real-time Status Bar */}
        <div className="mt-12 p-6 bg-gray-900/30 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <EliteStatusIndicator status={realTimeStatus} />
              <div>
                <h4 className="font-medium">System Status</h4>
                <p className="text-sm text-gray-400 capitalize">
                  {realTimeStatus === 'ready' && 'Ready to process images'}
                  {realTimeStatus === 'processing' && 'AI analysis in progress...'}
                  {realTimeStatus === 'complete' && 'Processing completed successfully'}
                  {realTimeStatus === 'error' && 'Error occurred, please try again'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Powered by</div>
              <div className="font-medium text-blue-400">Google Gemini AI</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-800 transition-colors duration-300 hover:border-gray-700">
          <p className="text-gray-500 text-sm transition-colors duration-300 hover:text-gray-400">
            Powered by Google Gemini AI • Built with Next.js
          </p>
        </div>
      </div>

    </div>
  );
}
