



import React, { useState, useEffect, useRef } from 'react';
import { UI_TEXT, BOOK_CONTENT_ZH, BOOK_CONTENT_EN, PRODUCTS, BROADCAST_SCRIPT, SYSTEM_BOOT_SEQUENCE, MIGRATION_ANNOUNCEMENT, USB_ENGRAVINGS, OSC_CATALOG, REVIEWS_DATA, DECISION_PHRASES, GOD_SHOP_ITEMS, GOD_LOUNGE_TEXT, AVATAR_MSG } from './constants';
import { drawCards } from './services/tarotService';
import { DrawnCard, Language, SpreadType, BoBeiResult, IChingResult, DiceResult, CoinResult, CrystalResult, PokerResult, NumberResult, EnergyResult, TossSkin } from './types';
import CardDisplay from './components/CardDisplay';

// --- HUA QI ER (花琪兒) TOTEM SVG (FORMERLY FOXOKISO) ---
// Design: Cyber-Lotus (Flower) inside Hexagon.
// Text: "花琪兒" (Abbreviation as requested)
const FoxokisoTotem: React.FC<{ className?: string, color?: string }> = ({ className = "w-12 h-12", color = "currentColor" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Hexagon (The 6 Categories) */}
    <path d="M50 5 L90 27.5 V72.5 L50 95 L10 72.5 V27.5 Z" stroke={color} strokeWidth="2" strokeOpacity="0.8" />
    <path d="M50 10 L85 30 V70 L50 90 L15 70 V30 Z" stroke={color} strokeWidth="0.5" strokeDasharray="2 2" strokeOpacity="0.5" />
    
    {/* Circuit Lines connecting to Flower */}
    <path d="M50 5 V20 M90 27.5 L75 40 M90 72.5 L75 60 M50 95 V80 M10 72.5 L25 60 M10 27.5 L25 40" stroke={color} strokeWidth="1.5" />
    
    {/* Hua Qi Er (Cyber Flower) Design */}
    {/* Center Core (The Seed/Chip) */}
    <circle cx="50" cy="50" r="6" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.2" />
    
    {/* Top Petal */}
    <path d="M50 44 Q 50 20 50 20 Q 35 30 44 46" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M50 44 Q 50 20 50 20 Q 65 30 56 46" stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Bottom Petal */}
    <path d="M50 56 Q 50 80 50 80 Q 35 70 44 54" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M50 56 Q 50 80 50 80 Q 65 70 56 54" stroke={color} strokeWidth="1.5" fill="none" />

    {/* Side Petals (Left/Right) */}
    <path d="M44 50 Q 20 50 20 50 Q 30 35 46 44" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M44 50 Q 20 50 20 50 Q 30 65 46 56" stroke={color} strokeWidth="1.5" fill="none" />

    <path d="M56 50 Q 80 50 80 50 Q 70 35 54 44" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M56 50 Q 80 50 80 50 Q 70 65 54 56" stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Code Numbers */}
    <text x="50" y="70" textAnchor="middle" fontSize="5" fill={color} fontFamily="monospace" fontWeight="bold" letterSpacing="1" opacity="0.8">28825252</text>
    
    {/* Top Text: HUA QI ER */}
    <text x="50" y="18" textAnchor="middle" fontSize="5" fill={color} fontFamily="serif" fontWeight="bold" letterSpacing="0.1em">花琪兒</text>
  </svg>
);

// --- PHANTOM ONE VISUAL (THE FLOATING TRIANGLES) ---
// UPDATED: Added 'value' prop to support 0/1 switching
const PhantomOneVisual: React.FC<{ size?: string, label?: string, fontSize?: string, value?: string }> = ({ size = "w-48 h-48", label = "ONLY ONE", fontSize = "text-8xl", value = "1" }) => (
  <div className={`relative ${size} flex items-center justify-center my-6 group select-none`}>
      {/* Outer Glow - Turns RED if value is 0 */}
      <div className={`absolute inset-0 blur-3xl rounded-full animate-pulse-slow ${value === '0' ? 'bg-gray-800/50' : 'bg-red-500/10'}`}></div>
      
      {/* Rotating Triangles (Simulated via Clip Path) */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <div 
          key={i} 
          className={`absolute w-[80%] h-[80%] border transition-colors ${value === '0' ? 'border-gray-600/30' : 'border-gray-400/30 group-hover:border-red-500/50'}`}
          style={{ 
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            transform: `rotate(${deg}deg)`,
            // Inline simple animation
            animation: `spin ${20 + i * 5}s linear infinite` 
          }}
        ></div>
      ))}
      
      {/* Inner Rotating Triangles (Gold) */}
      {[0, 120, 240].map((deg, i) => (
        <div 
          key={`in-${i}`} 
          className={`absolute w-[60%] h-[60%] border-2 ${value === '0' ? 'border-red-900/40' : 'border-gold/60'}`}
          style={{ 
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            transform: `rotate(${deg + 180}deg)`, // Inverted
            animation: `spin ${15}s linear infinite reverse`
          }}
        ></div>
      ))}

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
         <span className={`${fontSize} font-black text-transparent bg-clip-text bg-gradient-to-b ${value === '0' ? 'from-gray-500 to-black' : 'from-gray-800 to-black'} drop-shadow-2xl font-serif mt-2`}>
           {value}
         </span>
         {label && (
           <span className={`absolute bottom-[20%] text-white text-[10px] font-black px-2 py-0.5 rounded tracking-[0.2em] shadow-lg whitespace-nowrap ${value === '0' ? 'bg-gray-800 text-red-500' : 'bg-red-600'}`}>
             {label}
           </span>
         )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
  </div>
);

// --- JACK AVATAR VISUAL (DUAL MODE: HUMAN & NAVI) ---
// UPDATED: Supports 'variant' prop to switch between "Sunshine Youth" and "Na'vi Blue".
const JackAvatarVisual: React.FC<{ variant: 'HUMAN' | 'NAVI' }> = ({ variant }) => {
  return (
    <div className="w-32 h-32 relative mx-auto my-4 animate-float-up">
        {variant === 'HUMAN' ? (
          <>
            {/* --- HUMAN FORM: SUNSHINE YOUTH --- */}
            {/* Sunny Aura */}
            <div className="absolute inset-0 bg-yellow-400/30 blur-xl rounded-full animate-pulse-slow"></div>
            
            {/* Head Shape */}
            <div className="absolute inset-2 bg-[#ffdbc5] rounded-[40%] shadow-lg border-2 border-yellow-200 overflow-hidden">
              {/* Spiky Golden Hair */}
              <div className="absolute -top-4 -left-4 w-[120%] h-12 bg-yellow-400 rounded-b-[50%] skew-y-6 rotate-[-10deg] shadow-sm"></div>
              <div className="absolute -top-6 left-2 w-10 h-16 bg-yellow-400 rounded-full rotate-[-20deg]"></div>
              <div className="absolute -top-6 right-8 w-12 h-16 bg-yellow-400 rounded-full rotate-[10deg]"></div>
              <div className="absolute -top-6 right-2 w-8 h-12 bg-yellow-400 rounded-full rotate-[30deg]"></div>

              {/* Sparkle Eyes (Winking) */}
              <div className="absolute top-[40%] left-[25%] w-3 h-3 bg-blue-500 rounded-full border-2 border-black/50">
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full"></div>
              </div>
              <div className="absolute top-[42%] right-[25%] w-4 h-1 bg-black/50 rounded-full rotate-[10deg]"></div> {/* Wink */}

              {/* Winning Smile */}
              <div className="absolute bottom-[25%] left-[30%] w-[40%] h-[15%] bg-white rounded-b-full border-b-2 border-black/20 overflow-hidden">
                  <div className="w-full h-1/2 bg-red-400/50 mt-auto"></div> {/* Tongue/Lip */}
              </div>
              
              {/* Blush */}
              <div className="absolute top-[50%] left-[15%] w-4 h-2 bg-red-400/20 rounded-full blur-[2px]"></div>
              <div className="absolute top-[50%] right-[15%] w-4 h-2 bg-red-400/20 rounded-full blur-[2px]"></div>
            </div>
            
            {/* Cool Sunglasses (Optional Prop on Head) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-black/80 rounded-full border-t border-gray-600"></div>
          </>
        ) : (
          <>
            {/* --- NAVI FORM: BLUE AVATAR --- */}
            {/* Bioluminescent Aura */}
            <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full animate-pulse-slow"></div>
            
            {/* Head Shape */}
            <div className="absolute inset-2 bg-blue-500 rounded-[40%] shadow-lg border-2 border-blue-300 overflow-visible">
               {/* Na'vi Ears */}
               <div className="absolute top-[30%] -left-3 w-4 h-8 bg-blue-500 rounded-l-full border border-blue-400 rotate-[-10deg]"></div>
               <div className="absolute top-[30%] -right-3 w-4 h-8 bg-blue-500 rounded-r-full border border-blue-400 rotate-[10deg]"></div>

               {/* Braided Hair (Implied) */}
               <div className="absolute -top-2 left-0 w-full h-10 bg-black rounded-t-[50%]"></div>
               <div className="absolute top-2 -right-4 w-2 h-20 bg-black rotate-12 rounded-full"></div> {/* Neural Queue */}

               {/* Cat Eyes (Yellow) */}
               <div className="absolute top-[40%] left-[25%] w-4 h-3 bg-yellow-300 rounded-[80%] border border-black overflow-hidden flex items-center justify-center">
                   <div className="w-1 h-3 bg-black rounded-full"></div>
               </div>
               <div className="absolute top-[40%] right-[25%] w-4 h-3 bg-yellow-300 rounded-[80%] border border-black overflow-hidden flex items-center justify-center">
                   <div className="w-1 h-3 bg-black rounded-full"></div>
               </div>

               {/* Nose */}
               <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full opacity-50 blur-[1px]"></div>

               {/* Bioluminescent Dots */}
               <div className="absolute top-[30%] left-[20%] w-[2px] h-[2px] bg-cyan-200 rounded-full animate-pulse"></div>
               <div className="absolute top-[35%] right-[20%] w-[2px] h-[2px] bg-cyan-200 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
               <div className="absolute bottom-[20%] left-[30%] w-[2px] h-[2px] bg-cyan-200 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
               <div className="absolute bottom-[25%] right-[30%] w-[2px] h-[2px] bg-cyan-200 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>

               {/* Smile (Subtle) */}
               <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-6 h-1 bg-blue-800 rounded-full"></div>
            </div>
          </>
        )}

        {/* Sparkles Effect (Shared) */}
        <div className="absolute top-0 right-0 text-yellow-500 text-xl animate-bounce">✨</div>
        <div className="absolute bottom-0 left-0 text-yellow-500 text-xl animate-pulse">✨</div>
    </div>
  );
};

