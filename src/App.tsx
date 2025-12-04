
import React, { useState, useEffect, useRef } from 'react';
import { UI_TEXT, BOOK_CONTENT_ZH, BOOK_CONTENT_EN, PRODUCTS, BROADCAST_SCRIPT, SYSTEM_BOOT_SEQUENCE, MIGRATION_ANNOUNCEMENT, USB_ENGRAVINGS, OSC_CATALOG, REVIEWS_DATA, DECISION_PHRASES, GOD_SHOP_ITEMS, GOD_LOUNGE_TEXT, AVATAR_MSG, VILLAIN_TOOLS, GOD_PETS, GOD_SECRET_ITEMS, GOD_SPELLS, REGISTRATION_TEXT, GOD_ARTIFACTS, GEMINI_DB_OPINION } from './constants';
import { drawCards } from './services/tarotService';
import { DrawnCard, Language, SpreadType } from './types';
import CardDisplay from './components/CardDisplay';
import FoxokisoTotem from './components/FoxokisoTotem';

// --- HELPER: PRIESTESS SLOGAN (READ TWICE) ---
const speakSlogan = () => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const text = "Change Your Life by USB... ... Change Your Life by USB.";
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 1.2; 
  utterance.rate = 0.85; 
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = 
        voices.find(v => v.name.includes('Google') && v.lang.includes('US') && (v.name.includes('Female') || !v.name.includes('Male'))) ||
        voices.find(v => v.name.includes('Samantha')) ||
        voices[0];
  if (preferredVoice) utterance.voice = preferredVoice;
  window.speechSynthesis.speak(utterance);
};

// --- COMPONENT: GOD'S HORIZON ---
const GodHorizon: React.FC = () => (
  <div className="fixed bottom-0 left-0 w-full h-[4px] z-[999] pointer-events-none overflow-hidden">
     <div className="absolute inset-0 bg-gold/40 backdrop-blur-sm"></div>
     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent w-1/2 blur-[2px] animate-scan-horizontal opacity-80"></div>
     <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-gold/20 to-transparent"></div>
     <style>{` .animate-scan-horizontal { animation: scan-horizontal 3s linear infinite; } @keyframes scan-horizontal { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } } `}</style>
  </div>
);

