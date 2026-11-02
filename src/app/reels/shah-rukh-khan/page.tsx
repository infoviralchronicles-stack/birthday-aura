'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function SRKReelPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [statusText, setStatusText] = useState('Ready to preview or download 15s reel');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const TOTAL_DURATION = 15.0; // 15 seconds

  // Particle pool
  const particlesRef = useRef(
    Array.from({ length: 85 }, () => ({
      x: Math.random() * 1080,
      y: Math.random() * 1920,
      size: Math.random() * 6 + 2,
      speedY: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 1.5,
      color: ['#ffd700', '#ff1f5a', '#ff9671', '#00e5ff', '#ffffff', '#ffd070'][
        Math.floor(Math.random() * 6)
      ],
      alpha: Math.random() * 0.7 + 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
    }))
  );

  const imagesRef = useRef<{ srk: HTMLImageElement | null; logo: HTMLImageElement | null }>({
    srk: null,
    logo: null,
  });

  useEffect(() => {
    const srk = new Image();
    srk.crossOrigin = 'anonymous';
    srk.src = '/celebrities/shah-rukh-khan.jpg';
    imagesRef.current.srk = srk;

    const logo = new Image();
    logo.crossOrigin = 'anonymous';
    logo.src = '/facebook-profile-logo.png';
    imagesRef.current.logo = logo;

    srk.onload = () => {
      renderScene(0);
    };

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
  };

  const playChime = (freq: number, delaySec: number, dur: number) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delaySec);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + delaySec);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + delaySec + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delaySec + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delaySec);
      osc.stop(ctx.currentTime + delaySec + dur);
    } catch {}
  };

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    stroke = false
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    if (stroke) ctx.stroke();
  };

  const renderScene = (t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const progress = Math.min(t / TOTAL_DURATION, 1.0);

    // 1. Dark Cinematic Background
    const bgGrad = ctx.createRadialGradient(540, 960, 200, 540, 960, 1100);
    bgGrad.addColorStop(0, '#240d29');
    bgGrad.addColorStop(0.5, '#0e0b1c');
    bgGrad.addColorStop(1, '#050409');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Animated Aura Glow
    const auraPulse = Math.sin(t * 4) * 40;
    const auraGrad = ctx.createRadialGradient(540, 780, 100, 540, 780, 480 + auraPulse);
    auraGrad.addColorStop(0, 'rgba(255, 31, 90, 0.45)');
    auraGrad.addColorStop(0.5, 'rgba(255, 215, 0, 0.22)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // 3. Floating Confetti & Sparkles
    particlesRef.current.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;
      if (p.y < 0) {
        p.y = 1920;
        p.x = Math.random() * 1080;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * (0.8 + 0.2 * Math.sin(t * 3));
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      ctx.restore();
    });

    // 4. SRK Photo with Ken Burns Zoom & Golden Halo
    const srkImg = imagesRef.current.srk;
    if (srkImg && srkImg.complete && srkImg.naturalWidth > 0) {
      ctx.save();
      const photoY = 740;
      const radius = 320;

      ctx.beginPath();
      ctx.arc(540, photoY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const zoom = 1.0 + (t % 5.0) * 0.035;
      const imgSize = radius * 2.3 * zoom;
      ctx.drawImage(srkImg, 540 - imgSize / 2, photoY - imgSize / 2, imgSize, imgSize);
      ctx.restore();

      // Golden Halo Ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(540, photoY, radius, 0, Math.PI * 2);
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#ffd700';
      ctx.shadowColor = '#ff1f5a';
      ctx.shadowBlur = 30;
      ctx.stroke();

      // Outer rotating accent arc
      ctx.beginPath();
      ctx.arc(540, photoY, radius + 22, t * 1.2, t * 1.2 + Math.PI * 1.4);
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.restore();
    }

    // 5. Crown Emoji
    ctx.save();
    ctx.font = '95px sans-serif';
    ctx.textAlign = 'center';
    const bounce = Math.sin(t * 5) * 8;
    ctx.fillText('👑', 540, 360 + bounce);
    ctx.restore();

    // 6. Timeline Text Sequencing (0 - 15 seconds)
    if (t < 3.8) {
      // Scene 1: 0 - 3.8s (Hook)
      ctx.save();
      ctx.textAlign = 'center';

      ctx.fillStyle = '#ff1f5a';
      roundRect(ctx, 540 - 240, 390, 480, 60, 30);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 26px sans-serif';
      ctx.fillText('★ TODAY • NOVEMBER 2 ★', 540, 432);

      ctx.font = '900 72px sans-serif';
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = 'rgba(255, 215, 0, 0.9)';
      ctx.shadowBlur = 25;
      ctx.fillText('SHAH RUKH KHAN', 540, 1170);

      ctx.font = '700 42px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 10;
      ctx.fillText('TURNS 61 TODAY', 540, 1245);

      ctx.font = '600 32px sans-serif';
      ctx.fillStyle = '#ff9671';
      ctx.fillText('The Undisputed King of Bollywood', 540, 1305);
      ctx.restore();
    } else if (t < 7.8) {
      // Scene 2: 3.8 - 7.8s (Global Dominance & Stats)
      ctx.save();
      ctx.textAlign = 'center';

      ctx.fillStyle = '#845ec2';
      roundRect(ctx, 540 - 270, 390, 540, 60, 30);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 26px sans-serif';
      ctx.fillText('GLOBAL RECORD BREAKER', 540, 432);

      // Stat Badge 1
      ctx.fillStyle = 'rgba(20, 15, 35, 0.9)';
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      roundRect(ctx, 140, 1120, 800, 110, 24, true);
      ctx.fillStyle = '#ffd700';
      ctx.font = '900 44px sans-serif';
      ctx.fillText('🔥 340,000+ BIRTHDAY WISHES', 540, 1175);
      ctx.font = '500 24px sans-serif';
      ctx.fillStyle = '#e0e0ff';
      ctx.fillText('Trending #1 Worldwide Today', 540, 1210);

      // Stat Badge 2
      ctx.fillStyle = 'rgba(20, 15, 35, 0.9)';
      ctx.strokeStyle = '#ff1f5a';
      ctx.lineWidth = 3;
      roundRect(ctx, 140, 1260, 800, 110, 24, true);
      ctx.fillStyle = '#ff1f5a';
      ctx.font = '900 40px sans-serif';
      ctx.fillText('💰 $1+ BILLION NET WORTH', 540, 1315);
      ctx.font = '500 24px sans-serif';
      ctx.fillStyle = '#e0e0ff';
      ctx.fillText('One of the Richest Actors in History', 540, 1350);
      ctx.restore();
    } else if (t < 11.5) {
      // Scene 3: 7.8 - 11.5s (Blockbusters)
      ctx.save();
      ctx.textAlign = 'center';

      ctx.fillStyle = '#ff1f5a';
      roundRect(ctx, 540 - 250, 390, 500, 60, 30);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 26px sans-serif';
      ctx.fillText('3 DECADES OF DOMINANCE', 540, 432);

      ctx.font = '900 52px sans-serif';
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 20;
      ctx.fillText('FROM FAUJI TO KING', 540, 1160);

      ctx.font = '700 36px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 5;
      ctx.fillText('DDLJ • DEVDAS • CHAK DE', 540, 1230);
      ctx.fillStyle = '#ff9671';
      ctx.fillText('JAWAN • PATHAAN • DUNKI', 540, 1290);

      ctx.font = '600 28px sans-serif';
      ctx.fillStyle = '#a0a0ff';
      ctx.fillText('Rule 1: The King Never Steps Down!', 540, 1355);
      ctx.restore();
    } else {
      // Scene 4: 11.5 - 15.0s (Birthday Aura Call to Action)
      ctx.save();
      ctx.textAlign = 'center';

      ctx.fillStyle = 'rgba(15, 10, 30, 0.95)';
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 4;
      roundRect(ctx, 100, 1100, 880, 320, 30, true);

      ctx.font = '900 48px sans-serif';
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
      ctx.shadowBlur = 25;
      ctx.fillText('WISH KING KHAN TODAY!', 540, 1180);

      ctx.font = '600 32px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.fillText('Drop Your Birthday Wishes at:', 540, 1245);

      ctx.font = '900 44px sans-serif';
      ctx.fillStyle = '#ff1f5a';
      ctx.fillText('BirthdayAura.com', 540, 1315);

      ctx.font = '700 24px sans-serif';
      ctx.fillStyle = '#ffd700';
      ctx.fillText('Like & Share for King Khan! ❤️🔥', 540, 1375);
      ctx.restore();
    }

    // 7. Watermark / Logo
    ctx.save();
    const logoImg = imagesRef.current.logo;
    if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
      ctx.drawImage(logoImg, 540 - 45, 1720, 90, 90);
    }
    ctx.font = '900 28px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 10;
    ctx.fillText('BIRTHDAY AURA', 540, 1845);
    ctx.font = '500 18px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('daily celebrity birthdays & auras', 540, 1875);
    ctx.restore();

    // 8. Top Progress Bar
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(40, 40, 1000, 8);
    ctx.fillStyle = '#ff1f5a';
    ctx.fillRect(40, 40, 1000 * progress, 8);

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    roundRect(ctx, 1080 - 170, 70, 130, 44, 22);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.toFixed(1) + 's / 15s', 1080 - 105, 100);
    ctx.restore();
  };

  const loop = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = (timestamp - startTimeRef.current) / 1000;

    if (elapsed >= TOTAL_DURATION) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setIsPlaying(false);
        return;
      } else {
        startTimeRef.current = timestamp; // loop
      }
    }

    renderScene(elapsed % TOTAL_DURATION);
    animRef.current = requestAnimationFrame(loop);
  };

  const togglePlay = () => {
    initAudio();
    if (isPlaying) {
      setIsPlaying(false);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setStatusText('Preview paused');
    } else {
      setIsPlaying(true);
      startTimeRef.current = null;
      setStatusText('Playing 15-second reel preview...');
      animRef.current = requestAnimationFrame(loop);
    }
  };

  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    initAudio();

    setIsRecording(true);
    setIsPlaying(false);
    setStatusText('🎬 Recording 15-second HD Reel... Please wait!');
    recordedChunksRef.current = [];

    const stream = canvas.captureStream(30);
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = '';
      }
    }

    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'shah-rukh-khan-15s-birthday-reel.webm';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);

      setIsRecording(false);
      setIsPlaying(false);
      setStatusText('✅ Download complete! Saved to your device.');
    };

    startTimeRef.current = null;
    recorder.start();

    // Beat chimes
    playChime(523.25, 0.1, 0.5);
    playChime(659.25, 3.8, 0.5);
    playChime(783.99, 7.8, 0.5);
    playChime(1046.5, 11.5, 0.8);

    animRef.current = requestAnimationFrame(loop);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#07060a] text-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/people/shah-rukh-khan"
            className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1.5 transition-colors"
          >
            ← Back to Shah Rukh Khan Profile
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest bg-pink-500/20 text-pink-400 border border-pink-500/30 px-3 py-1 rounded-full">
            🔥 Today's Birthday Special
          </span>
        </div>

        {/* Title Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400">
            👑 Shah Rukh Khan 15s Birthday AI Reel
          </h1>
          <p className="text-sm md:text-base text-gray-400 mt-2">
            November 2 Mega Celebration • 9:16 Vertical Video Canvas & Production Blueprint
          </p>
        </div>

        {/* Studio Grid: Preview on Left/Top, Controls & Tools on Right/Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Canvas Preview Player */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-[300px] sm:w-[340px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-yellow-500/40 shadow-2xl shadow-pink-500/20 bg-black">
              <canvas
                ref={canvasRef}
                width={1080}
                height={1920}
                className="w-full h-full block"
              />
            </div>

            {/* Play & Record Buttons */}
            <div className="flex flex-col gap-2.5 w-[300px] sm:w-[340px] mt-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={togglePlay}
                  disabled={isRecording}
                  className="py-3 px-4 bg-gray-800/80 hover:bg-gray-700/80 border border-yellow-500/30 rounded-xl text-yellow-300 font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play Preview'}
                </button>
                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  className="py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 rounded-xl text-white font-bold text-sm shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2"
                >
                  {isRecording ? '⏳ Recording...' : '📥 Download Reel'}
                </button>
              </div>

              {/* Status Indicator */}
              <div className="text-center text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 py-2 px-3 rounded-lg flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {statusText}
              </div>
            </div>
          </div>

          {/* Reel Blueprint & AI Prompts */}
          <div className="md:col-span-7 space-y-6">
            {/* Storyboard Card */}
            <div className="bg-[#110f1c] border border-gray-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-yellow-300 flex items-center gap-2">
                  ⏱ 15-Second Viral Scene Timeline
                </h2>
                <span className="text-[11px] font-semibold text-gray-400 bg-gray-800/60 px-2.5 py-0.5 rounded-full">
                  100% Mobile Retention
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20">
                  <div className="flex items-center justify-between text-pink-400 font-bold mb-1">
                    <span>Scene 1: The Hook (0.0s - 3.8s)</span>
                    <span className="text-yellow-400">🔥 High Energy</span>
                  </div>
                  <p className="text-gray-300">
                    <strong>On-Screen:</strong> Golden Crown drops, SRK portrait appears with glowing aura ring, "SHAH RUKH KHAN TURNS 61 TODAY".
                  </p>
                  <p className="text-gray-400 mt-1 italic">
                    <strong>Urdu/Hindi Voiceover:</strong> "Duniya ka sab se bada badshah... Bollywood ka ek hi King Khan aaj apni 61st birthday mana raha hai!"
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20">
                  <div className="flex items-center justify-between text-yellow-400 font-bold mb-1">
                    <span>Scene 2: The Stature (3.8s - 7.8s)</span>
                    <span className="text-purple-300">💰 Global Icon</span>
                  </div>
                  <p className="text-gray-300">
                    <strong>On-Screen:</strong> 340,000+ Birthday Wishes Badge, $1+ Billion Net Worth, "Trending #1 Worldwide".
                  </p>
                  <p className="text-gray-400 mt-1 italic">
                    <strong>Urdu/Hindi Voiceover:</strong> "30 saal se cinema ka be-taaj badshah... 1 Billion Dollar net worth ke sath duniya ka sab se pyara superstar!"
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20">
                  <div className="flex items-center justify-between text-pink-400 font-bold mb-1">
                    <span>Scene 3: Historic Legacy (7.8s - 11.5s)</span>
                    <span className="text-pink-300">🎬 Blockbusters</span>
                  </div>
                  <p className="text-gray-300">
                    <strong>On-Screen:</strong> "FROM FAUJI TO KING", DDLJ • Devdas • Chak De • Jawan • Pathaan.
                  </p>
                  <p className="text-gray-400 mt-1 italic">
                    <strong>Urdu/Hindi Voiceover:</strong> "DDLJ aur Devdas se le kar Jawan aur Pathaan tak... King hamesha rule karta hai!"
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                    <span>Scene 4: Outro & Call to Action (11.5s - 15.0s)</span>
                    <span className="text-emerald-300">🚀 Viral CTA</span>
                  </div>
                  <p className="text-gray-300">
                    <strong>On-Screen:</strong> "Wish King Khan Today on BirthdayAura.com", glowing Birthday Aura brand logo.
                  </p>
                  <p className="text-gray-400 mt-1 italic">
                    <strong>Urdu/Hindi Voiceover:</strong> "Apna birthday wish comments mein likhein aur visit karein BirthdayAura.com!"
                  </p>
                </div>
              </div>
            </div>

            {/* AI Prompts Card for External Tools (CapCut / InVideo / Canva) */}
            <div className="bg-[#110f1c] border border-gray-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-yellow-300 flex items-center gap-2">
                  🤖 1-Click AI Generation Prompts
                </h2>
                <span className="text-[11px] font-semibold text-gray-400">CapCut • InVideo • Canva</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                Agar aap CapCut, InVideo AI ya kisi aur AI video tool mein generate karna chahein, yeh exact prompt copy karein:
              </p>

              <div className="relative bg-black/60 rounded-xl p-3 border border-gray-800 text-xs text-gray-300 font-mono">
                Create a high-energy 15-second vertical 9:16 Instagram Reel celebrating Shah Rukh Khan's birthday (November 2). Style: Luxurious, cinematic, glowing golden and ruby red aura lighting. Scene 1: Epic golden crown drops onto Shah Rukh Khan with kinetic text 'Shah Rukh Khan Turns 61 Today'. Scene 2: Fast-paced motion typography highlighting 340,000+ Birthday Wishes, $1 Billion net worth, and trending #1 worldwide. Scene 3: Film reel montage text featuring DDLJ, Devdas, Jawan, Pathaan. Scene 4: Celebratory golden confetti burst with call to action 'Wish King Khan on BirthdayAura.com'. Fast upbeat cinematic hip-hop/Bollywood beat with sub-bass drop.
              </div>

              <div className="mt-2.5 flex justify-end">
                <button
                  onClick={() =>
                    copyToClipboard(
                      "Create a high-energy 15-second vertical 9:16 Instagram Reel celebrating Shah Rukh Khan's birthday (November 2). Style: Luxurious, cinematic, glowing golden and ruby red aura lighting. Scene 1: Epic golden crown drops onto Shah Rukh Khan with kinetic text 'Shah Rukh Khan Turns 61 Today'. Scene 2: Fast-paced motion typography highlighting 340,000+ Birthday Wishes, $1 Billion net worth, and trending #1 worldwide. Scene 3: Film reel montage text featuring DDLJ, Devdas, Jawan, Pathaan. Scene 4: Celebratory golden confetti burst with call to action 'Wish King Khan on BirthdayAura.com'. Fast upbeat cinematic hip-hop/Bollywood beat with sub-bass drop.",
                      'prompt'
                    )
                  }
                  className="text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 px-3.5 py-1.5 rounded-lg font-semibold transition-colors"
                >
                  {copiedSection === 'prompt' ? '✓ Copied Prompt!' : '📋 Copy AI Video Prompt'}
                </button>
              </div>
            </div>

            {/* Ready-to-Post Social Caption & Hashtags */}
            <div className="bg-[#110f1c] border border-gray-800 rounded-2xl p-5 shadow-xl">
              <h2 className="text-base font-bold text-pink-400 mb-2">
                📱 Ready Instagram / Facebook Caption
              </h2>
              <div className="bg-black/60 rounded-xl p-3 border border-gray-800 text-xs text-gray-300 whitespace-pre-line">
                👑 Happy 61st Birthday to the undisputed Badshah of Bollywood, SHAH RUKH KHAN! From Fauji to reigning supreme over cinema for 30+ years, King Khan continues to inspire billions across the globe. ❤️🔥
                {'\n\n'}
                Drop your favorite SRK movie and birthday wish in the comments! 👇
                {'\n\n'}
                Celebrate his full birthday aura, net worth, and milestones on BirthdayAura.com ✨
                {'\n\n'}
                #ShahRukhKhan #HappyBirthdaySRK #KingKhan #SRKDay #BadshahOfBollywood #BirthdayAura #Bollywood #Jawan #Pathaan #SRK61
              </div>

              <div className="mt-2.5 flex justify-end">
                <button
                  onClick={() =>
                    copyToClipboard(
                      `👑 Happy 61st Birthday to the undisputed Badshah of Bollywood, SHAH RUKH KHAN! From Fauji to reigning supreme over cinema for 30+ years, King Khan continues to inspire billions across the globe. ❤️🔥\n\nDrop your favorite SRK movie and birthday wish in the comments! 👇\n\nCelebrate his full birthday aura, net worth, and milestones on BirthdayAura.com ✨\n\n#ShahRukhKhan #HappyBirthdaySRK #KingKhan #SRKDay #BadshahOfBollywood #BirthdayAura #Bollywood #Jawan #Pathaan #SRK61`,
                      'caption'
                    )
                  }
                  className="text-xs bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border border-pink-500/30 px-3.5 py-1.5 rounded-lg font-semibold transition-colors"
                >
                  {copiedSection === 'caption' ? '✓ Copied Caption!' : '📋 Copy Caption & Hashtags'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
