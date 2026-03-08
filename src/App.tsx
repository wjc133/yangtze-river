import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Hand } from 'lucide-react';

const MAP_WIDTH = 4000;
const MAP_HEIGHT = 1080;

const cities = [
  { id: 'chongqing', name: '重庆', x: 300, y: 750, desc: '洪崖洞 / 山城' },
  { id: 'changshou', name: '长寿', x: 550, y: 700, desc: '' },
  { id: 'fuling', name: '涪陵', x: 750, y: 680, desc: '乌江画廊' },
  { id: 'zhongxian', name: '忠县', x: 950, y: 700, desc: '' },
  { id: 'wanzhou', name: '万州', x: 1150, y: 620, desc: '平湖万州' },
  { id: 'yunyang', name: '云阳', x: 1350, y: 550, desc: '' },
  { id: 'fengjie', name: '奉节', x: 1600, y: 500, desc: '白帝城' },
  { id: 'wushan', name: '巫山', x: 1900, y: 450, desc: '神女峰' },
  { id: 'badong', name: '巴东', x: 2100, y: 480, desc: '' },
  { id: 'zigui', name: '秭归', x: 2300, y: 500, desc: '屈原故里' },
  { id: 'yichang', name: '宜昌', x: 2600, y: 610, desc: '' },
  { id: 'jingzhou', name: '荆州', x: 3000, y: 650, desc: '荆州古城' },
  { id: 'xiantao', name: '仙桃', x: 3300, y: 620, desc: '' },
  { id: 'wuhan', name: '武汉', x: 3700, y: 650, desc: '黄鹤楼' },
];

const landmarks = [
  { name: '葛洲坝', x: 2620, y: 620 },
  { name: '三峡大坝', x: 2550, y: 560 },
  { name: '西陵峡', x: 2400, y: 530 },
  { name: '巫峡', x: 2000, y: 460 },
  { name: '瞿塘峡', x: 1750, y: 480 },
];

const mountainData = [
  // Shennongjia / Daba Mountains (North)
  { x: 3200, y: 150, scale: 1.2 },
  { x: 2800, y: 200, scale: 1.5 },
  { x: 2400, y: 150, scale: 2.5 },
  { x: 2100, y: 100, scale: 3 },
  { x: 1800, y: 120, scale: 2.8 },
  { x: 1500, y: 150, scale: 2.2 },
  { x: 1200, y: 200, scale: 1.8 },
  { x: 900, y: 250, scale: 1.5 },
  { x: 500, y: 300, scale: 1.2 },
  
  // Wuling Mountains / South Mountains
  { x: 2500, y: 800, scale: 1.8 },
  { x: 2100, y: 750, scale: 2.2 },
  { x: 1700, y: 850, scale: 2 },
  { x: 1300, y: 900, scale: 1.5 },
  { x: 900, y: 850, scale: 1.2 },
  { x: 400, y: 900, scale: 1.5 },
  
  // Wu Mountains (Middle)
  { x: 1950, y: 350, scale: 2 },
  { x: 1750, y: 380, scale: 1.8 },
  
  // Extra filler mountains
  { x: 3000, y: 300, scale: 1 },
  { x: 2600, y: 250, scale: 1.5 },
  { x: 2300, y: 200, scale: 2 },
  { x: 1600, y: 250, scale: 1.8 },
  { x: 1000, y: 300, scale: 1.2 },
  { x: 700, y: 250, scale: 1.5 },
  { x: 200, y: 350, scale: 1.2 },
  { x: 2300, y: 850, scale: 1.5 },
  { x: 1900, y: 800, scale: 1.8 },
  { x: 1500, y: 850, scale: 1.5 },
  { x: 1100, y: 900, scale: 1.2 },
  { x: 600, y: 850, scale: 1.5 },
];