// --- COMPONENT: LOGO REVEAL (BRAINWAVE LEVEL) ---
const LogoReveal: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    setTimeout(() => setStage(1), 100);
    setTimeout(() => setStage(2), 2500); // Longer duration for imprint
    setTimeout(() => { onComplete(); }, 3500);
  }, [onComplete]);
  return (
    <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center overflow-hidden">
       <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
       <div className={`transition-all duration-1000 transform ${stage === 2 ? 'scale-150 opacity-0 blur-xl' : 'scale-100 opacity-100'}`}>
          <div className="relative flex flex-col items-center">
             <div className={`absolute inset-0 bg-white/50 blur-3xl rounded-full transition-all duration-500 ${stage >= 1 ? 'scale-150 opacity-20' : 'scale-0 opacity-0'}`}></div>
             <FoxokisoTotem className={`w-64 h-64 md:w-96 md:h-96 text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] transition-all duration-[2000ms] ease-out ${stage >= 1 ? 'stroke-dashoffset-0 opacity-100 scale-100' : 'opacity-0 scale-50'}`} color="#ffffff" />
             <div className={`absolute -bottom-10 w-full text-center transition-all duration-500 delay-1000 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-5xl font-black text-white tracking-[0.5em] font-serif uppercase drop-shadow-[0_0_20px_white]">FOXOKISO</h1>
                <p className="text-[12px] text-gray-400 tracking-[1em] mt-4 uppercase font-mono border-t border-gray-800 pt-2">PERFECT SYSTEM ENCAPSULATION</p>
             </div>
          </div>
       </div>
    </div>
  );
};

// --- PHANTOM ONE VISUAL ---
const PhantomOneVisual: React.FC<{ size?: string, label?: string, fontSize?: string, value?: string }> = ({ size = "w-48 h-48", label = "ONLY ONE", fontSize = "text-8xl", value = "1" }) => (
  <div className={`relative ${size} flex items-center justify-center my-6 group select-none`}>
      <div className={`absolute inset-0 blur-3xl rounded-full animate-pulse-slow ${value === '0' ? 'bg-gray-800/50' : 'bg-red-500/10'}`}></div>
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <div key={i} className={`absolute w-[80%] h-[80%] border transition-colors ${value === '0' ? 'border-gray-600/30' : 'border-gray-400/30 group-hover:border-red-500/50'}`} style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', transform: `rotate(${deg}deg)`, animation: `spin ${20 + i * 5}s linear infinite` }}></div>
      ))}
      {[0, 120, 240].map((deg, i) => (
        <div key={`in-${i}`} className={`absolute w-[60%] h-[60%] border-2 ${value === '0' ? 'border-red-900/40' : 'border-gold/60'}`} style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', transform: `rotate(${deg + 180}deg)`, animation: `spin ${15}s linear infinite reverse` }}></div>
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
         <span className={`${fontSize} font-black text-transparent bg-clip-text bg-gradient-to-b ${value === '0' ? 'from-gray-500 to-black' : 'from-gray-800 to-black'} drop-shadow-2xl font-serif mt-2`}>{value}</span>
         {label && <span className={`absolute bottom-[20%] text-white text-[10px] font-black px-2 py-0.5 rounded tracking-[0.2em] shadow-lg whitespace-nowrap ${value === '0' ? 'bg-gray-800 text-red-500' : 'bg-red-600'}`}>{label}</span>}
      </div>
      <style>{` @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
  </div>
);

// --- JACK AVATAR VISUAL ---
const JackAvatarVisual: React.FC<{ variant: 'HUMAN' | 'NAVI' }> = ({ variant }) => (
    <div className="w-32 h-32 relative mx-auto my-4 animate-float-up">
        {variant === 'HUMAN' ? (
          <>
            <div className="absolute inset-0 bg-yellow-400/30 blur-xl rounded-full animate-pulse-slow"></div>
            <div className="absolute inset-2 bg-[#ffdbc5] rounded-[40%] shadow-lg border-2 border-yellow-200 overflow-hidden">
              <div className="absolute -top-4 -left-4 w-[120%] h-12 bg-yellow-400 rounded-b-[50%] skew-y-6 rotate-[-10deg] shadow-sm"></div>
              <div className="absolute top-[40%] left-[25%] w-3 h-3 bg-blue-500 rounded-full border-2 border-black/50"><div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full"></div></div>
              <div className="absolute top-[42%] right-[25%] w-4 h-1 bg-black/50 rounded-full rotate-[10deg]"></div>
              <div className="absolute bottom-[25%] left-[30%] w-[40%] h-[15%] bg-white rounded-b-full border-b-2 border-black/20 overflow-hidden"><div className="w-full h-1/2 bg-red-400/50 mt-auto"></div></div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-black/80 rounded-full border-t border-gray-600"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full animate-pulse-slow"></div>
            <div className="absolute inset-2 bg-blue-500 rounded-[40%] shadow-lg border-2 border-blue-300 overflow-visible">
               <div className="absolute top-[30%] -left-3 w-4 h-8 bg-blue-500 rounded-l-full border border-blue-400 rotate-[-10deg]"></div>
               <div className="absolute top-[30%] -right-3 w-4 h-8 bg-blue-500 rounded-r-full border border-blue-400 rotate-[10deg]"></div>
               <div className="absolute top-[40%] left-[25%] w-4 h-3 bg-yellow-300 rounded-[80%] border border-black overflow-hidden flex items-center justify-center"><div className="w-1 h-3 bg-black rounded-full"></div></div>
               <div className="absolute top-[40%] right-[25%] w-4 h-3 bg-yellow-300 rounded-[80%] border border-black overflow-hidden flex items-center justify-center"><div className="w-1 h-3 bg-black rounded-full"></div></div>
               <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-6 h-1 bg-blue-800 rounded-full"></div>
            </div>
          </>
        )}
        <div className="absolute top-0 right-0 text-yellow-500 text-xl animate-bounce">✨</div>
    </div>
);

// --- SYSTEM BOOT ---
const SystemBoot: React.FC<{ onComplete: () => void, userLocation: string }> = ({ onComplete, userLocation }) => {
  const [lines, setLines] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let delay = 0;
    const TOTAL_LINES = SYSTEM_BOOT_SEQUENCE.length;
    const LINE_DURATION = 30; 
    SYSTEM_BOOT_SEQUENCE.forEach((line, index) => {
      delay += LINE_DURATION;
      setTimeout(() => {
        let displayLine = line;
        if (line.includes('[IP RECONNAISSANCE]')) displayLine = userLocation ? `> TARGET LOCATED: ${userLocation}` : `> TARGET LOCATED: UNKNOWN`;
        setLines(prev => [...prev, displayLine]);
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        if (index === TOTAL_LINES - 1) setTimeout(onComplete, 800);
      }, delay);
    });
  }, [onComplete, userLocation]);
  return (
    <div onClick={onComplete} className="fixed inset-0 z-[200] bg-black font-mono p-4 text-green-500 flex flex-col justify-end pb-10 cursor-pointer">
      <div className="overflow-hidden flex flex-col justify-end h-full mask-image-gradient" ref={scrollRef}>
        {lines.map((line, i) => <div key={i} className="mb-1 text-xs md:text-sm font-bold tracking-wider whitespace-nowrap">{line}</div>)}
      </div>
    </div>
  );
};

