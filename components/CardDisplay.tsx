import React, { useState, useEffect, useRef } from 'react';
import { DrawnCard, Language } from '../types';
import { UI_TEXT } from '../constants';

interface CardDisplayProps {
  data: DrawnCard;
  index: number;
  compact?: boolean;
  lang: Language;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ data, index, compact = false, lang }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const text = UI_TEXT[lang];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 250 + 100);
    
    return () => {
      clearTimeout(timer);
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [index]);

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Safety Watchdog
  useEffect(() => {
    let watchdog: ReturnType<typeof setTimeout>;
    if (isReading) {
      watchdog = setTimeout(() => {
        if (isReading) {
           console.warn("Audio timeout watchdog triggered.");
           window.speechSynthesis.cancel();
           setIsReading(false);
        }
      }, 30000);
    }
    return () => clearTimeout(watchdog);
  }, [isReading]);

  const handleReadMeaning = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!('speechSynthesis' in window)) return;

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    window.speechSynthesis.cancel();

    let textToRead = "";
    // PRIESTESS: Pitch 0.8, Female
    let pitch = 0.8; 
    let rate = 0.85; 

    if (lang === 'zh') {
      if (data.isReversed) {
        textToRead = "逆位... " + data.card.name + "... 勿驚慌，慈悲指引： " + data.card.meaningReversed;
      } else {
        textToRead = "正位... " + data.card.name + "... 指引是： " + data.card.meaningUpright;
      }
    } else {
      if (data.isReversed) {
        textToRead = "Reversed... " + data.card.name + "... Do not fear... The guidance is: " + data.card.meaningReversed;
      } else {
        textToRead = "Upright... " + data.card.name + "... The meaning is: " + data.card.meaningUpright;
      }
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utteranceRef.current = utterance;

    const voices = window.speechSynthesis.getVoices();
    let preferredVoice;
    
    // PRIESTESS VOICE LOGIC: FEMALE PRIORITY
    if (lang === 'zh') {
      const zhVoices = voices.filter(v => v.lang.includes('zh') || v.lang.includes('TW'));
      preferredVoice = 
        zhVoices.find(v => (v.name.includes('Female') || v.name.includes('Yating') || v.name.includes('Huihui') || v.name.includes('Google'))) ||
        zhVoices[0];
    } else {
      const enVoices = voices.filter(v => v.lang.startsWith('en'));
      preferredVoice = 
        enVoices.find(v => v.name.includes('Google') && v.lang.includes('US') && (v.name.includes('Female') || !v.name.includes('Male'))) ||
        enVoices.find(v => v.lang.includes('US') && !v.name.includes('Male')) ||
        enVoices.find(v => v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Female')) ||
        enVoices[0];
    }

    if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.lang = preferredVoice.lang;
    } else {
        utterance.lang = lang === 'zh' ? 'zh-TW' : 'en-US';
    }
    
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => {
      setIsReading(false);
      utteranceRef.current = null;
    };
    utterance.onerror = () => setIsReading(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Icon selection helper
  const renderProductIcon = () => {
    if (data.productIcon === 'USB') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path fillRule="evenodd" d="M7 2a1 1 0 011-1h8a1 1 0 011 1v5a3 3 0 01-1.5 2.6V21a1 1 0 01-1 1H9a1 1 0 01-1 1V9.6A3 3 0 016.5 7V2a1 1 0 01.5-1zM9 4v3h6V4H9z" clipRule="evenodd" />
        </svg>
      );
    } else if (data.productIcon === 'COIN') {
      return <span className="text-3xl">🪙</span>;
    } else if (data.productIcon === 'ART') {
      return <span className="text-3xl">🏺</span>;
    }
    return <span className="text-3xl">📦</span>;
  };

  return (
    <div 
      className={`
        transform transition-all duration-1000 cubic-bezier(0.175, 0.885, 0.32, 1.275)
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
        flex flex-col items-center w-full h-full justify-center perspective-1000
      `}
    >
      {/* Position Label */}
      {data.positionLabel && (
        <div className="mb-3 bg-white/90 backdrop-blur border border-gray-200 text-gray-800 px-4 py-1 rounded-full shadow-sm z-10">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">{data.positionLabel}</span>
        </div>
      )}

      {/* FLIP CARD CONTAINER */}
      <div 
        onClick={toggleFlip}
        className={`
          relative w-full aspect-[2/2.2] max-w-[380px] max-h-[45vh] cursor-pointer group
          transition-transform duration-1000 transform-style-3d rounded-2xl
          ${isFlipped ? 'rotate-y-180' : 'hover:-translate-y-2 hover:shadow-2xl'}
          ${data.isReversed && !isFlipped ? 'rotate-180' : ''}
        `}
      >
        {/* Drop Shadow */}
        <div className="absolute inset-0 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-shadow duration-500 pointer-events-none"></div>

        {/* === FRONT FACE (Exquisite Product Design) === */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full bg-white border-double border-4 border-primary/30 rounded-2xl flex flex-col relative overflow-hidden shadow-inner">
            
            {/* Texture & Metallic Effects */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#b91c1c_0.5px,transparent_0.5px)] [background-size:12px_12px]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-gray-50 opacity-80"></div>
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-gold/60 rounded-tl-lg"></div>
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-gold/60 rounded-tr-lg"></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-gold/60 rounded-bl-lg"></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-gold/60 rounded-br-lg"></div>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-20"></div>

            <div className="absolute top-0 right-0 p-2 z-30 opacity-80 group-hover:opacity-100 transition-opacity">
               <div className="w-10 h-10 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-2xl flex items-start justify-end p-1">
                 <span className="text-primary text-lg animate-pulse">↻</span>
               </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-[3px] relative z-10">
              
              <span className="text-2xl font-serif font-bold text-gold/80 tracking-widest mb-0 drop-shadow-sm">
                {data.card.roman}
              </span>

              <h3 className={`${lang === 'en' ? 'text-3xl' : 'text-4xl md:text-5xl'} font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-700 tracking-tighter text-center mb-2 drop-shadow-sm leading-tight px-1`}>
                {data.card.name}
              </h3>

              {/* Tech Spec Box - OS Info */}
              <div className="w-full max-w-[90%] text-center mb-2 group-hover:scale-105 transition-transform duration-500">
                <div className="bg-gray-900 text-green-400 p-1.5 rounded md font-mono text-left relative overflow-hidden border-l-4 border-green-500 shadow-lg ring-1 ring-white/50">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                  <p className="text-[7px] text-gray-500 uppercase tracking-widest mb-0 border-b border-gray-800 flex justify-between">
                    <span>SYSTEM_TARGET</span>
                    <span className="animate-pulse">●</span>
                  </p>
                  <p className="text-xl md:text-2xl font-bold truncate leading-tight mt-0.5 font-sans">
                    {'>'} {data.recommendedOS}{lang === 'zh' ? ' 金士頓隨身碟' : ' Kingston USB'}
                  </p>
                </div>
              </div>

              {/* === DYNAMIC PRODUCT BADGE === */}
              <div className="relative mt-2 transform rotate-[-2deg] hover:rotate-0 transition-all duration-300 hover:scale-105 z-20 group/badge">
                 <div className="absolute inset-0 bg-black/40 translate-y-1 translate-x-1 blur-[1px] rounded"></div>
                 <div className="relative bg-gradient-to-br from-red-600 to-primary text-white px-4 py-2 rounded shadow-inner border border-white/30 ring-1 ring-black/10 flex items-center gap-2">
                    
                    <div className="hidden md:flex flex-col gap-[1px] h-8 border-r border-white/30 pr-2 mr-2 opacity-80">
                      {[...Array(6)].map((_,i) => (
                        <div key={i} className="bg-white h-full w-[1px]" style={{height: Math.random() * 100 + '%'}}></div>
                      ))}
                    </div>

                    {/* Dynamic Icon */}
                    <div className="text-white drop-shadow-md filter brightness-110 group-hover/badge:animate-bounce">
                      {renderProductIcon()}
                    </div>
                    <div className="flex flex-col items-start leading-none">
                       <div className="flex items-center gap-1 mb-0.5">
                         <span className="bg-yellow-300 text-black text-[8px] font-black px-1 rounded-sm uppercase tracking-wider shadow-sm">{text.product_official}</span>
                         <span className="text-[8px] text-red-100 font-bold tracking-[0.2em] uppercase">V4.9.0</span>
                       </div>
                       <span className="text-xl font-black tracking-tighter uppercase" style={{textShadow: '0 2px 0 rgba(100,0,0,0.5)'}}>{data.productName}</span>
                    </div>
                 </div>
              </div>

              <div className="absolute bottom-20 w-full flex justify-center z-30">
                <p className="text-pink-600 font-serif italic font-black text-xl md:text-2xl flex items-center gap-1 bg-white/95 px-4 py-1 rounded-full backdrop-blur-md border-2 border-pink-400 shadow-2xl animate-pulse-slow" style={{textShadow: '0 1px 0 rgba(255,255,255,0.8)'}}>
                   <span className="animate-pulse text-red-600 text-2xl">♥</span> {data.aiPhrase}
                </p>
              </div>
            </div>

            <div className="h-10 bg-gradient-to-r from-primary to-red-700 text-white flex items-center justify-center gap-2 transition-all hover:brightness-110 cursor-pointer relative overflow-hidden border-t border-white/20 shadow-[0_-5px_10px_rgba(0,0,0,0.1)]">
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <span className="text-lg animate-bounce">👆</span>
              <p className="text-xs font-black tracking-[0.15em] uppercase z-10 drop-shadow-md">
                {text.card_flip_hint}
              </p>
            </div>
          </div>
        </div>

        {/* === BACK FACE (Reading) === */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full bg-[#fffbf7] border-double border-4 border-primary/20 rounded-2xl flex flex-col p-3 relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{filter: 'contrast(120%) brightness(100%)'}}>
               <svg width="100%" height="100%">
                 <filter id="noise">
                   <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                 </filter>
                 <rect width="100%" height="100%" filter="url(#noise)" opacity="0.15" />
               </svg>
            </div>

            <div className="flex justify-between items-end border-b-2 border-primary/10 pb-2 mb-2 relative z-10 shrink-0">
              <div className="flex flex-col overflow-hidden">
                 <span className="text-[9px] text-primary/60 font-bold tracking-[0.3em] uppercase mb-0.5">Interpretation</span>
                 <span className={`${lang === 'en' ? 'text-lg' : 'text-xl'} font-serif font-black text-gray-800 truncate`}>{data.card.name}</span>
              </div>
              <div className={`shrink-0 px-2 py-0.5 rounded border ${
                data.isReversed 
                  ? 'bg-gray-200 text-gray-600 border-gray-300' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                <span className="text-sm font-bold whitespace-nowrap">{data.isReversed ? text.card_reversed : text.card_upright}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 relative z-10">
               <p className="text-sm text-gray-800 font-medium leading-relaxed text-justify">
                 {data.isReversed ? data.card.meaningReversed : data.card.meaningUpright}
               </p>
            </div>

            <div className="mt-2 pt-2 border-t border-primary/10 relative z-10 text-center shrink-0">
              <button 
                onClick={handleReadMeaning}
                className={`
                  w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5
                  ${isReading 
                    ? 'bg-purple-100 text-purple-800 border-purple-300 ring-2 ring-purple-200' 
                    : 'bg-gradient-to-r from-purple-50 to-white text-purple-700 border border-purple-200 hover:border-purple-400'
                  }
                `}
              >
                {/* V3.0 PRIESTESS ICON */}
                <span className="text-base bg-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 border border-purple-100 shadow-sm">
                    {isReading ? '⏹' : '🧝‍♀️'}
                </span>
                <span className="text-[10px] md:text-xs tracking-wider text-left leading-tight truncate uppercase font-black">
                  {isReading 
                    ? 'Silence...' 
                    : (data.isReversed ? text.card_listen_rev : text.card_listen_up)}
                </span>
              </button>
              <p className="text-[10px] text-red-600 mt-1 font-serif font-bold tracking-widest animate-pulse">
                {text.card_sincerity}
              </p>
            </div>

            <div className="mt-auto pt-2 text-center relative z-10 border-t border-gray-200/50 shrink-0">
               <p className="text-[10px] font-bold tracking-wider text-gray-800">
                 <span className="text-primary font-black">FOXOKISO</span> <span className="mx-1 text-gray-400">|</span> 
                 <a href="http://pk530.fun" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline decoration-dotted underline-offset-2 text-gray-800">
                   pk530.fun (弱勢團結網站)
                 </a>
               </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CardDisplay;