const treeData = [
  { x: 3400, y: 500 }, { x: 3350, y: 520 }, { x: 3420, y: 550 },
  { x: 2900, y: 450 }, { x: 2850, y: 480 },
  { x: 2500, y: 350 }, { x: 2550, y: 380 }, { x: 2480, y: 400 },
  { x: 2000, y: 600 }, { x: 1950, y: 620 },
  { x: 1500, y: 350 }, { x: 1450, y: 380 },
  { x: 1000, y: 450 }, { x: 1050, y: 480 }, { x: 980, y: 500 },
  { x: 500, y: 550 }, { x: 450, y: 580 },
  { x: 200, y: 600 }, { x: 250, y: 620 },
  // South trees
  { x: 2800, y: 800 }, { x: 2850, y: 820 },
  { x: 2200, y: 750 }, { x: 2250, y: 780 },
  { x: 1600, y: 700 }, { x: 1650, y: 720 },
  { x: 1100, y: 800 }, { x: 1150, y: 820 },
  { x: 700, y: 850 }, { x: 750, y: 880 },
];

const houseData = [
  { x: 3650, y: 620, scale: 0.8 }, { x: 3680, y: 630, scale: 0.9 }, { x: 3620, y: 640, scale: 0.7 },
  { x: 2950, y: 680, scale: 0.8 }, { x: 2980, y: 670, scale: 0.7 },
  { x: 2550, y: 570, scale: 0.8 }, { x: 2580, y: 580, scale: 0.7 },
  { x: 1120, y: 600, scale: 0.8 }, { x: 1160, y: 590, scale: 0.9 }, { x: 1180, y: 610, scale: 0.7 },
  { x: 320, y: 720, scale: 0.9 }, { x: 350, y: 710, scale: 0.8 }, { x: 330, y: 690, scale: 0.7 },
  { x: 360, y: 680, scale: 0.8 }, { x: 380, y: 700, scale: 0.9 }, { x: 340, y: 660, scale: 0.7 },
];

const cloudData = [
  { x: 3800, y: 200, scale: 1.5 }, { x: 3400, y: 150, scale: 2 }, { x: 3000, y: 250, scale: 1.2 },
  { x: 2600, y: 100, scale: 1.8 }, { x: 2200, y: 200, scale: 2.5 }, { x: 1800, y: 150, scale: 1.5 },
  { x: 1400, y: 250, scale: 2 }, { x: 1000, y: 150, scale: 1.8 }, { x: 600, y: 200, scale: 1.5 },
  { x: 200, y: 150, scale: 2 },
  { x: 3500, y: 800, scale: 1.5 }, { x: 2800, y: 850, scale: 2 }, { x: 2000, y: 900, scale: 1.8 },
  { x: 1200, y: 850, scale: 1.5 }, { x: 500, y: 900, scale: 2 },
];

const wallData = [
  { x: 3000, y: 640, scale: 0.8 },
];

const getCityDelay = (x: number) => {
  const distance = 4000 - x;
  const time = distance / (4000 / 12);
  return 2 + Math.max(0, time) - 0.5;
};

const PaperFilter = () => (
  <svg width="0" height="0" className="absolute">
    <filter id="paper-noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 0.95 0 0 0  0 0.85 0 0 0  0 0 0 0.05 0" in="noise" result="coloredNoise" />
      <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" />
    </filter>
  </svg>
);

const MountainGroup = ({ x, y, scale = 1, delay = 0 }: { x: number, y: number, scale?: number, delay?: number }) => (
  <motion.g
    initial={{ opacity: 0, x, y: y + 50, scale }}
    animate={{ opacity: 1, x, y, scale }}
    transition={{ duration: 2, delay, ease: "easeOut" }}
    className="z-0"
  >
    <path d="M 0 150 Q 50 20 100 150 Z" fill="#4A5D4E" opacity="0.9" />
    <path d="M -30 180 Q 30 60 90 180 Z" fill="#3B6978" opacity="0.9" />
    <path d="M 40 200 Q 90 80 140 200 Z" fill="#5C806B" />
    <ellipse cx="50" cy="190" rx="120" ry="20" fill="#EBE5D9" opacity="0.6" />
  </motion.g>
);