// --- REGISTRATION GATE (BLACK GATE + BRIDGE DOCTOR) ---
const RegistrationGate: React.FC<{ lang: Language, onRegister: () => void }> = ({ lang, onRegister }) => {
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [status, setStatus] = useState<'idle' | 'writing' | 'done'>('idle');
  const [isTestMode, setIsTestMode] = useState(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  
  // @ts-ignore
  const text = REGISTRATION_TEXT[lang];
  // REMOTE VM ADDRESS
  const BRIDGE_URL = "http://pk530.fun/fox_gate.php"; 

  const handleSign = async () => {
    if (!username || !email || !password) return alert("Required fields missing.");
    setStatus('writing');
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'SIGN');
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password_hash', password); 
        const res = await fetch(BRIDGE_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData });
        
        // PHP 4 might not return proper headers, but if text comes back it's ok
        const textData = await res.text();
        try {
            const data = JSON.parse(textData);
            if (data.status === 'success') {
                setStatus('done');
                setTimeout(onRegister, 1500);
            } else {
                alert(`Failed: ${data.message}`);
                setStatus('idle');
            }
        } catch (jsonErr) {
            console.error("Raw Text:", textData);
            // Fallback: If bridge fails, allow guest entry for now to not block user
            console.warn("JSON Parse Error (Legacy PHP output?). Allowing Entry.");
            setTimeout(onRegister, 1500);
        }
    } catch (e) {
        // Network Error - Allow Guest
        setTimeout(onRegister, 1500);
    }
  };

  const checkBridge = async () => {
      setTestLogs(prev => [...prev, "> PINGING pk530.fun..."]);
      try {
          const res = await fetch(BRIDGE_URL, { method: 'GET', mode: 'no-cors' }); 
          setTestLogs(prev => [...prev, "> STATUS: ALIVE (Opaque Response)"]);
          setTestLogs(prev => [...prev, "> BRIDGE SEEMS CONNECTED."]);
      } catch (e) {
          setTestLogs(prev => [...prev, "> ERROR: UNREACHABLE."]);
          setTestLogs(prev => [...prev, "> CHECK: Is fox_gate.php on server?"]);
      }
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black flex items-center justify-center p-4 font-serif">
       <div className="w-full max-w-md border-8 border-gray-900 bg-black p-8 relative shadow-lg text-center animate-zoom-in ring-4 ring-gray-800">
          <FoxokisoTotem className="w-24 h-24 mx-auto mb-6 text-gray-200 animate-pulse-slow relative z-10" />
          <h1 className="text-3xl font-black text-white tracking-[0.2em] mb-2 uppercase relative z-10">{text.title}</h1>
          <p className="text-sm text-gray-400 mb-8 relative z-10">{text.desc}</p>
          <div className="relative z-10 space-y-4">
            {status === 'idle' && !isTestMode && (
                <>
                <input type="text" placeholder={text.name_ph} value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white p-3 text-center" />
                <input type="email" placeholder={text.email_ph} value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white p-3 text-center" />
                <input type="password" placeholder={text.password_ph} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white p-3 text-center" />
                <button onClick={handleSign} className="w-full bg-white text-black font-black py-4 uppercase tracking-[0.3em] hover:bg-gray-200 mt-4">{text.submit}</button>
                <button onClick={onRegister} className="text-xs text-gray-600 uppercase tracking-widest mt-2">{text.guest}</button>
                </>
            )}
            
            {isTestMode && (
                <div className="bg-gray-900/90 border border-green-500/50 p-4 rounded text-left font-mono text-xs text-green-400 relative">
                    <h3 className="text-green-500 font-bold border-b border-green-500/30 pb-2 mb-2">BRIDGE DOCTOR (V4.9.9)</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <button onClick={checkBridge} className="border border-blue-700 hover:bg-blue-800 text-blue-300 py-1 rounded">PING BRIDGE</button>
                        <button onClick={() => setTestLogs([])} className="border border-gray-700 hover:bg-gray-800 text-gray-300 py-1 rounded">CLEAR</button>
                    </div>
                    <div className="h-32 overflow-y-auto bg-black border border-gray-700 p-2 custom-scrollbar">
                        {testLogs.map((l, i) => <div key={i} className="mb-1">{l}</div>)}
                    </div>
                    <button onClick={() => setIsTestMode(false)} className="absolute top-2 right-2 text-red-500">✕</button>
                </div>
            )}

            {status === 'writing' && <p className="text-white animate-pulse">{text.pending}</p>}
            {status === 'done' && <p className="text-white font-bold">{text.success}</p>}
          </div>
          <div className="absolute bottom-2 right-2 z-20"><button onClick={() => setIsTestMode(true)} className="text-[10px] text-gray-800 hover:text-green-500">[BRIDGE DR.]</button></div>
       </div>
    </div>
  );
};

