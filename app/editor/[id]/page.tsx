'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import '../../../app/globals.css';

// Enhanced SVG icons
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-300">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-300">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-300">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/>
    <polyline points="7,3 7,8 15,8"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-300">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const AddIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-300">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-300">
    <polyline points="3,6 5,6 21,6"/>
    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
  </svg>
);

const PdfIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-all duration-300 group-hover:scale-110">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
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

interface EditableSlide {
  id: number;
  title: string;
  content: string;
}

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="progress-bar elite-interactive">
    <div className="progress-fill" style={{ width: `${progress}%` }} />
  </div>
);

export default function LiveEditor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [slidesData, setSlidesData] = useState<SlideData | null>(null);
  const [editedSlides, setEditedSlides] = useState<EditableSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState('');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First try to get data from API
        const response = await fetch(`/api/slides?id=${params.id}`);
        
        if (response.ok) {
          const data = await response.json();
          setSlidesData(data);
          
          // Parse slides for editing
          const parsedSlides = parseContentToSlides(data.content);
          setEditedSlides(parsedSlides);
        } else {
          // Fallback to localStorage
          console.log('API failed, trying localStorage...');
          const data = localStorage.getItem(`slides_${params.id}`);
          if (data) {
            try {
              const parsedData = JSON.parse(data);
              setSlidesData(parsedData);
              const parsedSlides = parseContentToSlides(parsedData.content);
              setEditedSlides(parsedSlides);
            } catch (err) {
              console.error('Error parsing localStorage data:', err);
              setError('Failed to load slides data - corrupted data');
            }
          } else {
            setError('Slides data not found. Please go back and regenerate your slides.');
          }
        }
      } catch (err) {
        console.error('Error loading slides:', err);
        // Final fallback to localStorage
        try {
          const data = localStorage.getItem(`slides_${params.id}`);
          if (data) {
            const parsedData = JSON.parse(data);
            setSlidesData(parsedData);
            const parsedSlides = parseContentToSlides(parsedData.content);
            setEditedSlides(parsedSlides);
          } else {
            setError('Failed to load slides data. Please try regenerating your slides.');
          }
        } catch (parseErr) {
          setError('Failed to load slides data. Please try regenerating your slides.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSlides();
  }, [params.id]);

  const parseContentToSlides = (content: string): EditableSlide[] => {
    const slides: EditableSlide[] = [];
    const sections = content.split('Slide ').slice(1);
    
    sections.forEach((section: string, index: number) => {
      const lines = section.trim().split('\n');
      const title = lines[0].replace(/^\d+:\s*/, '').trim();
      const slideContent = lines.slice(1).join('\n').trim();
      
      slides.push({
        id: index + 1,
        title,
        content: slideContent
      });
    });
    
    return slides.length > 0 ? slides : [{ id: 1, title: 'New Slide', content: 'Add your content here...' }];
  };

  const generateContentFromSlides = (slides: EditableSlide[]): string => {
    return slides.map((slide: EditableSlide, index: number) => 
      `Slide ${index + 1}: ${slide.title}\n${slide.content}`
    ).join('\n\n');
  };

  const debouncedSave = useCallback(async (slides: EditableSlide[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        setSaveStatus('Saving...');
        
        const updatedContent = generateContentFromSlides(slides);
        const updatedData = { ...slidesData, content: updatedContent };
        
        console.log('Attempting to save slides with ID:', params.id);
        console.log('Updated data:', updatedData);
        
        const response = await fetch(`/api/slides?id=${params.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });
        
        const responseData = await response.json();
        console.log('Save response:', responseData);
        
        if (response.ok && responseData.success) {
          setSaveStatus('Saved ✓');
          if (slidesData) {
            setSlidesData({ ...slidesData, content: updatedContent });
          }
          localStorage.setItem(`slides_${params.id}`, JSON.stringify(updatedData));
        } else {
          console.error('Save failed:', responseData);
          setSaveStatus('Save failed - retrying...');
          
          // Fallback to localStorage save
          localStorage.setItem(`slides_${params.id}`, JSON.stringify(updatedData));
          setSaveStatus('Saved locally ✓');
        }
      } catch (err) {
        console.error('Save error:', err);
        setSaveStatus('Save error - saved locally');
        
        // Always save to localStorage as fallback
        try {
          const updatedContent = generateContentFromSlides(slides);
          const updatedData = { ...slidesData, content: updatedContent };
          localStorage.setItem(`slides_${params.id}`, JSON.stringify(updatedData));
        } catch (localErr) {
          console.error('LocalStorage save failed:', localErr);
        }
      } finally {
        setIsSaving(false);
        setTimeout(() => setSaveStatus(''), 3000);
      }
    }, 500);
  }, [params.id, slidesData]);

  const updateSlide = (slideId: number, field: keyof EditableSlide, value: string) => {
    const newSlides = editedSlides.map(slide =>
      slide.id === slideId ? { ...slide, [field]: value } : slide
    );
    setEditedSlides(newSlides);
    debouncedSave(newSlides);
  };

  const addSlide = () => {
    const newSlide: EditableSlide = {
      id: editedSlides.length + 1,
      title: 'New Slide',
      content: 'Add your content here...'
    };
    const newSlides = [...editedSlides, newSlide];
    setEditedSlides(newSlides);
    debouncedSave(newSlides);
  };

  const deleteSlide = (slideId: number) => {
    if (editedSlides.length <= 1) return;
    
    const newSlides = editedSlides
      .filter(slide => slide.id !== slideId)
      .map((slide, index) => ({ ...slide, id: index + 1 }));
    
    setEditedSlides(newSlides);
    debouncedSave(newSlides);
  };

  const generatePowerPoint = useCallback(async () => {
    try {
      setIsGeneratingPPT(true);
      setProgress(0);
      setError(null);
      
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 200);
      
      const updatedContent = generateContentFromSlides(editedSlides);
      
      const response = await fetch('/api/generate-pptx-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updatedContent }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `snap2slides-pro-edited-${new Date().toISOString().slice(0, 10)}.pptx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
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
  }, [editedSlides]);

  const generatePDF = useCallback(async () => {
    if (!editedSlides.length) return;
    
    try {
      setIsGeneratingPDF(true);
      setProgress(0);
      setError(null);
      
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
          slides: editedSlides,
          title: slidesData?.fileName?.replace(/\.[^/.]+$/, "") || 'AI Generated Presentation'
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
        a.download = `${slidesData?.fileName?.replace(/\.[^/.]+$/, "") || 'snap2slides-presentation'}.pdf`;
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
  }, [editedSlides, slidesData]);

  const goBack = () => {
    router.push(`/viewer/${params.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={goBack} className="btn-primary">
            <BackIcon />
            Back to Viewer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button onClick={goBack} className="btn-secondary group">
              <BackIcon />
              <span>Back to Viewer</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold elite-title flex items-center space-x-3">
                <EditIcon />
                <span>Live <span className="text-blue-500">Editor</span></span>
              </h1>
              <p className="text-gray-400">Edit your slides in real-time</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Save Status */}
            <div className="flex items-center space-x-2">
              {isSaving && (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}
              <span className={`text-sm ${
                saveStatus.includes('✓') ? 'text-green-400' : 
                saveStatus.includes('Failed') ? 'text-red-400' : 'text-gray-400'
              }`}>
                {saveStatus}
              </span>
            </div>
            
            {/* Action Buttons */}
            <button onClick={addSlide} className="btn-secondary group">
              <AddIcon />
              <span>Add Slide</span>
            </button>
            
            <button 
              onClick={generatePowerPoint}
              disabled={isGeneratingPPT || isGeneratingPDF}
              className="btn-primary elite-interactive bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 flex items-center space-x-2 disabled:opacity-50"
            >
              <DownloadIcon />
              <span>{isGeneratingPPT ? 'Generating...' : 'Download PowerPoint'}</span>
            </button>
            
            <button 
              onClick={generatePDF}
              disabled={isGeneratingPDF || isGeneratingPPT}
              className="btn-primary elite-interactive bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 flex items-center space-x-2 disabled:opacity-50"
            >
              <PdfIcon />
              <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Download Progress */}
        {(isGeneratingPPT || isGeneratingPDF) && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-900/30 rounded-xl">
            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
              <span>
                {isGeneratingPPT && 'Generating PowerPoint with your edits...'}
                {isGeneratingPDF && 'Generating PDF document with your edits...'}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <ProgressBar progress={progress} />
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

        {/* Live Editor Grid */}
        <div className="grid gap-8">
          {editedSlides.map((slide) => (
            <div key={slide.id} className="card elite-interactive bg-gradient-to-br from-gray-900/60 to-gray-800/60 border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                    {slide.id}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                      className="slide-title-input w-full"
                      placeholder="Slide Title"
                    />
                  </div>
                </div>
                
                {editedSlides.length > 1 && (
                  <button 
                    onClick={() => deleteSlide(slide.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-lg transition-all duration-300"
                  >
                    <DeleteIcon />
                  </button>
                )}
              </div>
              
              <div className="bg-gray-900/30 rounded-xl border-l-4 border-blue-500/50 overflow-hidden">
                <textarea
                  value={slide.content}
                  onChange={(e) => updateSlide(slide.id, 'content', e.target.value)}
                  className="live-editor-textarea w-full p-6 min-h-[150px]"
                  placeholder="Add your slide content here..."
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Live Editor • Auto-saves your changes • Snap2Slides Pro
          </p>
        </div>
      </div>
    </div>
  );
}