const TraditionalHouse = ({ x, y, scale = 1, delay = 0 }: { x: number, y: number, scale?: number, delay?: number }) => (
  <motion.g
    initial={{ opacity: 0, x, y: y + 10, scale }}
    animate={{ opacity: 1, x, y, scale }}
    transition={{ duration: 1.5, delay, ease: "easeOut" }}
    className="z-10"
  >
    <path d="M -25 0 Q 0 -20 25 0 L 30 -3 Q 0 -25 -30 -3 Z" fill="#4A3B32" />
    <rect x="-18" y="0" width="36" height="20" fill="#E3D9C6" stroke="#4A3B32" strokeWidth="1.5" />
    <rect x="-5" y="8" width="10" height="12" fill="#4A3B32" />
    <line x1="-18" y1="10" x2="-5" y2="10" stroke="#4A3B32" strokeWidth="1" />
    <line x1="5" y1="10" x2="18" y2="10" stroke="#4A3B32" strokeWidth="1" />
  </motion.g>
);

const Cloud = ({ x, y, scale = 1, delay = 0 }: { x: number, y: number, scale?: number, delay?: number }) => (
  <motion.g
    initial={{ opacity: 0, x: x - 20, y, scale }}
    animate={{ opacity: 0.7, x, y, scale }}
    transition={{ duration: 3, delay, ease: "easeOut" }}
    className="z-20 pointer-events-none"
  >
    <path d="M 0 20 Q 10 0 30 10 Q 50 -10 70 10 Q 90 0 100 20 Q 110 30 90 40 L 10 40 Q -10 30 0 20 Z" fill="#F5F0E6" />
    <path d="M 0 20 Q 10 0 30 10 Q 50 -10 70 10 Q 90 0 100 20 Q 110 30 90 40 L 10 40 Q -10 30 0 20 Z" fill="none" stroke="#D3C5B0" strokeWidth="2" />
  </motion.g>
);

const CityWall = ({ x, y, scale = 1, delay = 0 }: { x: number, y: number, scale?: number, delay?: number }) => (
  <motion.g
    initial={{ opacity: 0, x, y: y + 20, scale }}
    animate={{ opacity: 1, x, y, scale }}
    transition={{ duration: 1.5, delay, ease: "easeOut" }}
    className="z-10"
  >
    <rect x="-40" y="-15" width="80" height="30" fill="#8C7A6B" stroke="#4A3B32" strokeWidth="2" />
    <path d="M -40 -15 L -40 -25 L -30 -25 L -30 -15 M -20 -15 L -20 -25 L -10 -25 L -10 -15 M 0 -15 L 0 -25 L 10 -25 L 10 -15 M 20 -15 L 20 -25 L 30 -25 L 30 -15 M 40 -15 L 40 -25" fill="none" stroke="#4A3B32" strokeWidth="2" />
    <path d="M -15 15 A 15 15 0 0 1 15 15" fill="#4A3B32" />
  </motion.g>
);

const PineTree = ({ x, y, scale = 1, delay = 0 }: { x: number, y: number, scale?: number, delay?: number }) => (
  <motion.g
    initial={{ opacity: 0, x, y, scale: 0 }}
    animate={{ opacity: 1, x, y, scale }}
    transition={{ duration: 1, delay, ease: "backOut" }}
    className="z-10"
  >
    <path d="M 0 0 L 10 -30 L 20 0 Z" fill="#2A4B3C" opacity="0.9" />
    <path d="M -5 10 L 10 -20 L 25 10 Z" fill="#2A4B3C" opacity="0.9" />
    <path d="M -10 20 L 10 -10 L 30 20 Z" fill="#3A5B4C" opacity="0.9" />
    <rect x="8" y="20" width="4" height="10" fill="#3A2010" />
  </motion.g>
);