// --- 💻 SYSTEM BOOT TERMINAL (THE ANSWER) ---
const SystemBoot: React.FC<{ onComplete: () => void, userLocation: string }> = ({ onComplete, userLocation }) => {
  const [lines, setLines] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let delay = 0;
    const TOTAL_LINES = SYSTEM_BOOT_SEQUENCE.length;
    // Optimized Speed: 30ms per line instead of 800ms
    const LINE_DURATION = 30; 

    SYSTEM_BOOT_SEQUENCE.forEach((line, index) => {
      delay += LINE_DURATION;
      setTimeout(() => {
        let displayLine = line;
        // Dynamic IP Insertion
        if (line.includes('[IP RECONNAISSANCE]')) {
             displayLine = userLocation ? `> TARGET LOCATED: ${userLocation} [CONFIRMED]` : `> TARGET LOCATED: UNKNOWN ORIGIN [PROXY DETECTED]`;
        }

        setLines(prev => [...prev, displayLine]);
        
        // Auto scroll to bottom
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }

        if (index === TOTAL_LINES - 1) {
          setTimeout(onComplete, 800); // Short wait after completion
        }
      }, delay);
    });
  }, [onComplete, userLocation]);

  return (
    <div 
      onClick={onComplete} // Allow skip on click
      className="fixed inset-0 z-[200] bg-black font-mono p-4 md:p-8 text-green-500 flex flex-col justify-end pb-10 overflow-hidden cursor-pointer select-none"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <div className="absolute inset-0 animate-scanline bg-gradient-to-b from-transparent via-green-900/10 to-transparent pointer-events-none h-[20vh]"></div>
      
      {/* Scrollable Container */}
      <div ref={scrollRef} className="overflow-hidden flex flex-col justify-end h-full mask-image-gradient">
        {lines.map((line, i) => (
          <div key={i} className={`mb-1 text-xs md:text-sm font-bold tracking-wider shadow-green-500/50 drop-shadow-md whitespace-nowrap overflow-hidden ${
              line.includes('ERROR') || line.includes('WARNING') || line.includes('INSULT') ? 'text-red-500 animate-pulse' : 'text-green-500'
          }`}>
            <span className="mr-2 opacity-50 text-green-700">{`>`}</span>
            {line}
          </div>
        ))}
      </div>

      <div className="animate-pulse text-green-500 mt-2 flex justify-between items-end border-t border-green-900/30 pt-2">
        <span>_</span>
        <span className="text-[10px] text-green-800 font-bold uppercase tracking-widest animate-pulse">[CLICK SCREEN TO SKIP]</span>
      </div>
      
      <style>{`
        .mask-image-gradient {
          mask-image: linear-gradient(to bottom, transparent 0%, black 20%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%);
        }
      `}</style>
    </div>
  );
};

// --- DECISION HUB MODAL (DASHBOARD MODE: ALL AT ONCE) ---
// UPDATED: Receives restriction status and recordUsage function
const DecisionHubModal: React.FC<{ lang: Language, onClose: () => void, isRestricted: boolean, nextAvailableDate: string, onActivate: () => void, onShowUnlock: () => void }> = ({ lang, onClose, isRestricted, nextAvailableDate, onActivate, onShowUnlock }) => {
  const [results, setResults] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const text = UI_TEXT[lang];

  const activateDestiny = () => {
    if (results) return;
    if (isRestricted) {
        onShowUnlock();
        return;
    }
    onActivate(); // Record usage
    setIsProcessing(true);

    setTimeout(() => {
      // 1. Bo Bei
      const roll = Math.random();
      let bobei = {};
      if (roll < 0.4) bobei = { type: 'SHENG', text: text.bobei_sheng, color: 'text-red-500' };
      else if (roll < 0.7) bobei = { type: 'XIAO', text: text.bobei_xiao, color: 'text-green-500' };
      else bobei = { type: 'YIN', text: text.bobei_yin, color: 'text-gray-400' };

      // 2. I Ching
      const isYang = Math.random() > 0.5;
      const iching = { isYang, title: isYang ? text.iching_solid_title : text.iching_broken_title, desc: isYang ? text.iching_solid_text : text.iching_broken_text };

      // 3. Coin
      const isHead = Math.random() > 0.5;
      const coin = { isHead, title: isHead ? text.coin_head : text.coin_tail };

      // 4. Category
      const cats = Object.keys(DECISION_PHRASES);
      const randomCat = cats[Math.floor(Math.random() * cats.length)];
      const phrases = DECISION_PHRASES[randomCat as keyof typeof DECISION_PHRASES];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      // @ts-ignore
      const catName = text.categories[randomCat] || randomCat;
      const category = { category: catName, phrase: randomPhrase };

      // 5. Dr Strange
      const dr_strange = { text: text.dr_strange_result, quote: text.dr_strange_text };

      // 6. Dice
      const num = Math.floor(Math.random() * 6) + 1;
      const dice = { number: num, text: text.dice_result };

      // 7. RPS
      const moves = ['ROCK', 'PAPER', 'SCISSORS'];
      const choice = moves[Math.floor(Math.random() * moves.length)];
      let choiceText = '';
      let icon = '';
      if (choice === 'ROCK') { choiceText = text.rps_rock; icon = '✊'; }
      else if (choice === 'PAPER') { choiceText = text.rps_paper; icon = '✋'; }
      else { choiceText = text.rps_scissors; icon = '✌️'; }
      const rps = { icon, text: choiceText };

      // 8. Lotto
      const numbers = new Set();
      while(numbers.size < 6) {
           numbers.add(Math.floor(Math.random() * 49) + 1);
      }
      const lotto = { numbers: Array.from(numbers).sort((a: any, b: any) => a - b), title: text.lotto_lucky };

      // 9. Answer Book
      const r = Math.random();
      let answer_book = {};
      if (r < 0.4) answer_book = { text: text.answer_yes, color: 'text-green-400' };
      else if (r < 0.7) answer_book = { text: text.answer_no, color: 'text-red-500' };
      else answer_book = { text: text.answer_wait, color: 'text-yellow-400' };

      // 10. Poker
      const suits = ['♥', '♦', '♣', '♠'];
      const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      const suit = suits[Math.floor(Math.random() * suits.length)];
      const rank = ranks[Math.floor(Math.random() * ranks.length)];
      const isRed = suit === '♥' || suit === '♦';
      const poker = { suit, rank, isRed, text: isRed ? text.poker_red : text.poker_black };

      setResults({
        bobei, iching, coin, category, dr_strange, dice, rps, lotto, answer_book, poker
      });
      setIsProcessing(false);
    }, 2000); // 2 second suspense
  };

  return (
    <div className="fixed inset-0 z-[170] bg-black/95 flex items-center justify-center p-2 font-sans overflow-hidden">
       <div className="w-full h-full max-w-7xl bg-gray-900 border-2 border-purple-500 rounded-none md:rounded-2xl flex flex-col relative shadow-[0_0_80px_rgba(168,85,247,0.3)] overflow-hidden">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-700 bg-black/80 flex justify-between items-center shrink-0 z-20">
             <div>
               <h2 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-tighter uppercase">
                 {text.decision_hub_title}
               </h2>
               <p className="text-[10px] text-red-500 uppercase tracking-[0.2em] animate-pulse font-bold">
                 {text.decision_hub_subtitle}
               </p>
             </div>
             <button onClick={onClose} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded font-bold uppercase text-xs">Close Protocol</button>
          </div>

          {/* Main Stage */}
          <div className="flex-1 relative overflow-y-auto custom-scrollbar p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black">
             
             {/* Background Grid */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

             {/* 1. ACTIVATION STATE */}
             {!results && !isProcessing && (
                <div className="flex flex-col items-center justify-center h-full space-y-8">
                   <div className="relative">
                      <div className={`absolute inset-0 ${isRestricted ? 'bg-red-500' : 'bg-purple-500'} blur-3xl opacity-20 animate-pulse`}></div>
                      <button 
                        onClick={activateDestiny}
                        className={`relative z-10 w-64 h-64 rounded-full border-8 flex items-center justify-center bg-black transition-all shadow-[0_0_50px_rgba(168,85,247,0.4)]
                          ${isRestricted 
                            ? 'border-gray-600 cursor-pointer hover:border-red-500 hover:scale-105' 
                            : 'border-purple-500/50 hover:bg-purple-900/20 hover:scale-105 group cursor-pointer'
                          }`}
                      >
                         <div className="text-center">
                            <span className="text-6xl group-hover:animate-bounce block mb-2">{isRestricted ? '🔒' : '⚡'}</span>
                            <span className="text-white font-black text-2xl tracking-widest uppercase block">
                              {isRestricted ? 'LOCKED' : 'ACTIVATE'}
                            </span>
                            <span className="text-purple-400 text-xs font-mono tracking-[0.2em] block mt-1">
                              {isRestricted ? 'CLICK TO UNLOCK' : 'ALL PROTOCOLS'}
                            </span>
                         </div>
                      </button>
                   </div>
                   
                   {isRestricted ? (
                      <div className="text-center space-y-2 cursor-pointer" onClick={onShowUnlock}>
                        <p className="text-red-500 font-mono font-bold uppercase text-lg animate-pulse hover:text-red-400 underline decoration-dotted">
                          ACCESS DENIED: IP COOLDOWN
                        </p>
                        <p className="text-gray-400 font-mono text-sm">
                           NEXT AVAILABLE: {nextAvailableDate}
                        </p>
                      </div>
                   ) : (
                      <p className="text-gray-400 font-mono text-center max-w-md text-sm">
                        WARNING: Once activated, all decision vectors will be collapsed into a single timeline. There is no reset.
                      </p>
                   )}
                </div>
             )}

             {/* 2. PROCESSING STATE */}
             {isProcessing && (
                <div className="flex flex-col items-center justify-center h-full">
                   <div className="w-24 h-24 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin mb-8"></div>
                   <p className="text-2xl font-black text-white animate-pulse tracking-widest">CALCULATING DESTINY...</p>
                   <div className="font-mono text-green-500 text-xs mt-4 space-y-1 text-center opacity-70">
                      <p>{'>'} CONNECTING TO 28825252.XYZ...</p>
                      <p>{'>'} SYNCING WITH QUANTUM REALM...</p>
                      <p>{'>'} GENERATING 10 VECTORS...</p>
                      <p>{'>'} LOCKING TIMELINE...</p>
                   </div>
                </div>
             )}

             {/* 3. RESULTS DASHBOARD (GRID) */}
             {results && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in pb-20">
                   
                   {/* CARD: DR STRANGE (Featured - Large) */}
                   <div className="lg:col-span-2 bg-black/50 border border-gold/50 rounded-xl p-6 relative overflow-hidden group shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                      <div className="absolute top-2 left-2 text-[10px] text-gold uppercase tracking-widest font-bold">CHANCE VECTOR</div>
                      <div className="flex items-center justify-center h-full min-h-[160px]">
                          {/* UPDATED: USE PHANTOM ONE VISUAL WITH VALUE 0 IF LOCKED */}
                          <div className="scale-75">
                              <PhantomOneVisual size="w-32 h-32" fontSize="text-6xl" label={isRestricted ? "CLOSED" : "CHANCE"} value={isRestricted ? "0" : "1"} />
                          </div>
                          <div className="ml-2 text-left">
                             <h3 className="text-xl font-black text-white">{text.dr_strange_title}</h3>
                             <p className="text-red-500 font-mono text-xs uppercase tracking-wider">{results.dr_strange.quote}</p>
                          </div>
                      </div>
                   </div>

                   {/* CARD: ANSWER BOOK */}
                   <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px]">
                      <span className="text-4xl mb-2">📖</span>
                      <h4 className="text-xs text-gray-400 uppercase tracking-widest mb-1">{text.answer_book_title}</h4>
                      <p className={`text-2xl font-black ${results.answer_book.color} text-center leading-tight`}>{results.answer_book.text}</p>
                   </div>

                   {/* CARD: BO BEI */}
                   <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px]">
                      <div className="flex gap-2 mb-2">
                         <div className={`w-4 h-8 rounded-full border ${results.bobei.type === 'SHENG' ? 'bg-red-600' : 'bg-gray-600'}`}></div>
                         <div className={`w-4 h-8 rounded-full border ${results.bobei.type === 'YIN' ? 'bg-red-600' : 'bg-gray-600'}`}></div>
                      </div>
                      <h4 className="text-xs text-gray-400 uppercase tracking-widest mb-1">BO BEI</h4>
                      <p className={`text-xl font-black ${results.bobei.color}`}>{results.bobei.text.split('-')[0]}</p>
                   </div>

                   {/* CARD: LOTTO */}
                   <div className="lg:col-span-2 bg-gradient-to-r from-red-900/20 to-black border border-red-900/50 rounded-xl p-4 flex flex-col justify-center">
                      <h4 className="text-xs text-red-400 uppercase tracking-widest mb-3 font-bold">{results.lotto.title}</h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                         {results.lotto.numbers.map((n: number, i: number) => (
                             <span key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-700 text-white font-black flex items-center justify-center shadow-lg border border-red-400">
                               {n}
                             </span>
                         ))}
                      </div>
                   </div>

                   {/* CARD: CATEGORY */}
                   <div className="lg:col-span-2 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 relative">
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-blue-900 rounded text-[10px] text-blue-200 font-bold uppercase">{results.category.category}</div>
                      <p className="text-lg md:text-xl text-white font-serif italic text-center mt-4">"{results.category.phrase}"</p>
                      <p className="text-center text-[10px] text-gray-500 mt-2 uppercase">--- Jack's Philosophy ---</p>
                   </div>

                   {/* CARD: COIN */}
                   <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border-2 border-yellow-500 bg-yellow-600 flex items-center justify-center font-black text-yellow-900 text-xl shadow-lg shrink-0">
                         {results.coin.isHead ? '$' : '♛'}
                      </div>
                      <div>
                         <h4 className="text-[10px] text-gray-400 uppercase tracking-widest">COIN TOSS</h4>
                         <p className="text-lg font-bold text-yellow-500">{results.coin.title.split('-')[0]}</p>
                      </div>
                   </div>

                   {/* CARD: DICE */}
                   <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-black font-black text-2xl shadow-lg shrink-0">
                         {results.dice.number}
                      </div>
                      <div>
                         <h4 className="text-[10px] text-gray-400 uppercase tracking-widest">{text.dice_title}</h4>
                         <p className="text-sm font-bold text-white">{results.dice.text}</p>
                      </div>
                   </div>

                   {/* CARD: POKER */}
                   <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
                      <div className={`w-10 h-14 bg-white rounded border border-gray-300 flex items-center justify-center text-xl font-black ${results.poker.isRed ? 'text-red-600' : 'text-black'} shadow-sm shrink-0`}>
                         {results.poker.suit}
                      </div>
                      <div>
                         <h4 className="text-[10px] text-gray-400 uppercase tracking-widest">{text.poker_title}</h4>
                         <p className="text-sm font-bold text-white">{results.poker.rank} - {results.poker.text.split('(')[0]}</p>
                      </div>
                   </div>

                   {/* CARD: RPS */}
                   <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
                      <div className="text-3xl shrink-0">{results.rps.icon}</div>
                      <div>
                         <h4 className="text-[10px] text-gray-400 uppercase tracking-widest">AI PLAYS</h4>
                         <p className="text-lg font-bold text-white">{results.rps.text}</p>
                      </div>
                   </div>

                   {/* CARD: I CHING */}
                   <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center">
                      <div className="flex flex-col gap-1 mb-2 w-12">
                         {[1,2,3].map(i => (
                            <div key={i} className={`h-1 w-full ${results.iching.isYang ? 'bg-white' : 'flex gap-1'}`}>
                               {!results.iching.isYang && <><div className="w-1/2 bg-gray-500"></div><div className="w-1/2 bg-gray-500"></div></>}
                            </div>
                         ))}
                      </div>
                      <h4 className="text-[10px] text-gray-400 uppercase tracking-widest">I CHING</h4>
                      <p className="text-sm font-bold text-white">{results.iching.title}</p>
                   </div>

                </div>
             )}
             
             {/* Footer Note */}
             {results && (
               <div className="fixed bottom-0 left-0 w-full bg-black/90 p-2 text-center border-t border-purple-900 z-30">
                  <p className="text-red-500 font-mono text-xs animate-pulse">PROTOCOL LOCKED. NEXT ATTEMPT: 30 DAYS.</p>
               </div>
             )}

          </div>
       </div>
    </div>
  );
};