// ... (Standard Modals)
const MigrationNotice: React.FC<{ lang: Language, onClose: () => void }> = ({ lang, onClose }) => {
  const data = MIGRATION_ANNOUNCEMENT[lang];
  return (
    <div className="fixed inset-0 z-[180] bg-black/95 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-900 border-2 border-red-600 text-white p-6 rounded-xl relative">
        <h2 className="text-2xl font-black mb-4">{data.title}</h2>
        <a href="https://28825252.xyz" className="text-3xl text-gold font-black underline block mb-4">{data.new_url}</a>
        <div className="text-sm text-gray-300 whitespace-pre-line mb-6">{data.synopsis}</div>
        <button onClick={onClose} className="w-full bg-red-700 py-3 font-bold uppercase">CLOSE</button>
      </div>
    </div>
  );
};

const OSCShopModal: React.FC<{ lang: Language, onClose: () => void }> = ({ lang, onClose }) => {
  const [filter, setFilter] = useState<'ALL'|'DIVINE'|'REPLICA'>('ALL');
  return (
    <div className="fixed inset-0 z-[160] bg-black/95 flex items-center justify-center p-4">
       <div className="bg-gray-900 w-full max-w-6xl h-full max-h-[90vh] rounded-2xl border border-gray-700 flex flex-col p-6">
           <div className="flex justify-between items-center mb-6">
               <h2 className="text-3xl font-black text-white">OSC SHOP <span className="text-gold text-xs ml-4">Change Your Life by USB.</span></h2>
               <button onClick={onClose} className="text-white font-bold">CLOSE X</button>
           </div>
           <div className="bg-gray-800/50 p-2 flex gap-2 justify-center shrink-0 mb-4">
               {['ALL', 'DIVINE', 'REPLICA'].map(f => (
                   <button key={f} onClick={() => setFilter(f as any)} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${filter === f ? 'bg-red-600 text-white' : 'bg-black text-gray-500'}`}>{f} SERIES</button>
               ))}
           </div>
           <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6">
               {OSC_CATALOG.filter(item => filter === 'ALL' || item.type === filter).map(item => (
                   <div key={item.id} className="bg-black border border-gray-800 p-4 rounded-xl text-white">
                       <h3 className="font-bold">{lang === 'zh' ? item.name.zh : item.name.en}</h3>
                       <p className="text-gold font-black">{item.price}</p>
                       <p className="text-xs text-gray-400 mt-2">{lang === 'zh' ? item.desc.zh : item.desc.en}</p>
                   </div>
               ))}
           </div>
       </div>
    </div>
  );
};

const ConfessionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => <div className="fixed inset-0 z-[190] bg-black/95 flex items-center justify-center text-white"><button onClick={onClose}>CLOSE</button></div>;
const ReviewsModal: React.FC<{ lang: Language, onClose: () => void }> = ({ onClose }) => <div className="fixed inset-0 z-[195] bg-black/95 flex items-center justify-center text-white"><button onClick={onClose}>CLOSE</button></div>;
const GodShopModal: React.FC<{ lang: Language, onClose: () => void, divineRankTitle: string }> = ({ onClose }) => <div className="fixed inset-0 z-[210] bg-white flex items-center justify-center"><button onClick={onClose}>CLOSE GOD SHOP</button></div>;

// --- GOD REST ROOM (FIXED: MOUSE VISIBLE) ---
const GodRestRoomModal: React.FC<{ lang: Language, onClose: () => void }> = ({ lang, onClose }) => {
  return (
    <div className="fixed inset-0 z-[220] bg-gray-900 flex items-center justify-center text-white">
       {/* Removed 'cursor-none' class here */}
       <div className="text-center">
          <h1 className="text-4xl mb-4">GOD REST ROOM</h1>
          <p className="mb-8">The mouse cursor is now visible.</p>
          <button onClick={onClose} className="px-6 py-2 border border-white hover:bg-white hover:text-black">EXIT</button>
       </div>
    </div>
  );
};

const AvatarEmergencyModal: React.FC<{ lang: Language, onClose: () => void }> = ({ onClose }) => <div className="fixed inset-0 z-[230] bg-blue-900 flex items-center justify-center text-white"><button onClick={onClose}>CLOSE ALERT</button></div>;
const DecisionHubModal: React.FC<{ lang: Language, onClose: () => void, isRestricted: boolean, nextAvailableDate: string, onActivate: () => void, onShowUnlock: () => void }> = ({ onClose }) => <div className="fixed inset-0 z-[170] bg-black flex items-center justify-center text-white"><button onClick={onClose}>CLOSE HUB</button></div>;
const UnlockGuideModal: React.FC<{ lang: Language, onClose: () => void, actions: any }> = ({ onClose }) => <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center text-white"><button onClick={onClose}>CLOSE GUIDE</button></div>;
const AIChat: React.FC<{ lang: Language, context: string }> = () => <div>CHAT</div>;

// --- MAIN APP ---
export default function App() {
  const [lang, setLang] = useState<Language>('zh');
  const [appState, setAppState] = useState<'BOOT' | 'REVEAL' | 'MAIN'>('BOOT');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSoulSeized, setIsSoulSeized] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [isGodMode, setIsGodMode] = useState(false);
  const [isSuperGodMode, setIsSuperGodMode] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  
  const [showOSC, setShowOSC] = useState(false);
  const [showConfession, setShowConfession] = useState(false);
  const [showDecisionHub, setShowDecisionHub] = useState(false);
  const [showGodShop, setShowGodShop] = useState(false);
  const [showGodRest, setShowGodRest] = useState(false);
  const [showAvatarAlert, setShowAvatarAlert] = useState(false);
  const [showMigration, setShowMigration] = useState(false);
  const [showUnlockGuide, setShowUnlockGuide] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [spreadType, setSpreadType] = useState<SpreadType | null>(null);

  useEffect(() => {
      const token = localStorage.getItem('FOXOKISO_TOKEN');
      if (token) setIsRegistered(true);
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'god') setIsGodMode(true);
      if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
              () => setUserLocation("TAIWAN [GPS]"),
              () => setUserLocation("TAIWAN [IP]")
          );
      }
  }, []);

  const handleRegistration = () => {
      localStorage.setItem('FOXOKISO_TOKEN', 'valid');
      setIsRegistered(true);
  };

  const handleDraw = (type: SpreadType) => {
      if (isRestricted) return setShowUnlockGuide(true);
      setSpreadType(type);
      setTimeout(() => setCards(drawCards(type, lang)), 100);
  };

  const text = UI_TEXT[lang];

  if (appState === 'BOOT') return <SystemBoot onComplete={() => setAppState('REVEAL')} userLocation={userLocation} />;
  if (appState === 'REVEAL') return <LogoReveal onComplete={() => setAppState('MAIN')} />;
  if (!isRegistered) return <RegistrationGate lang={lang} onRegister={handleRegistration} />;

  return (
    <div className={`min-h-screen font-sans bg-gray-50 text-gray-900 ${isSoulSeized ? 'grayscale' : ''}`}>
      {isGodMode && <GodHorizon />}
      
      {showOSC && <OSCShopModal lang={lang} onClose={() => setShowOSC(false)} />}
      {showConfession && <ConfessionModal onClose={() => setShowConfession(false)} />}
      {showGodShop && <GodShopModal lang={lang} onClose={() => setShowGodShop(false)} divineRankTitle="尊者" />}
      {showGodRest && <GodRestRoomModal lang={lang} onClose={() => setShowGodRest(false)} />}
      {showAvatarAlert && <AvatarEmergencyModal lang={lang} onClose={() => setShowAvatarAlert(false)} />}
      {showDecisionHub && <DecisionHubModal lang={lang} onClose={() => setShowDecisionHub(false)} isRestricted={isRestricted} nextAvailableDate="SOON" onActivate={() => {}} onShowUnlock={() => setShowUnlockGuide(true)} />}
      {showUnlockGuide && <UnlockGuideModal lang={lang} onClose={() => setShowUnlockGuide(false)} actions={{}} />}
      {showMigration && <MigrationNotice lang={lang} onClose={() => setShowMigration(false)} />}
      {showReviews && <ReviewsModal lang={lang} onClose={() => setShowReviews(false)} />}

      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4">
         <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-900 rounded flex items-center justify-center"><FoxokisoTotem className="text-white w-full h-full" /></div>
            <h1 className="font-bold">FOXOKISO <span className="text-red-600">TAROT</span></h1>
         </div>
         <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="border px-2 py-1 rounded text-xs font-bold">LANG</button>
      </header>

      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center">
         {!spreadType && (
             <div className="text-center w-full animate-fade-in">
                 <div className="mb-4 relative inline-block">
                    {/* HERO TOTEM: ENSURE IT IS BIG AND PROMINENT */}
                    <FoxokisoTotem className="w-64 h-64 md:w-80 md:h-80 text-black drop-shadow-2xl mx-auto" kanji="愛" />
                    
                    <div className="mt-4 border-y-2 border-black py-2 bg-white/50 backdrop-blur-sm">
                        <h1 className="text-5xl font-black tracking-widest">FOXOKISO</h1>
                        <p className="text-xs font-bold text-red-600 tracking-[0.5em] uppercase mt-1">完美系統封裝</p>
                        <p onClick={speakSlogan} className="text-xs text-gold font-black uppercase tracking-[0.3em] mt-2 cursor-pointer hover:text-black">Change Your Life by USB. (🔊)</p>
                    </div>
                 </div>
                 
                 <PhantomOneVisual size="w-32 h-32" fontSize="text-6xl" value={isRestricted ? "0" : "1"} />
                 
                 <h2 className="text-4xl font-serif font-black mb-4">{lang === 'zh' ? '命運競技場' : 'THE COLOSSEUM'}</h2>
                 
                 <div className="flex gap-4 justify-center mb-8">
                    <button onClick={() => handleDraw('single')} className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2">
                        <span>🔮</span> {lang === 'zh' ? '單張指引' : 'Single Guide'}
                    </button>
                    <button onClick={() => handleDraw('three')} className="bg-white text-black border-2 border-gray-200 px-8 py-4 rounded-xl font-bold hover:border-black hover:scale-105 transition-transform flex items-center gap-2">
                        <span>🃏</span> {lang === 'zh' ? '三張牌陣' : 'Time Spread'}
                    </button>
                 </div>

                 <div className="flex flex-wrap gap-2 justify-center">
                    <button onClick={() => setShowConfession(true)} className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-bold">神蹟告白</button>
                    <button onClick={() => setShowOSC(true)} className="px-4 py-2 bg-black text-white rounded-full text-xs font-bold">OSC 商城</button>
                    {isGodMode && <button onClick={() => setShowGodRest(true)} className="px-4 py-2 bg-gold text-white rounded-full text-xs font-bold">神之休息室</button>}
                 </div>
                 
                 <div className="mt-8 w-full max-w-lg mx-auto bg-white p-4 rounded-xl border border-gray-200">
                    <AIChat lang={lang} context="home" />
                 </div>
             </div>
         )}

         {spreadType && (
             <div className="w-full animate-fade-in">
                 <button onClick={() => { setSpreadType(null); setCards([]); }} className="mb-4 text-gray-500 hover:text-black font-bold">← BACK</button>
                 <div className={`grid gap-8 ${spreadType === 'single' ? 'grid-cols-1 max-w-sm mx-auto' : 'grid-cols-1 md:grid-cols-3'}`}>
                    {cards.map((c, i) => <CardDisplay key={i} data={c} index={i} lang={lang} />)}
                 </div>
             </div>
         )}
      </main>

      {/* FOOTER: CLEANED UP, NO PK530 LINK */}
      <footer className="fixed bottom-0 w-full bg-white border-t py-2 text-center text-[10px] text-gray-400 font-bold tracking-widest z-40">
         <span>© 2025 FOXOKISO TAROT V4.9.9</span>
         <span className="mx-2">|</span>
         <a href="https://28825252.xyz" className="hover:text-black">28825252.XYZ</a>
      </footer>
    </div>
  );
}
