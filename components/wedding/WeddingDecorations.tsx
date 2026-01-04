
import React from 'react';
import { getDriveMediaUrl } from '../../constants';

interface DecorationProps {
  assets: any;
}

export const FloralSideDecoration = ({ side, top, assets }: { side: 'left' | 'right', top: string, assets: any }) => {
  const isLeft = side === 'left';
  const imgUrl = getDriveMediaUrl(assets.floralSide || assets.floralCorner);
  
  return (
    <div 
      className={`absolute z-20 w-32 h-32 md:w-40 md:h-40 pointer-events-none select-none transition-all ${
        isLeft ? '-left-16' : '-right-16 scale-x-[-1]'
      }`}
      style={{ top }}
    >
      <img 
        src={imgUrl} 
        alt="floral-side" 
        className="w-full h-full object-contain opacity-80 drop-shadow-lg origin-base rotate-[90deg] animate-floral-sway-gentle"
      />
    </div>
  );
};

export const HeroFloralBackdrop = ({ assets }: { assets: any }) => {
  const cornerImg = getDriveMediaUrl(assets.floralCorner);
  const cornerMidImg = getDriveMediaUrl(assets.floralCornerMid || assets.floralCorner);
  const sideImg = getDriveMediaUrl(assets.floralSide || assets.floralCorner);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-visible">
      {/* Cluster Atas Kiri Frame */}
      <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/4 w-40 h-40 opacity-90">
        <img 
          src={cornerImg} 
          className="w-full h-full object-contain rotate-[-15deg] animate-floral-sway-gentle" 
        />
      </div>
      {/* Cluster Atas Kanan Frame */}
      <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-36 h-36 opacity-70">
        <img 
          src={cornerMidImg} 
          className="w-full h-full object-contain scale-x-[-1] rotate-[10deg]" 
        />
      </div>
      {/* Cluster Bawah Kiri Frame */}
      <div className="absolute bottom-4 -left-12 w-44 h-44 opacity-100">
        <img 
          src={sideImg} 
          className="w-full h-full object-contain rotate-[-30deg] animate-floral-sway" 
        />
      </div>
      {/* Cluster Bawah Kanan Frame */}
      <div className="absolute bottom-10 -right-12 w-48 h-48 opacity-100">
        <img 
          src={cornerImg} 
          className="w-full h-full object-contain scale-x-[-1] scale-y-[-1] rotate-[-15deg] animate-floral-sway-gentle" 
          style={{ animationDelay: '-2s' }}
        />
      </div>
    </div>
  );
};

export const FloralCorner = ({ position, assets }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', assets: any }) => {
  const styles: Record<string, string> = { 
    'top-left': '-top-12 -left-12', 
    'top-right': '-top-12 -right-12 scale-x-[-1]', 
    'bottom-left': '-bottom-12 -left-12 scale-y-[-1]', 
    'bottom-right': '-bottom-12 -right-12 scale-x-[-1] scale-y-[-1]' 
  };

  const imgBack = getDriveMediaUrl(assets.floralCornerBack || assets.floralCorner);
  const imgMid = getDriveMediaUrl(assets.floralCornerMid || assets.floralCorner);
  const imgFront = getDriveMediaUrl(assets.floralCorner);

  return (
    <div className={`absolute pointer-events-none select-none z-30 w-56 h-56 md:w-72 md:h-72 ${styles[position]}`}>
      <div className="absolute inset-0 transform scale-[1.3] scale-x-[-1] origin-base opacity-30 blur-[0.5px]">
          <img 
            src={imgBack} 
            alt="floral-back" 
            className="w-full h-full object-contain origin-base animate-floral-sway-gentle rotate-[15deg] translate-x-4 translate-y-4" 
          />
      </div>
      <div className="absolute inset-0 transform scale-[1.15] origin-base opacity-60">
          <img 
            src={imgMid} 
            alt="floral-mid" 
            className="w-full h-full object-contain origin-base animate-floral-sway-gentle -rotate-[8deg] translate-x-2 translate-y-2" 
            style={{ animationDelay: '-1.5s' }}
          />
      </div>
      <div className="absolute inset-0 opacity-100 drop-shadow-xl origin-base">
          <img 
            src={imgFront} 
            alt="floral-front" 
            className="w-full h-full object-contain origin-base animate-floral-sway" 
          />
      </div>
    </div>
  );
};