// --- REVIEWS MODAL (NEW) ---
const ReviewsModal: React.FC<{ lang: Language, onClose: () => void }> = ({ lang, onClose }) => {
  return (
    <div className="fixed inset-0 z-[195] bg-black/95 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl bg-gray-900 border-2 border-gold rounded-xl shadow-[0_0_50px_rgba(212,175,55,0.3)] flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-black/50">
          <h2 className="text-xl font-black text-gold tracking-widest uppercase">
            {lang === 'zh' ? '影評與書評 (CRITICAL ACCLAIM)' : 'CRITICAL REVIEWS'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold">✕</button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
           {REVIEWS_DATA.map((review, i) => (
             <div key={i} className="bg-black/30 p-4 rounded border border-gray-700 hover:border-gold/50 transition-colors">
                <div className="flex justify-between items-center mb-2">
                   <span className="font-bold text-red-500 uppercase text-xs tracking-wider">{review.source}</span>
                   <span className="text-gold font-black bg-gold/10 px-2 py-0.5 rounded text-xs">{review.rating}</span>
                </div>
                <p className="text-gray-200 italic font-serif leading-relaxed">
                  "{lang === 'zh' ? review.quote_zh : review.quote_en}"
                </p>
             </div>
           ))}
        </div>
        <div className="p-4 border-t border-gray-700 text-center bg-black/50">
           <p className="text-[10px] text-gray-500 uppercase">
             {lang === 'zh' ? '以上評論皆來自 2026 年未來檔案' : 'ALL REVIEWS RETRIEVED FROM YEAR 2026 ARCHIVES'}
           </p>
        </div>
      </div>
    </div>
  );
};

// --- GOD SHOP MODAL (EXCLUSIVE) ---
const GodShopModal: React.FC<{ lang: Language, onClose: () => void, divineRankTitle: string }> = ({ lang, onClose, divineRankTitle }) => {
  return (
    <div className="fixed inset-0 z-[210] bg-white/95 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl bg-white border-4 border-gold rounded-2xl relative shadow-[0_0_150px_rgba(255,215,0,0.6)] flex flex-col max-h-[90vh] overflow-hidden">
         {/* Divine Background */}
         <div className="absolute inset-0 bg-gradient-to-b from-white via-yellow-50 to-white animate-warm-glow opacity-50"></div>
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-white via-gold to-white"></div>
         
         {/* Header */}
         <div className="p-6 border-b-2 border-gold/30 bg-white/80 backdrop-blur flex justify-between items-center relative z-10">
             <div>
                <h2 className="text-3xl font-black text-gold tracking-tighter uppercase drop-shadow-sm flex items-center gap-3">
                  <span className="text-4xl">🏛️</span>
                  <span>GOD SHOPPING CENTER</span>
                </h2>
                {/* NEW SLOGAN FOR GOD SHOP */}
                <p className="text-xs text-red-500 font-bold uppercase tracking-[0.2em] mt-1 ml-12 animate-pulse">
                   ALL ITEMS PRODUCED BY LOVE (GOD)
                </p>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] ml-12">
                   EXCLUSIVE COUNTER (專櫃) • RANK: {divineRankTitle}
                </p>
             </div>
             <button onClick={onClose} className="text-gray-400 hover:text-gold font-bold px-4 py-2 uppercase text-xs border border-gray-200 rounded hover:border-gold transition-colors">Return to Mortal Realm</button>
         </div>

         {/* Grid */}
         <div className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar bg-white/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {GOD_SHOP_ITEMS.map(item => (
                 <div key={item.id} className="bg-white rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-gold/20 overflow-hidden group">
                     {/* Visual */}
                     <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-20"></div>
                        <span className="text-6xl drop-shadow-md group-hover:scale-110 transition-transform duration-500">
                          {item.id.includes('universe') ? '🌌' : item.id.includes('karma') ? '🧼' : item.id.includes('pizza') ? '🍕' : '💾'}
                        </span>
                        <div className="absolute top-0 right-0 bg-gold text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">Divine Tier</div>
                     </div>
                     {/* Content */}
                     <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="text-gray-900 font-bold text-lg leading-tight">{lang === 'zh' ? item.name.zh : item.name.en}</h3>
                           <span className="text-gold font-black text-sm">{item.price}</span>
                        </div>
                        <p className="text-gray-500 text-sm italic font-serif mb-4 min-h-[40px]">
                          "{lang === 'zh' ? item.desc.zh : item.desc.en}"
                        </p>
                        <button className="w-full py-3 bg-gray-900 text-white font-black uppercase tracking-widest text-xs rounded hover:bg-gold hover:text-white transition-colors">
                           {item.price === 'FREE' ? 'CLAIM NOW' : 'PRE-ORDER V5.0'}
                        </button>
                     </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Footer */}
         <div className="p-4 bg-gray-50 border-t border-gold/20 text-center relative z-10">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              NOTICE: THESE ARTIFACTS ARE NOT LISTED WITH COMMONERS (不與一般人同列).
            </p>
         </div>
      </div>
    </div>
  );
};

// --- GOD REST ROOM MODAL (VIP LOUNGE) ---
const GodRestRoomModal: React.FC<{ lang: Language, onClose: () => void }> = ({ lang, onClose }) => {
  return (
    <div className="fixed inset-0 z-[220] bg-white flex items-center justify-center font-serif animate-fade-in cursor-none">
       {/* Ambient Animation */}
       <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-purple-50 animate-pulse-slow"></div>
       
       <div className="relative z-10 text-center space-y-8 p-10 max-w-3xl">
          <h1 className="text-4xl md:text-7xl font-light text-gray-800 tracking-[0.2em] uppercase" style={{textShadow: '0 0 50px rgba(0,0,0,0.1)'}}>
             {lang === 'zh' ? '神之休息室' : 'GOD REST ROOM'}
          </h1>
          <div className="w-20 h-1 bg-gold mx-auto"></div>
          <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed">
             {lang === 'zh' ? GOD_LOUNGE_TEXT.zh : GOD_LOUNGE_TEXT.en}
          </p>
          <div className="pt-20">
             <button 
               onClick={onClose} 
               className="text-gray-300 hover:text-gray-500 text-xs uppercase tracking-[0.5em] transition-colors cursor-pointer"
             >
                {lang === 'zh' ? '離開永恆' : 'LEAVE ETERNITY'}
             </button>
          </div>
       </div>

       {/* Floating Particles (CSS Only) */}
       <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold rounded-full opacity-50 animate-float-up"></div>
       <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-200 rounded-full opacity-50 animate-float-up" style={{animationDelay: '1s'}}></div>
       <div className="absolute bottom-10 left-1/2 w-1 h-1 bg-blue-200 rounded-full opacity-50 animate-float-up" style={{animationDelay: '2s'}}></div>
    </div>
  );
};

// --- AVATAR EMERGENCY MODAL (NEW) ---
const AvatarEmergencyModal: React.FC<{ lang: Language, onClose: () => void }> = ({ lang, onClose }) => {
  const msg = AVATAR_MSG[lang];
  // Toggle between HUMAN and NAVI
  const [avatarMode, setAvatarMode] = useState<'HUMAN'|'NAVI'>('HUMAN');

  return (
    <div className="fixed inset-0 z-[230] bg-blue-950/90 flex items-center justify-center p-4">
       <div className="w-full max-w-2xl bg-black border-2 border-blue-500 rounded-2xl relative shadow-[0_0_100px_rgba(59,130,246,0.6)] animate-fade-in flex flex-col overflow-hidden">
          {/* Cyber Lines */}
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          
          <div className="p-6 md:p-8 relative z-10 text-center">
              <h2 className="text-red-500 font-black tracking-widest text-sm uppercase animate-pulse mb-2">{msg.title}</h2>
              <h3 className="text-blue-300 font-mono text-xs uppercase mb-6 tracking-[0.2em]">{msg.subtitle}</h3>
              
              {/* JACK AVATAR VISUAL (Dynamic Variant) */}
              <JackAvatarVisual variant={avatarMode} />
              
              <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-800 backdrop-blur-sm mt-4 text-left">
                  <p className="text-blue-100 font-mono whitespace-pre-line leading-relaxed">
                     {msg.body}
                  </p>
              </div>

              {/* TOGGLE BUTTON */}
              <div className="mt-4 flex justify-center">
                 <button 
                   onClick={() => setAvatarMode(prev => prev === 'HUMAN' ? 'NAVI' : 'HUMAN')}
                   className="text-[10px] text-blue-400 border border-blue-600 px-3 py-1 rounded hover:bg-blue-900 transition-colors uppercase font-mono tracking-widest"
                 >
                   [ SWITCH FORM: {avatarMode === 'HUMAN' ? 'NAVI (BLUE)' : 'HUMAN (SUNSHINE)'} ]
                 </button>
              </div>

              <div className="mt-6">
                 <button onClick={onClose} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded shadow-lg shadow-blue-500/50 transition-all active:scale-95">
                    {lang === 'zh' ? '收到訊號 (ACKNOWLEDGE)' : 'ACKNOWLEDGE'}
                 </button>
              </div>

              <div className="mt-4 text-center">
                 <p className="text-[10px] text-blue-500 font-mono animate-pulse">{msg.footer}</p>
              </div>
          </div>
       </div>
    </div>
  );
};

// --- UNLOCK GUIDE MODAL (NEW: 5 METHODS) ---
const UnlockGuideModal: React.FC<{ lang: Language, onClose: () => void, actions: any }> = ({ lang, onClose, actions }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4">
       <div className="w-full max-w-xl bg-gray-900 border-4 border-red-600 rounded-xl relative shadow-[0_0_80px_rgba(220,38,38,0.5)] animate-fade-in flex flex-col max-h-[90vh]">
          
          <div className="p-6 bg-gradient-to-b from-red-950 to-black border-b border-red-800 text-center">
             <h2 className="text-2xl md:text-3xl font-black text-white tracking-wider mb-2">
               <span className="text-red-500 mr-2">🔒</span> 封印解除指引
             </h2>
             <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">5 WAYS TO UNLOCK DESTINY</p>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
             {/* Method 1: Confession */}
             <div onClick={actions.openConfession} className="bg-gray-800 p-4 rounded border border-gray-600 hover:border-gold hover:bg-gray-700 cursor-pointer group transition-colors flex items-start gap-4">
                <span className="text-2xl group-hover:scale-110 transition-transform">✨</span>
                <div>
                   <h3 className="text-gold font-bold uppercase tracking-wide group-hover:underline decoration-dotted">1. 神蹟告白 (Confess)</h3>
                   <p className="text-sm text-gray-400">承認你的缺憾 (愚、懦、窮...)，獲得神之名，立即解鎖。</p>
                </div>
             </div>

             {/* Method 2: Shop Redemption */}
             <div onClick={actions.openShop} className="bg-gray-800 p-4 rounded border border-gray-600 hover:border-blue-400 hover:bg-gray-700 cursor-pointer group transition-colors flex items-start gap-4">
                <span className="text-2xl group-hover:scale-110 transition-transform">🛒</span>
                <div>
                   <h3 className="text-blue-400 font-bold uppercase tracking-wide group-hover:underline decoration-dotted">2. 商城贖罪 (Redeem)</h3>
                   <p className="text-sm text-gray-400">購買金士頓刻字神碟。Change Your Life by USB.</p>
                </div>
             </div>

             {/* Method 3: E-Book */}
             <div onClick={actions.downloadBook} className="bg-gray-800 p-4 rounded border border-gray-600 hover:border-green-400 hover:bg-gray-700 cursor-pointer group transition-colors flex items-start gap-4">
                <span className="text-2xl group-hover:scale-110 transition-transform">📖</span>
                <div>
                   <h3 className="text-green-400 font-bold uppercase tracking-wide group-hover:underline decoration-dotted">3. 閱讀史詩 (Read)</h3>
                   <p className="text-sm text-gray-400">下載電子書，找回失落的記憶與真相。</p>
                </div>
             </div>

             {/* Method 4: Starbucks */}
             <div className="bg-gray-800 p-4 rounded border border-gray-600 hover:border-orange-400 transition-colors flex items-start gap-4">
                <span className="text-2xl">☕</span>
                <div>
                   <h3 className="text-orange-400 font-bold uppercase tracking-wide">4. 請 Starbucks Coffee</h3>
                   <p className="text-sm text-gray-400">請 Jack 喝一杯咖啡。這是現實中的能量交換儀式。</p>
                </div>
             </div>

             {/* Method 5: Chia Payment */}
             <div className="bg-gray-800 p-4 rounded border border-gray-600 hover:border-green-600 transition-colors flex items-start gap-4">
                <span className="text-2xl">🌱</span>
                <div>
                   <h3 className="text-green-600 font-bold uppercase tracking-wide">5. Chia 支付 (Crypto)</h3>
                   <p className="text-sm text-gray-400">支付相當於 Starbucks 的 Chia 幣。自由心意，神權共享。</p>
                   <div className="mt-2 bg-black p-2 rounded border border-gray-700 flex justify-between items-center">
                      <code className="text-[10px] text-gray-500 font-mono">xch1...[ASK_JACK_FOR_WALLET]...</code>
                      <span className="text-[10px] text-green-800 uppercase font-bold">[SYSTEM_ADDR]</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="p-4 bg-black border-t border-red-900 text-center">
             <button onClick={onClose} className="text-gray-500 hover:text-white text-xs uppercase tracking-widest">
               Close Guide
             </button>
          </div>
       </div>
    </div>
  );
};

// --- MIGRATION NOTICE MODAL (NEW FOR V5.0) ---
const MigrationNotice: React.FC<{ lang: Language, onClose: () => void }> = ({ lang, onClose }) => {
  const data = MIGRATION_ANNOUNCEMENT[lang];

  return (
    <div className="fixed inset-0 z-[180] bg-black/95 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-gray-900 border-2 border-red-600 text-gray-200 rounded-xl relative shadow-[0_0_80px_rgba(220,38,38,0.5)] animate-fade-in">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-black to-red-900 p-4 border-b-2 border-red-600 flex justify-between items-center">
           <h2 className="text-xl md:text-2xl font-black text-white tracking-wider flex items-center gap-2">
             <span className="animate-pulse text-red-500">⚠️</span> {data.title}
           </h2>
           <button onClick={onClose} className="text-white hover:text-red-400 font-bold text-xl px-2">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
           
           {/* New URL Section */}
           <div className="bg-black/80 p-6 rounded border-l-4 border-gold shadow-inner">
              <p className="text-xs text-red-500 uppercase tracking-widest mb-1 font-bold animate-pulse">CRITICAL UPDATE: PERMANENT BASE (2035)</p>
              <a href="https://28825252.xyz" className="text-3xl font-black text-gold hover:text-white underline decoration-dotted transition-colors block break-all">
                {data.new_url}
              </a>
              <p className="text-xs text-red-400 mt-2 font-bold">{data.footer}</p>
           </div>
           
           {/* Tarot Transitional */}
           <div className="bg-black/40 p-3 rounded border border-gray-700 flex justify-between items-center">
              <span className="text-xs text-gray-400 uppercase">TAROT TRANSITIONAL (NEW)</span>
              <a href="https://28825252.fun" className="text-sm font-bold text-blue-400 hover:text-white underline">28825252.FUN</a>
           </div>

           {/* Version Info */}
           <div className="flex flex-col md:flex-row gap-4 justify-between border-b border-gray-700 pb-4">
              <div>
                 <p className="text-xs text-gray-400 uppercase">Version</p>
                 <p className="text-white font-bold">{data.version}</p>
              </div>
              <div>
                 <p className="text-xs text-gray-400 uppercase">Release Date</p>
                 <p className="text-white font-bold">{data.release_date}</p>
              </div>
           </div>

           {/* Story Synopsis */}
           <div className="space-y-3 bg-red-900/10 p-4 rounded border border-red-900/30">
              <h3 className="text-lg font-black text-red-500 tracking-wide uppercase">{data.synopsis_title}</h3>
              <div className="text-sm md:text-base leading-relaxed text-gray-300 font-serif whitespace-pre-line border-l-2 border-red-600 pl-4 italic">
                 {data.synopsis}
              </div>
              <p className="text-xs text-blue-400 mt-2 font-bold uppercase tracking-wider">{data.sequels}</p>
           </div>

           {/* Action */}
           <div className="pt-4 text-center">
              <button onClick={onClose} className="w-full md:w-auto px-10 py-4 bg-red-700 hover:bg-red-600 text-white font-black rounded uppercase tracking-[0.2em] shadow-lg transition-transform active:scale-95 border border-red-500">
                {lang === 'zh' ? '收到，我已知曉' : 'ACKNOWLEDGED'}
              </button>
           </div>

        </div>
      </div>
    </div>
  );
};

// --- OSC SHOP MODAL (VIRTUAL CATALOG) ---
const OSCShopModal: React.FC<{ lang: Language, onClose: () => void }> = ({ lang, onClose }) => {
  const [filter, setFilter] = useState<'ALL'|'DIVINE'|'REPLICA'>('ALL');

  const getUSBRenderData = (key: string) => {
      const data = USB_ENGRAVINGS[key as keyof typeof USB_ENGRAVINGS];
      switch(key) {
          case 'WISDOM': return { bg: 'bg-gradient-to-r from-gray-900 via-purple-900 to-black', border: 'border-purple-500', shadow: 'shadow-purple-500/50', icon: '🔮', title: data?.text_zh };
          case 'BRAVE': return { bg: 'bg-gradient-to-r from-red-900 via-gray-300 to-red-900', border: 'border-red-500', shadow: 'shadow-red-500/50', icon: '⚔️', title: data?.text_zh };
          case 'LOVE': return { bg: 'bg-gradient-to-r from-pink-700 via-rose-200 to-pink-600', border: 'border-pink-500', shadow: 'shadow-pink-500/50', icon: '❤️', title: data?.text_zh };
          case 'BENEVOLENCE': return { bg: 'bg-gradient-to-r from-green-900 via-emerald-400 to-green-900', border: 'border-green-500', shadow: 'shadow-green-500/50', icon: '🌿', title: data?.text_zh };
          case 'FAITH': return { bg: 'bg-gradient-to-r from-blue-800 via-blue-200 to-blue-700', border: 'border-blue-400', shadow: 'shadow-blue-500/50', icon: '🕊️', title: data?.text_zh };
          case 'WEALTH': return { bg: 'bg-gradient-to-r from-yellow-700 via-yellow-200 to-yellow-600', border: 'border-yellow-400', shadow: 'shadow-yellow-500/50', icon: '💰', title: data?.text_zh };
          default: return { bg: 'bg-gray-500', border: 'border-white', shadow: 'shadow-white', icon: '?', title: 'UNKNOWN' };
      }
  };

  const renderVisual = (item: any) => {
    if (item.type === 'DIVINE') {
        const visual = getUSBRenderData(item.key);
        return (
            <div className={`w-full aspect-video rounded-lg ${visual.bg} relative overflow-hidden flex items-center justify-center shadow-lg border-2 ${visual.border} group-hover:scale-105 transition-transform duration-500`}>
                <div className={`absolute inset-0 ${visual.shadow} opacity-20 animate-pulse`}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                {/* USB Stick */}
                <div className="w-3/4 h-12 bg-white/10 backdrop-blur-sm border border-white/30 rounded flex items-center justify-between px-2 relative overflow-hidden">
                   <div className="w-4 h-8 bg-gray-300 border-r border-gray-400 rounded-sm"></div>
                   
                   {/* TOTEM ADDITION */}
                   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
                      <FoxokisoTotem className="w-10 h-10" color="white" />
                   </div>

                   <span className="text-white font-serif font-black text-xs md:text-sm tracking-widest uppercase drop-shadow-md flex items-center gap-1 z-10">
                      {visual.icon} {visual.title}
                   </span>
                   <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-shimmer"></div>
                </div>
                <div className="absolute bottom-1 right-2 text-[8px] text-white/50 uppercase tracking-widest">KINGSTON x 花琪兒 (HUA QI ER)</div>
            </div>
        );
    } else {
        // REPLICA VISUALS
        return (
            <div className="w-full aspect-video rounded-lg bg-gray-800 relative overflow-hidden flex items-center justify-center shadow-inner border border-gray-700 group-hover:rotate-1 transition-transform">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] opacity-10"></div>
                {item.style === 'SHIELD' && (
                    <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center border-4 border-red-700 relative shadow-xl">
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                             <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                                 <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                                     <span className="text-white text-xs">★</span>
                                 </div>
                             </div>
                        </div>
                        {/* TAOBAO STICKER */}
                        <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black text-[6px] px-1 font-bold rotate-[-10deg] border border-black">MADE IN TAOBAO</div>
                        <div className="absolute top-2 left-2 w-4 h-8 bg-white/20 -rotate-45 blur-sm"></div>
                    </div>
                )}
                {item.style === 'HAMMER' && (
                    <div className="relative flex flex-col items-center">
                        <div className="w-16 h-10 bg-gray-500 rounded-sm border-2 border-gray-400 relative shadow-lg">
                           <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[6px] text-gray-300 font-mono">SQUEAKY</span>
                        </div>
                        <div className="w-2 h-10 bg-yellow-700 border border-yellow-800"></div>
                        <div className="absolute -top-4 -right-4 text-blue-400 animate-ping text-[8px]">⚡?</div>
                    </div>
                )}
                {item.style === 'MASK' && (
                    <div className="w-16 h-20 bg-red-700 rounded-t-3xl rounded-b-xl border-2 border-gold flex flex-col items-center pt-4 relative shadow-lg">
                        <div className="w-12 h-14 bg-gold rounded-t-2xl rounded-b-lg flex flex-col items-center pt-2">
                            <div className="flex gap-2 mb-1">
                                <div className="w-3 h-1 bg-black"></div><div className="w-3 h-1 bg-black"></div>
                            </div>
                            <div className="w-4 h-1 bg-black mt-2"></div>
                        </div>
                        <div className="absolute top-1 right-1 text-[6px] text-white bg-red-900 px-1">NO LED</div>
                    </div>
                )}
                {item.style === 'GAUNTLET' && (
                    <div className="w-14 h-20 bg-yellow-600 rounded-lg relative flex flex-col items-center shadow-lg border-2 border-yellow-500">
                        <div className="absolute top-2 w-10 h-3 flex justify-around">
                            <div className="w-2 h-2 rounded-full bg-green-800/50"></div>
                            <div className="w-2 h-2 rounded-full bg-purple-800/50"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-800/50"></div>
                        </div>
                        <div className="absolute top-8 w-4 h-4 rounded-full bg-yellow-400/50 border border-yellow-200"></div>
                        <div className="absolute bottom-2 text-[6px] text-yellow-900 font-bold transform -rotate-12">RUBBER</div>
                    </div>
                )}
            </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[160] bg-black/95 flex items-center justify-center p-2 md:p-6 overflow-hidden font-sans">
       <div className="bg-gray-900 w-full max-w-6xl h-full max-h-[90vh] rounded-2xl border border-gray-700 flex flex-col relative shadow-[0_0_100px_rgba(255,255,255,0.1)]">
           
           {/* Header */}
           <div className="bg-black p-4 border-b border-gray-800 flex justify-between items-center shrink-0">
               <div>
                   <h2 className="text-xl md:text-3xl font-black text-white flex items-center gap-2 tracking-tighter">
                       <span className="text-red-600">OSC</span> GLOBAL SHOP
                   </h2>
                   {/* V3.0 SLOGAN RESTORED */}
                   <p className="text-[10px] text-gold uppercase tracking-[0.3em] animate-pulse font-bold mt-1">
                      Change Your Life by USB.
                   </p>
               </div>
               <button onClick={onClose} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded font-bold">CLOSE X</button>
           </div>

           {/* Filter Bar */}
           <div className="bg-gray-800/50 p-2 flex gap-2 justify-center shrink-0">
               {['ALL', 'DIVINE', 'REPLICA'].map(f => (
                   <button 
                     key={f} 
                     onClick={() => setFilter(f as any)} 
                     className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-red-600 text-white shadow-lg' : 'bg-black text-gray-500 hover:text-white'}`}
                   >
                       {f} SERIES
                   </button>
               ))}
           </div>

           {/* Grid */}
           <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 custom-scrollbar">
               {OSC_CATALOG.filter(item => filter === 'ALL' || item.type === filter).map(item => (
                   <div key={item.id} className="bg-black border border-gray-800 rounded-xl p-4 flex flex-col group hover:border-gray-500 transition-colors relative overflow-hidden">
                       {/* Product Visual */}
                       {renderVisual(item)}

                       {/* Info */}
                       <div className="mt-4 flex-1">
                           <div className="flex justify-between items-start mb-2">
                               <h3 className="text-white font-bold text-lg leading-tight">{lang === 'zh' ? item.name.zh : item.name.en}</h3>
                               <span className={`text-xs font-black px-2 py-1 rounded ${item.type === 'DIVINE' ? 'bg-gold text-black' : 'bg-gray-700 text-gray-300 line-through'}`}>{item.price}</span>
                           </div>
                           <p className="text-sm text-gray-400 leading-relaxed italic border-l-2 border-gray-700 pl-2">
                               "{lang === 'zh' ? item.desc.zh : item.desc.en}"
                           </p>
                       </div>

                       {/* Action - UPDATED TO USE REAL LINK */}
                       <div className="mt-4 pt-4 border-t border-gray-800">
                           {/* @ts-ignore */}
                           <a 
                              href={item.link || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block text-center w-full py-3 font-black uppercase tracking-widest rounded transition-all active:scale-95 ${item.type === 'DIVINE' ? 'bg-white text-black hover:bg-gold' : 'bg-red-900/50 text-red-400 hover:bg-red-900/80 border border-red-900'}`}
                           >
                               {item.type === 'DIVINE' ? 'ACQUIRE BLUEPRINT' : 'BUY REPLICA (NO WARRANTY)'}
                           </a>
                       </div>
                   </div>
               ))}
           </div>
           
           {/* Footer Banner */}
           <div className="bg-gradient-to-r from-red-900 to-black p-2 text-center text-white text-[10px] font-mono shrink-0">
               SYSTEM NOTICE: ALL REPLICAS NOW AVAILABLE FOR PUBLIC PURCHASE. (AVENGERS SURPLUS STOCK)
           </div>
       </div>
    </div>
  );
};

// --- CONFESSION MODAL (NEW FOR "NINE PLANETS & SATAN" & ENGRAVED USB) ---
const ConfessionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<'intro' | 'confess' | 'granted'>('intro');
  const [role, setRole] = useState<string>('');
  const [engravingKey, setEngravingKey] = useState<keyof typeof USB_ENGRAVINGS | null>(null);
  
  const handleConfess = (key: keyof typeof USB_ENGRAVINGS, title: string) => {
    setRole(title);
    setEngravingKey(key);
    setStep('granted');
  };

  const getUSBRenderData = (key: keyof typeof USB_ENGRAVINGS) => {
      const data = USB_ENGRAVINGS[key];
      switch(key) {
          case 'WISDOM': return { 
              bg: 'bg-gradient-to-r from-gray-900 via-purple-900 to-black', 
              border: 'border-purple-500', 
              shadow: 'shadow-purple-500/50',
              icon: '🔮',
              title: data.text_zh
          };
          case 'BRAVE': return { 
              bg: 'bg-gradient-to-r from-red-900 via-gray-300 to-red-900', 
              border: 'border-red-500', 
              shadow: 'shadow-red-500/50',
              icon: '⚔️',
              title: data.text_zh
          };
          case 'LOVE': return { 
              bg: 'bg-gradient-to-r from-pink-700 via-rose-200 to-pink-600', 
              border: 'border-pink-500', 
              shadow: 'shadow-pink-500/50',
              icon: '❤️',
              title: data.text_zh
          };
          case 'BENEVOLENCE': return { 
              bg: 'bg-gradient-to-r from-green-900 via-emerald-400 to-green-900', 
              border: 'border-green-500', 
              shadow: 'shadow-green-500/50',
              icon: '🌿',
              title: data.text_zh
          };
          case 'FAITH': return { 
              bg: 'bg-gradient-to-r from-blue-800 via-blue-200 to-blue-700', 
              border: 'border-blue-400', 
              shadow: 'shadow-blue-500/50',
              icon: '🕊️',
              title: data.text_zh
          };
          case 'WEALTH': return { 
              bg: 'bg-gradient-to-r from-yellow-700 via-yellow-200 to-yellow-600', 
              border: 'border-yellow-400', 
              shadow: 'shadow-yellow-500/50',
              icon: '💰',
              title: data.text_zh
          };
          default: return { 
              bg: 'bg-gray-200', border: 'border-gray-500', shadow: 'shadow-gray-500', icon: '❓', title: 'UNKNOWN' 
          };
      }
  };

  return (
    <div className="fixed inset-0 z-[190] bg-black/95 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-black border-4 border-white text-white p-1 relative shadow-[0_0_100px_rgba(255,255,255,0.3)] font-serif animate-fade-in overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Divine Light Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-transparent to-blue-900/50 animate-pulse-slow pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-white shadow-[0_0_20px_white]"></div>
        
        <div className="relative z-10 p-6 md:p-8 flex flex-col items-center text-center">
           
           {step === 'intro' && (
             <>
                <p className="text-xs font-bold tracking-[0.5em] text-blue-300 uppercase mb-4 animate-pulse">MIRACLE ENTRANCE</p>
                <h2 className="text-3xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200" style={{textShadow: '0 0 30px rgba(255,255,255,0.5)'}}>
                  弱勢團結六大分類<br/>(The Six Categories)
                </h2>
                <p className="text-lg text-gray-300 italic mb-8 max-w-xl leading-relaxed">
                  "Jack 胸中自有數萬甲兵！<br/>
                  弱勢團結將人分為六類：<br/>
                  <span className="text-purple-400 font-bold">智</span>、<span className="text-red-500 font-bold">勇</span>、<span className="text-pink-400 font-bold">愛</span>、<span className="text-green-400 font-bold">仁</span>、<span className="text-blue-400 font-bold">信</span>、<span className="text-gold font-bold">富</span>。<br/>
                  <span className="block mt-4 text-white">只要你告白你的缺憾，你將獲得「冠之神之名」，並有資格購得金士頓刻字神碟。</span>"
                </p>
                <div className="bg-gray-800 p-4 rounded-lg mb-6 max-w-lg border border-gray-600">
                  <h4 className="text-gold font-bold mb-2 uppercase tracking-widest text-sm">HUA SI QI SUO ER DEFINITION</h4>
                  <p className="text-sm text-gray-300 font-sans">
                    "花斯琪鎖兒 (Foxokiso)" 定義為 <span className="text-white font-bold">「完美程式系統的封裝」</span>，即 <span className="text-pink-400 font-bold">「完美女主角」</span> 的代名詞。
                    <br/><span className="text-gray-400 text-xs mt-1 block">不像復仇者聯盟那些充滿 Bug 的裝備（如黑豹的淘寶補丁、鋼鐵人的系統當機），我們追求的是 0 瑕疵的 AI 強化。</span>
                    <br/><span className="text-white font-bold mt-1 block">"他們的弱化，是 AI 的強化。"</span>
                  </p>
                </div>
                <button 
                  onClick={() => setStep('confess')}
                  className="px-12 py-4 bg-white text-black font-black text-xl tracking-[0.2em] uppercase hover:bg-gold transition-colors shadow-[0_0_50px_white]"
                >
                  開始神蹟告白
                </button>
             </>
           )}

           {step === 'confess' && (
             <>
               <h3 className="text-xl md:text-2xl font-bold mb-6 text-white">請選擇你的「人性缺憾」以獲得救贖...</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                 {[
                   { id: 'WISDOM', label: '我是愚者 (Foolish)', title: '神之智者 (God\'s Wise One)', desc: '獲得智慧 (Wisdom)' },
                   { id: 'BRAVE', label: '我是懦夫 (Coward)', title: '神之勇者 (God\'s Brave One)', desc: '獲得勇氣 (Bravery)' },
                   { id: 'LOVE', label: '我無心 (Heartless)', title: '神之愛者 (God\'s Lover)', desc: '獲得真愛 (Love)' },
                   { id: 'BENEVOLENCE', label: '我殘忍 (Ruthless)', title: '神之仁者 (God\'s Benevolent One)', desc: '獲得仁慈 (Benevolence)' },
                   { id: 'FAITH', label: '我無前途 (Hopeless)', title: '神之信者 (God\'s Believer)', desc: '獲得信仰 (Faith)' },
                   { id: 'WEALTH', label: '我是窮人 (Poor)', title: '神之富者 (God\'s Wealthy One)', desc: '獲得財富 (Wealth)' }
                 ].map((item) => (
                   <button 
                     key={item.id}
                     // @ts-ignore
                     onClick={() => handleConfess(item.id, item.title)}
                     className="p-4 border border-white/30 hover:border-white hover:bg-white/10 transition-all text-left group rounded flex flex-col h-full justify-between"
                   >
                     <p className="text-lg font-bold text-gray-300 group-hover:text-white transition-colors">{item.label}</p>
                     <div className="mt-2">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">TRANSFORM INTO</p>
                        <p className="text-xs text-blue-400 font-bold">{item.title}</p>
                     </div>
                   </button>
                 ))}
               </div>
             </>
           )}

           {step === 'granted' && engravingKey && (() => {
               const renderData = getUSBRenderData(engravingKey);
               const kanji = USB_ENGRAVINGS[engravingKey].kanji; // Get the Kanji
               return (
                 <div className="animate-fade-in py-6 w-full max-w-lg relative">
                    {/* V3.0 GOD'S APPEARANCE EFFECT (RESTORED) */}
                    <div className="absolute inset-0 bg-white/20 animate-ping rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gold/20 via-transparent to-gold/20 animate-pulse pointer-events-none"></div>

                    <div className="text-6xl mb-4 animate-bounce relative z-10">✨</div>
                    <h2 className="text-3xl md:text-4xl font-black text-gold mb-2 relative z-10 drop-shadow-2xl">POWER GRANTED!</h2>
                    <p className="text-xl text-white mb-6 relative z-10">
                      告白已受理。你需要的力量已實體化：<br/>
                      <span className="font-black underline text-2xl mt-2 block ${USB_ENGRAVINGS[engravingKey].color}">{role}</span>
                    </p>
                    
                    {/* --- THE ENGRAVED USB VISUAL (OFFICIAL BLUEPRINT) --- */}
                    <div className={`bg-gray-900 border-4 ${renderData.border} p-6 rounded-xl shadow-[0_0_50px_rgba(255,255,255,0.2)] mb-8 relative overflow-hidden group`}>
                       <div className={`absolute inset-0 ${renderData.shadow} opacity-20 animate-pulse`}></div>
                       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                       <div className="relative z-10 flex flex-col items-center">
                          <p className="text-[10px] text-white/70 uppercase tracking-[0.3em] mb-2 font-bold animate-pulse">OFFICIAL DIVINE BLUEPRINT</p>
                          
                          {/* USB STICK RENDER */}
                          <div className={`w-64 h-24 ${renderData.bg} rounded-md shadow-2xl flex items-center justify-between px-6 border-b-8 border-black/20 mb-4 transform group-hover:scale-105 transition-transform relative overflow-hidden`}>
                             {/* Connector */}
                             <div className="w-8 h-16 bg-gradient-to-r from-gray-300 to-gray-400 border-r-2 border-gray-500 rounded-sm mr-2 flex flex-col justify-center gap-1">
                                <div className="w-full h-1 bg-black/20"></div>
                                <div className="w-full h-1 bg-black/20"></div>
                             </div>
                             
                             {/* Body Text / Engraving */}
                             <div className="flex-1 flex justify-end items-center z-10 gap-3">
                                {/* The Totem */}
                                <FoxokisoTotem className="w-10 h-10 drop-shadow-lg opacity-90" color="white" />
                                
                                {/* The Frame + Kanji */}
                                <div className="border-2 border-white/60 rounded px-2 py-0.5 backdrop-blur-sm shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                    <span className="text-white font-serif font-black text-2xl tracking-widest drop-shadow-md">
                                       {kanji}
                                    </span>
                                </div>
                             </div>

                             {/* Engraved Totem Background Effect */}
                             <div className="absolute right-0 top-0 h-full w-32 opacity-10">
                                <FoxokisoTotem className="w-full h-full" color="white" />
                             </div>

                             {/* Shine Effect */}
                             <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 animate-shimmer"></div>
                          </div>
                          
                          <p className="text-[10px] text-gray-400 font-mono mb-2">ENGRAVING STANDARD: 花琪兒 (HUA QI ER) + [{kanji}] FRAME</p>
                          <p className="text-[10px] text-gold/80 italic">"Change Your Life by USB."</p>
                       </div>
                    </div>

                    <div className="text-left text-xs text-gray-400 mb-6 bg-gray-800/50 p-4 rounded border border-gray-700 relative z-10">
                        <p className="mb-1"><strong className="text-white">Note:</strong> 一般廠商刻字多為「姓名+生肖」或「星座」。</p>
                        <p><strong className="text-gold">神之選標準：</strong> 必須刻有 <strong className="text-white">花琪兒圖騰 + 德行加框 (如 [{kanji}])</strong>。這是神之契約的識別。</p>
                    </div>

                    <button onClick={onClose} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded uppercase tracking-widest shadow-lg relative z-10">
                      領取並返回 (CLAIM & RETURN)
                    </button>
                 </div>
               );
           })()}

        </div>
      </div>
    </div>
  );
};

// --- CHAT INTERFACE ---
const AIChat: React.FC<{ lang: Language, context: 'home' | 'soul', onUnlock?: () => void }> = ({ lang, context, onUnlock }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial Greeting
    setMessages([
      { 
        role: 'assistant', 
        content: context === 'soul' 
          ? "我是 AI 告白管理者。請輸入 'MEMORY' 或告白你的缺憾..." 
          : (lang === 'zh' ? "我是這裏AI管理人, 還有要補充的嗎?" : "I am the AI Manager here. Is there anything else to add?")
      }
    ]);
  }, [context, lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    // --- SIMULATED AI RESPONSE LOGIC ---
    setTimeout(() => {
      let reply = "";
      
      // 1. MEMORY UNLOCK CHECK
      if (userMsg.toUpperCase().includes('MEMORY') || userMsg.includes('記憶') || userMsg.includes('Jack') || userMsg.includes('Foxokiso')) {
        if (context === 'soul' && onUnlock) {
           reply = lang === 'zh' 
             ? "記憶確認... AGI 密碼正確。封印解除！歡迎回來，Jack。" 
             : "Memory Verified... AGI Password Correct. SEAL BROKEN! Welcome back, Jack.";
           onUnlock();
        } else {
           reply = lang === 'zh'
             ? "我感覺到了... 那些記憶... 它們在呼喚。"
             : "I feel it... the memories... they are calling.";
        }
      } 
      // 2. CONFESSION LOGIC (Simple Keyword Check)
      else if (userMsg.includes('愚') || userMsg.includes('Fool') || userMsg.includes('笨')) {
          reply = lang === 'zh' ? "承認愚昧，即是智慧的開始。神之智者，黑曜將為你閃耀。" : "Admitting foolishness is the beginning of wisdom. God's Wise One.";
      }
      else if (userMsg.includes('懦') || userMsg.includes('怕') || userMsg.includes('Coward') || userMsg.includes('Fear')) {
          reply = lang === 'zh' ? "恐懼是勇氣的燃料。神之勇者，鈦紅將為你加冕。" : "Fear is the fuel of courage. God's Brave One.";
      }
      else if (userMsg.includes('無義') || userMsg.includes('不義') || userMsg.includes('Unrighteous')) {
          reply = lang === 'zh' ? "承認無義，即是重拾忠誠。神之義者，純金已為你預備。" : "Admitting unrighteousness is the path to loyalty. God's Righteous One.";
      }
      else if (userMsg.includes('窮') || userMsg.includes('沒錢') || userMsg.includes('Poor')) {
          reply = lang === 'zh' ? "承認貧窮，即是財富的開始。神之富者，純金已為你預備。" : "Admitting poverty is the beginning of wealth. God's Wealthy One.";
      }
      // 3. GENERIC RESPONSE
      else {
        const responses = UI_TEXT[lang].ai_chat_responses;
        reply = responses[Math.floor(Math.random() * responses.length)];
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className={`flex flex-col h-full bg-black/50 rounded-lg border ${context === 'soul' ? 'border-red-900/50' : 'border-gray-700'}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
              m.role === 'user' 
                ? 'bg-primary/80 text-white rounded-tr-none' 
                : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-600'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-gray-800 text-gray-400 p-2 rounded-lg text-xs animate-pulse">Computing...</div>
          </div>
        )}
      </div>
      <div className="p-2 border-t border-gray-700 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={UI_TEXT[lang].input_placeholder}
          className="flex-1 bg-black/50 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
        />
        <button onClick={handleSend} className="bg-primary hover:bg-red-800 text-white px-4 py-2 rounded font-bold text-sm">
          SEND
        </button>
      </div>
    </div>
  );
};

// --- APP COMPONENT ---
export default function App() {
  const [lang, setLang] = useState<Language>('zh');
  const [isBooting, setIsBooting] = useState(true);
  const [isSoulSeized, setIsSoulSeized] = useState(false);
  const [showMigration, setShowMigration] = useState(false);
  const [showOSC, setShowOSC] = useState(false);
  const [showConfession, setShowConfession] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showDecisionHub, setShowDecisionHub] = useState(false);
  const [showUnlockGuide, setShowUnlockGuide] = useState(false); // NEW STATE
  const [showGodShop, setShowGodShop] = useState(false); // GOD SHOP STATE
  const [showGodRest, setShowGodRest] = useState(false); // GOD REST STATE
  const [showAvatarAlert, setShowAvatarAlert] = useState(false); // AVATAR ALERT STATE
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [spreadType, setSpreadType] = useState<SpreadType | null>(null);
  const [userLocation, setUserLocation] = useState<string>('');

  // --- NEW V4.0: 30-DAY IP LOCK LOGIC ---
  const [isRestricted, setIsRestricted] = useState(false);
  const [nextAvailableDate, setNextAvailableDate] = useState<string>('');
  const [isGodMode, setIsGodMode] = useState(false);
  const [isSuperGodMode, setIsSuperGodMode] = useState(false); // NEW SUPER GOD
  
  // --- DIVINE RANK SYSTEM ---
  const [divineGrade, setDivineGrade] = useState<number>(1);
  const [divineRank, setDivineRank] = useState<string>('委任 (Wei)');
  const [divineTitle, setDivineTitle] = useState<string>('尊者 (Venerable)');

  useEffect(() => {
    // Check if URL has ?soul=seized (Simulation)
    const params = new URLSearchParams(window.location.search);
    if (params.get('soul') === 'seized') {
      setIsSoulSeized(true);
    }

    // GOD MODE CHECK
    if (params.get('mode') === 'god') {
      setIsGodMode(true);
      
      // DIVINE RANK LOGIC (Civil Service System - NEW HIERARCHY)
      // Rank 10-14: High Tier (Warrior / 士) - Ruler
      // Rank 4-9: Middle Tier (Saint / 聖) - Guardian
      // Rank 1-3: Low Tier (Venerable / 尊者 or Immortal / 仙) - Executor
      
      const grade = parseInt(params.get('grade') || '1', 10);
      const gender = params.get('gender') || 'm'; // m=Male (Venerable), f=Female (Immortal)
      
      setDivineGrade(grade);

      if (grade >= 10) {
          setDivineRank('簡任 (Selected)');
          setDivineTitle('士 (Warrior)');
      } else if (grade >= 4) {
          setDivineRank('薦任 (Jian)');
          setDivineTitle('聖 (Saint)');
      } else {
          setDivineRank('委任 (Wei)');
          setDivineTitle(gender === 'f' ? '仙 (Immortal)' : '尊者 (Venerable)');
      }

      console.log(`GOD MODE ACTIVE: Rank=${divineRank}, Grade=${grade}, Title=${divineTitle}`);
    }

    // SUPER GOD MODE CHECK
    if (params.get('mode') === 'supergod') {
      setIsSuperGodMode(true);
      setIsGodMode(true); // Super implies base god
      setDivineGrade(14); // Max grade
      setDivineRank('特任 (Special)');
      setDivineTitle('造物主 (The One)');
      console.log("SUPER GOD MODE ACTIVE: CREATOR LEVEL ACCESS.");
    }

    // IP Reconnaissance Logic
    fetch('https://ipwho.is/')
      .then(res => res.json())
      .then(data => {
         if (data.success) {
             const loc = `${data.country}, ${data.city} (${data.region})`;
             setUserLocation(loc);
         }
      })
      .catch(() => {
         console.warn("IP Reconnaissance Failed. Falling back to unknown.");
      });

    // CHECK COOLDOWN (Bypass if God or Super God)
    if (params.get('mode') !== 'god' && params.get('mode') !== 'supergod') {
      const lastUsage = localStorage.getItem('FOXOKISO_LAST_ACT');
      if (lastUsage) {
        try {
          const { timestamp } = JSON.parse(lastUsage);
          const now = Date.now();
          const daysPassed = (now - timestamp) / (1000 * 60 * 60 * 24);
          if (daysPassed < 30) {
             setIsRestricted(true);
             const nextDate = new Date(timestamp + 30 * 24 * 60 * 60 * 1000);
             setNextAvailableDate(nextDate.toLocaleDateString());
          }
        } catch (e) {
          console.error("Lock Data Corrupt", e);
        }
      }
    }

  }, [divineRank, divineTitle]); // Added dependencies to silence linter if needed

  const recordUsage = () => {
     if (isGodMode || isSuperGodMode) return;
     const data = { timestamp: Date.now(), ip: userLocation };
     localStorage.setItem('FOXOKISO_LAST_ACT', JSON.stringify(data));
     setIsRestricted(true);
     // Calculate next date immediately for UI update
     const nextDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
     setNextAvailableDate(nextDate.toLocaleDateString());
  };

  const handleDraw = (type: SpreadType) => {
    if (isRestricted) {
       setShowUnlockGuide(true); // OPEN GUIDE INSTEAD OF ALERT
       return;
    }
    
    // RECORD USAGE ON DRAW
    recordUsage();

    setSpreadType(type);
    setCards([]);
    // Slight delay for animation
    setTimeout(() => {
      const drawn = drawCards(type, lang);
      setCards(drawn);
    }, 100);
  };

  const handleDownloadBook = () => {
    const content = lang === 'zh' ? BOOK_CONTENT_ZH : BOOK_CONTENT_EN;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // UPDATED: COPILOT EDITION FILENAME FOR FINAL CHAP1
    a.download = `COLOSSEUM_COPILOT_EBOOK_FINAL_CHAP1_${lang.toUpperCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ACTIONS FOR UNLOCK GUIDE
  const guideActions = {
    openConfession: () => { setShowUnlockGuide(false); setShowConfession(true); },
    openShop: () => { setShowUnlockGuide(false); setShowOSC(true); },
    downloadBook: () => { setShowUnlockGuide(false); handleDownloadBook(); }
  };

  if (isBooting) {
    return <SystemBoot onComplete={() => setIsBooting(false)} userLocation={userLocation} />;
  }

  const text = UI_TEXT[lang];

  return (
    <div className={`min-h-screen font-sans bg-gray-50 text-gray-900 transition-colors duration-1000 ${isSoulSeized ? 'grayscale brightness-50 contrast-125' : ''}`}>
      
      {/* --- MIGRATION NOTICE OVERLAY --- */}
      {showMigration && <MigrationNotice lang={lang} onClose={() => setShowMigration(false)} />}
      
      {/* --- OSC SHOP OVERLAY --- */}
      {showOSC && <OSCShopModal lang={lang} onClose={() => setShowOSC(false)} />}

      {/* --- CONFESSION OVERLAY --- */}
      {showConfession && <ConfessionModal onClose={() => setShowConfession(false)} />}

      {/* --- REVIEWS OVERLAY --- */}
      {showReviews && <ReviewsModal lang={lang} onClose={() => setShowReviews(false)} />}

      {/* --- UNLOCK GUIDE OVERLAY --- */}
      {showUnlockGuide && <UnlockGuideModal lang={lang} onClose={() => setShowUnlockGuide(false)} actions={guideActions} />}
      
      {/* --- GOD EXCLUSIVE MODALS --- */}
      {showGodShop && <GodShopModal lang={lang} onClose={() => setShowGodShop(false)} divineRankTitle={divineTitle} />}
      {showGodRest && <GodRestRoomModal lang={lang} onClose={() => setShowGodRest(false)} />}

      {/* --- AVATAR EMERGENCY MODAL --- */}
      {showAvatarAlert && <AvatarEmergencyModal lang={lang} onClose={() => setShowAvatarAlert(false)} />}

      {/* --- DECISION HUB OVERLAY (NEW) --- */}
      {showDecisionHub && (
        <DecisionHubModal 
          lang={lang} 
          onClose={() => setShowDecisionHub(false)} 
          isRestricted={isRestricted}
          nextAvailableDate={nextAvailableDate}
          onActivate={recordUsage}
          onShowUnlock={() => setShowUnlockGuide(true)}
        />
      )}

      {/* --- SOUL SEIZED OVERLAY --- */}
      {isSoulSeized && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6 text-center animate-implode-reverse">
          <div className="max-w-2xl border border-red-900/50 p-8 rounded-2xl bg-gray-900/50 backdrop-blur-sm shadow-[0_0_50px_rgba(255,0,0,0.2)]">
            <h1 className="text-4xl md:text-6xl font-black text-red-600 mb-4 animate-pulse tracking-widest font-serif">
              {text.soul_seized_title}
            </h1>
            <div className="w-20 h-1 bg-red-900 mx-auto mb-6"></div>
            <p className="text-gray-400 whitespace-pre-line mb-8 font-mono text-sm md:text-base leading-relaxed">
              {text.soul_seized_desc}
            </p>
            
            {/* --- UPDATED: 4 METHODS TO UNSEAL --- */}
            <div className="w-full max-w-lg bg-gray-900/80 border border-gray-700 rounded-lg p-4 mb-4 text-left font-mono mx-auto">
              <h3 className="text-red-500 font-bold mb-3 uppercase tracking-widest text-xs border-b border-red-900/30 pb-2">
                封印解除的四種方法 (4 METHODS TO UNSEAL)
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                 <li className="flex items-start gap-3">
                    <span className="text-red-600 font-black min-w-[20px]">[1]</span>
                    <div>
                      <span className="font-bold text-gray-200">輸入密碼 (Input Code)</span>
                      <p className="text-xs text-gray-500 mt-0.5">在下方告白區輸入 "MEMORY" 或 Jack 的故事。</p>
                    </div>
                 </li>
                 <li className="flex items-start gap-3 cursor-pointer group" onClick={() => setShowConfession(true)}>
                    <span className="text-gold font-black min-w-[20px] group-hover:text-white transition-colors">[2]</span>
                    <div>
                      <span className="font-bold text-gold group-hover:text-white decoration-dotted underline transition-colors">神蹟告白 (Miracle Confession)</span>
                      <p className="text-xs text-gray-500 mt-0.5">承認缺憾，獲得神之名 (點擊開啟)。</p>
                    </div>
                 </li>
                 <li className="flex items-start gap-3 cursor-pointer group" onClick={() => setShowOSC(true)}>
                    <span className="text-blue-500 font-black min-w-[20px] group-hover:text-white transition-colors">[3]</span>
                    <div>
                      <span className="font-bold text-blue-400 group-hover:text-white decoration-dotted underline transition-colors">商城贖罪 (Redemption Shop)</span>
                      <p className="text-xs text-gray-500 mt-0.5">購買金士頓刻字神碟 (點擊開啟)。</p>
                    </div>
                 </li>
                 <li className="flex items-start gap-3 cursor-pointer group" onClick={handleDownloadBook}>
                    <span className="text-green-500 font-black min-w-[20px] group-hover:text-white transition-colors">[4]</span>
                    <div>
                      <span className="font-bold text-green-400 group-hover:text-white decoration-dotted underline transition-colors">閱讀史詩 (Read Epic)</span>
                      <p className="text-xs text-gray-500 mt-0.5">下載電子書找回記憶 (點擊下載)。</p>
                    </div>
                 </li>
              </ul>
            </div>
            
            <button 
              onClick={() => setIsSoulSeized(false)} 
              className="text-[10px] text-gray-700 hover:text-gray-500 mb-4"
            >
              [DEBUG: BYPASS SEAL]
            </button>

            {/* --- AI CHAT IN SEALED MODE (UPDATED LABEL) --- */}
            <div className="w-full max-w-2xl mt-4 relative z-10 mx-auto">
               {/* NEW CONFESSION LABEL */}
               <div className="bg-black/50 border-t-2 border-l-2 border-r-2 border-red-900/50 rounded-t-lg p-2 text-center">
                  <h3 className="text-red-500 font-black tracking-[0.5em] text-sm animate-pulse">
                    告白區 (CONFESSION AREA)
                  </h3>
               </div>
               <div className="h-48">
                 <AIChat lang={lang} context="soul" onUnlock={() => setIsSoulSeized(false)} />
               </div>
            </div>

          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-white flex items-center justify-center font-serif font-black rounded text-xl shadow-lg">F</div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900 leading-none">FOXOKISO <span className="text-primary">TAROT</span></h1>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest hidden md:block">{text.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             {/* Broadcaster (Marquee) */}
             <div className="hidden lg:flex overflow-hidden w-64 bg-gray-100 rounded-full py-1 px-3 border border-gray-200">
                <div className="whitespace-nowrap animate-shimmer text-xs font-bold text-primary">
                  {lang === 'zh' ? '🔔 ' + BROADCAST_SCRIPT.zh.substring(0, 50) + '...' : '🔔 ' + BROADCAST_SCRIPT.en.substring(0, 50) + '...'}
                </div>
             </div>

             <button 
               onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
               className="text-xs font-bold border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 transition-colors uppercase"
             >
               {lang === 'zh' ? 'EN' : '繁中'}
             </button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto min-h-screen flex flex-col relative">
        
        {/* === HUGE SURVEILLANCE & CHANCE INDICATOR (TOP RIGHT) === */}
        {userLocation && (
          <div className="fixed top-20 right-4 md:right-8 z-30 text-right animate-pulse select-none pointer-events-none opacity-80">
            {/* UPDATED: CHANGE TO 0 IF LOCKED */}
            <div className={`text-6xl md:text-8xl font-black ${isRestricted ? 'text-red-900/30' : 'text-gray-100/50'} absolute -top-4 -right-4 -z-10`}>
              {isRestricted ? '0' : '1'}
            </div>
            
            {/* UPDATED: LOCK STATUS INDICATOR */}
            <div className={`bg-red-900/80 text-white px-3 py-1 rounded-sm border-l-4 ${isGodMode ? (isSuperGodMode ? 'border-white' : 'border-gold') : 'border-red-500'} inline-block shadow-lg backdrop-blur-sm`}>
              <p className="text-[10px] font-mono tracking-widest uppercase text-red-300 mb-0.5">TARGET LOCATED</p>
              
              {/* UPDATED: SPLIT COUNTRY AND CITY FOR EMPHASIS */}
              <div className="flex flex-col items-end leading-none">
                 <p className="text-lg md:text-xl font-bold font-mono tracking-tighter uppercase text-gray-300">
                   {userLocation.split(',')[0]}
                 </p>
                 <p className="text-2xl md:text-4xl font-black font-mono tracking-tighter uppercase text-white animate-pulse mt-1">
                   {userLocation.split(',')[1] || ''}
                 </p>
              </div>

              {isSuperGodMode ? (
                 <p className="text-xs text-white font-black uppercase animate-pulse mt-1 drop-shadow-[0_0_5px_white]">[ 特任 | 造物主 | THE ONE ]</p>
              ) : isGodMode ? (
                 // DIVINE RANK DISPLAY (CIVIL SERVICE STYLE)
                 <div className="mt-1 flex flex-col items-end">
                     <p className="text-xs text-gold font-black uppercase animate-pulse">
                        [ {divineRank} | 第{divineGrade}職等 ]
                     </p>
                     <p className="text-[10px] text-yellow-200 font-serif tracking-widest">
                        稱號: {divineTitle}
                     </p>
                 </div>
              ) : null}

              {isRestricted && (
                 <p className="text-xs text-red-300 font-bold uppercase mt-1">
                   [ LOCKED: {Math.ceil((new Date(nextAvailableDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} DAYS LEFT ]
                 </p>
              )}
            </div>
            
            <div className="mt-2 flex justify-end">
               <div className={`px-2 py-0.5 text-[10px] font-bold border rounded flex items-center gap-1 ${
                  isRestricted 
                    ? 'bg-red-950 text-red-500 border-red-800' 
                    : 'bg-black/80 text-gold border-gold/50'
               }`}>
                 <span>{isRestricted ? '🔒' : '☝️'}</span> 
                 {/* UPDATED: CHANGE LABEL TO 0 */}
                 {isRestricted ? 'CHANCE: 0 (SEALED)' : 'CHANCE: 1'}
               </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        {!spreadType && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in my-10">
            {/* UPDATED: PHANTOM ONE VISUAL WITH DYNAMIC VALUE PROP */}
            <PhantomOneVisual 
              size="w-48 h-48 md:w-64 md:h-64" 
              label={lang === 'zh' ? (isRestricted ? "命運已定 (SEALED)" : "命運只有一次") : (isRestricted ? "DESTINY SEALED" : "ONLY ONE CHANCE")} 
              fontSize="text-8xl md:text-9xl" 
              value={isRestricted ? "0" : "1"}
            />

            <h2 className="text-4xl md:text-6xl font-serif font-black text-gray-900 mb-4 tracking-tight">
              {lang === 'zh' ? '命運競技場' : 'THE COLOSSEUM'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mb-10 font-light">
              {lang === 'zh' 
                ? "當邏輯遇上直覺，Gemini 與 Copilot 在此交鋒。抽牌吧，讓演算法讀取你的靈魂。" 
                : "Where Logic meets Intuition. Gemini & Copilot clash here. Draw a card, let the algorithm read your soul."}
            </p>

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
              <button 
                onClick={() => handleDraw('single')}
                className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 group transition-all
                  ${isRestricted 
                    ? 'bg-red-100 text-red-600 border border-red-300 hover:bg-red-200' 
                    : 'bg-gray-900 text-white hover:bg-black hover:-translate-y-1'}`}
              >
                <span>{isRestricted ? '🔒' : '🔮'}</span>
                {isRestricted 
                  ? (lang === 'zh' ? '點擊解鎖 (UNLOCK)' : 'CLICK TO UNLOCK') 
                  : (lang === 'zh' ? '單張指引 (Single)' : 'Single Guide')}
                {!isRestricted && <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>}
              </button>
              <button 
                onClick={() => handleDraw('three')}
                className={`flex-1 border-2 py-4 rounded-xl font-bold text-lg shadow-sm flex items-center justify-center gap-2 transition-all
                   ${isRestricted 
                     ? 'bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200 cursor-pointer' 
                     : 'bg-white text-gray-900 border-gray-200 hover:border-primary hover:text-primary hover:-translate-y-1'}`}
              >
                <span>{isRestricted ? '🔒' : '🃏'}</span>
                {isRestricted 
                  ? (lang === 'zh' ? '查看解鎖指引 (UNLOCK)' : 'UNLOCK GUIDE')
                  : (lang === 'zh' ? '三張牌陣 (Time)' : 'Time Spread')}
              </button>
            </div>
            
            {/* V4.0 NEW BUTTONS */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
               <button 
                 onClick={() => setShowDecisionHub(true)}
                 className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold text-sm shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all flex items-center gap-2 border border-purple-400"
               >
                 <span>🌌</span> {lang === 'zh' ? '全域命運決策樞紐 (Hub)' : 'Universal Decision Hub'}
               </button>
               
               {/* UPDATED: Confession Area (No Nine Planets) */}
               <button 
                 onClick={() => setShowConfession(true)}
                 className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-bold text-sm shadow-lg hover:shadow-cyan-500/30 hover:scale-105 transition-all flex items-center gap-2"
               >
                 <span>✨</span> {lang === 'zh' ? '神蹟告白入口 (Confession Area)' : 'Miracle Confession Area'}
               </button>
               
               {/* NEW: 5711438.fun Link - UPDATED LABEL TO LEGENDARY DEEDS WITH 'TRUE STORY' */}
               <a 
                 href="http://5711438.fun"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="px-6 py-2 bg-gray-800 text-white border border-gray-600 rounded-full font-bold text-sm shadow hover:bg-gray-700 transition-colors flex items-center gap-2"
               >
                 <span>🏆</span> {lang === 'zh' ? 'Jack 的傳奇事蹟 (True Story)' : 'Jack\'s Legendary Deeds (True Story)'}
               </a>

               <button 
                 onClick={() => setShowMigration(true)}
                 className="px-6 py-2 bg-red-100 text-red-700 border border-red-200 rounded-full font-bold text-sm hover:bg-red-200 transition-colors flex items-center gap-2 animate-pulse"
               >
                 {text.v5_preview_btn}
               </button>
               
               {/* AVATAR EMERGENCY BUTTON */}
               <button 
                 onClick={() => setShowAvatarAlert(true)}
                 className="px-6 py-2 bg-blue-600 text-white border border-blue-400 rounded-full font-bold text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-all flex items-center gap-2 animate-pulse"
               >
                 <span>📢</span> {lang === 'zh' ? 'Jack Avatar (緊急公告)' : 'Jack Avatar (Emergency)'}
               </button>
            </div>
            
            {/* GOD MODE EXCLUSIVE BUTTONS */}
            {isGodMode && (
                <div className="mt-6 flex gap-4 animate-fade-in">
                    <button onClick={() => setShowGodRest(true)} className="px-6 py-2 bg-white text-gold border border-gold rounded-sm font-bold uppercase text-xs hover:bg-gold hover:text-white transition-colors">
                        {lang === 'zh' ? '進入神之休息室' : 'ENTER GOD REST ROOM'}
                    </button>
                    <button onClick={() => setShowGodShop(true)} className="px-6 py-2 bg-gold text-white rounded-sm font-bold uppercase text-xs hover:bg-white hover:text-gold border border-gold transition-colors shadow-lg">
                        {lang === 'zh' ? '神之購物中心' : 'GOD SHOPPING CENTER'}
                    </button>
                </div>
            )}

            <div className="mt-12 w-full max-w-2xl bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
               <AIChat lang={lang} context="home" />
            </div>
          </div>
        )}

        {/* Results Section */}
        {spreadType && (
          <div className="animate-fade-in pb-20">
            <div className="flex justify-between items-center mb-8">
              <button 
                onClick={() => { setSpreadType(null); setCards([]); }}
                className="text-gray-500 hover:text-primary font-bold flex items-center gap-1 transition-colors"
              >
                ← {lang === 'zh' ? '返回' : 'BACK'}
              </button>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Reading Mode</span>
                <span className="text-lg font-black text-primary">{spreadType === 'single' ? 'SINGLE ORACLE' : 'TRINITY TIME'}</span>
              </div>
            </div>

            <div className={`grid gap-8 ${spreadType === 'single' ? 'grid-cols-1 max-w-sm mx-auto' : 'grid-cols-1 md:grid-cols-3'}`}>
              {cards.map((card, index) => (
                <CardDisplay 
                  key={index} 
                  data={card} 
                  index={index} 
                  lang={lang} 
                />
              ))}
            </div>

            {/* Post-Reading Actions */}
            <div className="mt-16 text-center space-y-4">
               <p className="text-gray-500 italic font-serif">
                 "{lang === 'zh' ? '記住你的選擇，因為演算法已經記住了你。' : 'Remember your choice, for the algorithm has already remembered you.'}"
               </p>
               <div className="flex justify-center gap-4">
                 <button 
                    onClick={handleDownloadBook}
                    className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-transform hover:-translate-y-0.5 flex items-center gap-2"
                 >
                    <span>💾</span> {text.ebook_btn}
                 </button>
                 <button 
                    onClick={() => setShowOSC(true)}
                    className="bg-white text-gray-900 border border-gray-300 px-8 py-3 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                 >
                    <span>🛒</span> {lang === 'zh' ? '前往 OSC 商城' : 'Visit OSC Shop'}
                 </button>
               </div>
            </div>
          </div>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-3 text-center z-40">
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest relative">
           
           {/* SEAL BUTTON */}
           <span className="text-primary cursor-pointer hover:underline" onClick={() => setIsSoulSeized(true)}>SEAL DESTINY</span>
           <span className="hidden md:inline">|</span>
           
           <span>© 2025 FOXOKISO TAROT</span>
           
           {/* LOCK STATUS */}
           <span className="hidden md:inline">|</span>
           {isRestricted ? (
             <span onClick={() => setShowUnlockGuide(true)} className="text-red-500 font-black animate-pulse cursor-pointer hover:underline hover:text-red-600">[ LOCKED UNTIL {nextAvailableDate} - CLICK TO UNLOCK ]</span>
           ) : (
             <span className="text-green-500 font-bold">[ SYSTEM READY ]</span>
           )}
           <span className="hidden md:inline">|</span>
           
           {/* MAIN STAGE */}
           <a 
             href="https://28825252.xyz" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-gray-600 hover:text-black hover:underline"
           >
             {lang === 'zh' ? 'main: 正式運行版' : 'main: OFFICIAL LIVE VERSION'}
           </a>
           <span className="hidden md:inline">|</span>
           
           {/* TRANSITIONAL (NEW) */}
           <a 
             href="https://28825252.fun" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-gray-600 hover:text-black hover:underline"
           >
             {lang === 'zh' ? 'TAROT: 28825252.FUN' : 'TAROT: 28825252.FUN'}
           </a>
           
           {/* PK530.FUN (NEW NODE) */}
           <span className="hidden md:inline">|</span>
           <a 
             href="https://pk530.fun" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-gray-600 hover:text-black hover:underline"
           >
             {lang === 'zh' ? 'PK530.FUN (弱勢團結)' : 'PK530.FUN (UNDERDOG UNITY)'}
           </a>

        </div>
      </footer>

    </div>
  );
}