const River = () => {
  const riverPath = `
    M 4000 650
    Q 3850 640, 3700 650
    C 3500 660, 3400 610, 3300 620
    C 3150 630, 3100 660, 3000 650
    C 2800 630, 2700 620, 2600 600
    C 2500 580, 2400 500, 2300 500
    C 2200 500, 2150 480, 2100 480
    C 2000 480, 1950 450, 1900 450
    C 1800 450, 1700 520, 1600 500
    C 1450 460, 1400 550, 1350 550
    C 1250 550, 1200 620, 1150 620
    C 1050 620, 1000 700, 950 700
    C 850 700, 800 680, 750 680
    C 650 680, 600 700, 550 700
    C 450 700, 400 760, 300 750
    Q 150 740, 0 750
  `;
  
  const hanRiverPath = "M 3700 650 C 3600 400, 3400 200, 3200 100";
  const jialingRiverPath = "M 300 750 C 250 500, 200 300, 100 100";
  const wuRiverPath = "M 750 680 C 800 850, 850 950, 900 1080";
  const qingjiangRiverPath = "M 2650 620 C 2600 800, 2400 900, 2200 1000";

  return (
    <svg width={MAP_WIDTH} height={MAP_HEIGHT} className="absolute top-0 left-0 pointer-events-none z-10">
      {/* Main Yangtze River */}
      <motion.path
        d={riverPath}
        fill="none"
        stroke="#4A7A6E"
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 12, delay: 2, ease: "easeInOut" }}
      />
      <motion.path
        d={riverPath}
        fill="none"
        stroke="#6B8E82"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 12, delay: 2.2, ease: "easeInOut" }}
      />
      
      {/* Tributaries */}
      {[
        { path: hanRiverPath, delay: 3 },
        { path: jialingRiverPath, delay: 11 },
        { path: wuRiverPath, delay: 9 },
        { path: qingjiangRiverPath, delay: 6 }
      ].map((river, i) => (
        <motion.path
          key={i}
          d={river.path}
          fill="none"
          stroke="#6B8E82"
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, delay: river.delay, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
};

const CityMarker = ({ city, delay }: { city: any, delay: number }) => {
  return (
    <motion.div
      className="absolute flex flex-col items-center z-40"
      initial={{ opacity: 0, scale: 0.5, x: city.x, y: city.y }}
      animate={{ opacity: 1, scale: 1, x: city.x, y: city.y - 20 }}
      transition={{ duration: 0.8, delay, type: "spring" }}
    >
      <div className="relative flex flex-col items-center">
        <div className="w-5 h-5 bg-[#9E2A2B] rounded-full border-2 border-[#EBE5D9] shadow-md z-10 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-[#EBE5D9] rounded-full" />
        </div>
        <div className="mt-3 flex flex-col items-center bg-[#EBE5D9] bg-opacity-70 backdrop-blur-sm p-2 rounded border border-[#C8BCA7]">
          <span className="text-2xl font-bold text-[#1A1A1A] font-serif tracking-widest writing-vertical-rl">
            {city.name}
          </span>
          {city.desc && (
            <span className="mt-2 text-sm text-[#5A5A5A] font-serif writing-vertical-rl">
              {city.desc}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Boat = ({ x, y, delay }: { x: number, y: number, delay: number }) => (
  <motion.div
    className="absolute z-20"
    initial={{ opacity: 0, x, y }}
    animate={{ opacity: 1, x: x - 100, y: y + 20 }}
    transition={{ duration: 20, delay, repeat: Infinity, repeatType: "reverse" }}
  >
    <svg width="40" height="20" viewBox="0 0 40 20">
      <path d="M 5 15 L 35 15 L 40 10 L 0 10 Z" fill="#5C4033" />
      <path d="M 10 10 C 10 0, 30 0, 30 10 Z" fill="#8B5A2B" />
    </svg>
  </motion.div>
);

const TitleStamp = () => (
  <motion.div
    className="fixed top-4 right-4 md:top-8 md:right-8 z-50 flex flex-col items-center pointer-events-none"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, delay: 1 }}
  >
    <div className="border-2 md:border-4 border-[#9E2A2B] p-2 md:p-3 bg-[#EBE5D9] bg-opacity-90 shadow-lg">
      <h1 className="text-3xl md:text-5xl font-bold text-[#9E2A2B] font-stamp tracking-widest writing-vertical-rl">
        长江万里图
      </h1>
    </div>
    <div className="mt-4 md:mt-6 border border-md md:border-2 border-[#1A1A1A] p-1.5 md:p-2 bg-[#EBE5D9] bg-opacity-90 shadow-md">
      <p className="text-sm md:text-xl text-[#1A1A1A] font-serif font-bold tracking-widest writing-vertical-rl">
        武汉至重庆
      </p>
    </div>
  </motion.div>
);

const RegionLabel = ({ text, x, y, delay }: { text: string, x: number, y: number, delay: number }) => (
  <motion.div
    className="absolute z-50 pointer-events-none"
    initial={{ opacity: 0, x, y }}
    animate={{ opacity: 0.6, x, y }}
    transition={{ duration: 2, delay }}
  >
    <span className="text-3xl text-[#3B5E55] font-calligraphy tracking-widest opacity-80">
      {text}
    </span>
  </motion.div>
);

const LandmarkLabel = ({ text, x, y, delay }: { text: string, x: number, y: number, delay: number }) => (
  <motion.div
    className="absolute z-30 flex items-center gap-1.5"
    initial={{ opacity: 0, x, y: y + 10 }}
    animate={{ opacity: 1, x, y }}
    transition={{ duration: 1, delay, ease: "easeOut" }}
  >
    <div className="w-2 h-2 rounded-full bg-[#3B5E55] border border-[#EBE5D9] shadow-sm" />
    <div className="bg-[#EBE5D9] bg-opacity-80 backdrop-blur-sm px-2 py-0.5 rounded border border-[#8C8C8C] shadow-sm">
      <span className="text-xs font-bold text-[#3B5E55] tracking-widest font-serif">{text}</span>
    </div>
  </motion.div>
);

export default function App() {
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
  const [isInteractive, setIsInteractive] = useState(false);
  const [key, setKey] = useState(0);
  const mapRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mapScale = vh / MAP_HEIGHT;
  const scaledWidth = MAP_WIDTH * mapScale;

  const startX = vw - scaledWidth; // Start at the right edge (Wuhan)
  const endX = 0; // End at the left edge (Chongqing)

  const startAnimation = () => {
    setIsInteractive(false);
    setKey(prev => prev + 1);
  };

  return (
    <div className="w-screen h-screen bg-[#1A1A1A] overflow-hidden relative font-sans">
      <PaperFilter />
      
      <motion.div
        key={`mask-${key}`}
        className="fixed top-0 bottom-0 z-40 bg-[#1A1A1A] flex justify-end pointer-events-none"
        initial={{ width: '100vw', left: 0 }}
        animate={{ width: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <div className="w-12 h-full bg-gradient-to-r from-[#3A2010] via-[#8B5A2B] to-[#3A2010] shadow-[-20px_0_30px_rgba(0,0,0,0.8)] border-l-4 border-[#2A1000] relative">
           <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#A0522D] opacity-50" />
        </div>
      </motion.div>

      <TitleStamp key={`title-${key}`} />

      <motion.div
        ref={mapRef}
        key={`map-${key}`}
        className="absolute top-0 bottom-0 cursor-grab active:cursor-grabbing"
        style={{ width: scaledWidth, height: vh, willChange: 'transform' }}
        drag={isInteractive ? "x" : false}
        dragConstraints={{ left: vw - scaledWidth, right: 0 }}
        initial={{ x: startX }}
        animate={!isInteractive ? { x: endX } : {}}
        transition={{ duration: 12, ease: "easeInOut", delay: 2 }}
        onAnimationComplete={() => setIsInteractive(true)}
      >
        <div 
          className="paper-bg absolute top-0 left-0"
          style={{ 
            width: MAP_WIDTH, 
            height: MAP_HEIGHT, 
            transform: `scale(${mapScale})`, 
            transformOrigin: 'left top' 
          }}
        >
          <River key={`river-${key}`} />

          <svg width={MAP_WIDTH} height={MAP_HEIGHT} className="absolute top-0 left-0 pointer-events-none z-20">
            {cloudData.map((c, i) => (
              <Cloud key={`c-${i}`} x={c.x} y={c.y} scale={c.scale} delay={getCityDelay(c.x) - 0.5} />
            ))}
            {mountainData.map((m, i) => (
              <MountainGroup key={`m-${i}`} x={m.x} y={m.y} scale={m.scale} delay={getCityDelay(m.x)} />
            ))}
            {treeData.map((t, i) => (
              <PineTree key={`t-${i}`} x={t.x} y={t.y} scale={0.8 + Math.random() * 0.4} delay={getCityDelay(t.x) + 0.5} />
            ))}
            {houseData.map((h, i) => (
              <TraditionalHouse key={`h-${i}`} x={h.x} y={h.y} scale={h.scale} delay={getCityDelay(h.x) + 0.8} />
            ))}
            {wallData.map((w, i) => (
              <CityWall key={`w-${i}`} x={w.x} y={w.y} scale={w.scale} delay={getCityDelay(w.x) + 0.8} />
            ))}
          </svg>

          {cities.map((city) => (
            <CityMarker key={city.id} city={city} delay={getCityDelay(city.x)} />
          ))}

          {landmarks.map((landmark, i) => (
            <LandmarkLabel key={`lm-${i}`} text={landmark.name} x={landmark.x} y={landmark.y} delay={getCityDelay(landmark.x) + 0.5} />
          ))}

          <Boat x={3000} y={660} delay={4} />
          <Boat x={2000} y={480} delay={8} />
          <Boat x={1000} y={680} delay={12} />
          
          <RegionLabel text="江汉平原" x={3300} y={350} delay={getCityDelay(3300)} />
          <RegionLabel text="神农架" x={2400} y={250} delay={getCityDelay(2400)} />
          <RegionLabel text="巫山山脉" x={1900} y={250} delay={getCityDelay(1900)} />
          <RegionLabel text="大巴山脉" x={1300} y={200} delay={getCityDelay(1300)} />
          <RegionLabel text="武陵山脉" x={1800} y={850} delay={getCityDelay(1800)} />
          <RegionLabel text="重庆丘陵" x={600} y={850} delay={getCityDelay(600)} />
          
          <RegionLabel text="汉江" x={3450} y={400} delay={getCityDelay(3450)} />
          <RegionLabel text="嘉陵江" x={200} y={450} delay={getCityDelay(200)} />
          <RegionLabel text="乌江" x={820} y={850} delay={getCityDelay(820)} />
          <RegionLabel text="清江" x={2500} y={800} delay={getCityDelay(2500)} />
        </div>
      </motion.div>

      {isInteractive && (
        <motion.div 
          className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col md:flex-row gap-2 md:gap-4 items-center w-[90%] md:w-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-[#EBE5D9] bg-opacity-90 backdrop-blur px-4 md:px-6 py-2 md:py-3 rounded-full shadow-xl border border-[#C8BCA7] flex items-center gap-2 text-[#4A4A4A] w-full md:w-auto justify-center">
            <Hand size={18} className="md:w-5 md:h-5" />
            <span className="font-serif font-bold text-sm md:text-base">可拖动地图探索</span>
          </div>
          <button 
            onClick={startAnimation}
            className="bg-[#9E2A2B] text-[#EBE5D9] px-4 md:px-6 py-2 md:py-3 rounded-full shadow-xl hover:bg-[#7A2021] transition-colors flex items-center gap-2 font-serif font-bold border border-[#7A2021] w-full md:w-auto justify-center text-sm md:text-base"
          >
            <RotateCcw size={18} className="md:w-5 md:h-5" />
            <span>重新展开</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
