
import React, { useState, useRef, useCallback } from 'react';
import { Header, Footer } from './components/Layout';
import { generatePartnerImage } from './services/geminiService';
import { AppStatus, ImageData, MatchStyle } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [sourceImage, setSourceImage] = useState<ImageData | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<MatchStyle>('Romantic');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSourceImage({
        base64,
        mimeType: file.type
      });
      setStatus(AppStatus.IDLE);
      setResultImage(null);
    };
    reader.readAsDataURL(file);
  };

  const onGenerate = async () => {
    if (!sourceImage) return;

    try {
      setStatus(AppStatus.GENERATING);
      setError(null);
      const result = await generatePartnerImage(sourceImage, selectedStyle);
      setResultImage(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      setError("Failed to generate partner. Please try again with a clearer photo.");
      setStatus(AppStatus.ERROR);
    }
  };

  const reset = () => {
    setSourceImage(null);
    setResultImage(null);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  const styles: MatchStyle[] = ['Romantic', 'Cinematic', 'Casual', 'Formal'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Intro Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              AI-Powered <span className="text-pink-500">Soulmate</span> Visualization
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Upload your photo and let our AI create a unique, beautiful image of you with a partner matched specifically for you.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2 gap-0">
              
              {/* Left Side: Upload/Preview */}
              <div className="p-8 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col items-center justify-center min-h-[400px]">
                {!sourceImage ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full min-h-[300px] border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-pink-500 hover:bg-pink-500/5 transition-all group"
                  >
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fas fa-cloud-upload-alt text-2xl text-slate-400 group-hover:text-pink-500"></i>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-slate-300">Click to upload your photo</p>
                      <p className="text-xs text-slate-500 mt-1">JPG, PNG up to 10MB</p>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <div className="relative group">
                      <img 
                        src={sourceImage.base64} 
                        alt="Original" 
                        className="w-full h-auto max-h-[400px] object-cover rounded-xl shadow-lg border border-slate-700" 
                      />
                      <button 
                        onClick={reset}
                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <p className="text-center text-sm text-slate-500">Original Photo</p>
                  </div>
                )}
              </div>

              {/* Right Side: Controls/Result */}
              <div className="p-8 bg-slate-900/50 flex flex-col">
                {status === AppStatus.IDLE || status === AppStatus.GENERATING || status === AppStatus.ERROR ? (
                  <div className="flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <i className="fas fa-magic text-pink-500"></i> Magic Controls
                    </h3>

                    <div className="space-y-6 flex-grow">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-3">Choose Theme</label>
                        <div className="grid grid-cols-2 gap-3">
                          {styles.map(style => (
                            <button
                              key={style}
                              onClick={() => setSelectedStyle(style)}
                              className={`py-3 px-4 rounded-xl border transition-all text-sm font-medium ${
                                selectedStyle === style 
                                ? 'bg-pink-500 border-pink-400 text-white shadow-lg shadow-pink-500/20' 
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-sm text-slate-400">
                        <ul className="space-y-2">
                          <li className="flex gap-2"><i className="fas fa-random text-pink-500 mt-1"></i> Unique features every time</li>
                          <li className="flex gap-2"><i className="fas fa-check-circle text-green-500 mt-1"></i> Seamless background blending</li>
                          <li className="flex gap-2"><i className="fas fa-check-circle text-green-500 mt-1"></i> High-level realism</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8">
                      {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex gap-2 items-center">
                          <i className="fas fa-exclamation-triangle"></i> {error}
                        </div>
                      )}
                      
                      <button
                        onClick={onGenerate}
                        disabled={!sourceImage || status === AppStatus.GENERATING}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                          !sourceImage || status === AppStatus.GENERATING
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-pink-500 to-violet-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-pink-500/20'
                        }`}
                      >
                        {status === AppStatus.GENERATING ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i>
                            Creating a unique match...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-wand-sparkles"></i>
                            Generate Partner
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-slate-600 mt-2 text-center uppercase tracking-tighter">Every generation produces a different result</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center">
                    <div className="w-full space-y-4">
                      <div className="relative group overflow-hidden rounded-xl border border-pink-500/30">
                        <img 
                          src={resultImage || ''} 
                          alt="Result" 
                          className="w-full h-auto max-h-[500px] object-cover" 
                        />
                        <div className="absolute top-4 left-4">
                           <span className="bg-pink-500 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest">Unique Result</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = resultImage || '';
                            link.download = 'ai-match.png';
                            link.click();
                          }}
                          className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
                        >
                          <i className="fas fa-download"></i> Save
                        </button>
                        <button 
                          onClick={() => setStatus(AppStatus.IDLE)}
                          className="flex items-center justify-center gap-2 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-medium transition-colors"
                        >
                          <i className="fas fa-redo"></i> New Match
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-pink-500/30 transition-all">
              <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-bolt text-pink-500"></i>
              </div>
              <h4 className="text-xl font-bold mb-2">Diverse AI</h4>
              <p className="text-slate-400 text-sm">Our AI randomly selects unique features for every single generation to ensure variety.</p>
            </div>
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-pink-500/30 transition-all">
              <div className="w-12 h-12 bg-violet-500/10 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-user-friends text-violet-500"></i>
              </div>
              <h4 className="text-xl font-bold mb-2">Natural Interaction</h4>
              <p className="text-slate-400 text-sm">The generated partner is placed realistically with correct lighting and shadows.</p>
            </div>
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-pink-500/30 transition-all">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-lock text-blue-500"></i>
              </div>
              <h4 className="text-xl font-bold mb-2">Infinite Possibilities</h4>
              <p className="text-slate-400 text-sm">Don't like the first result? Click "New Match" to see a completely different person.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
