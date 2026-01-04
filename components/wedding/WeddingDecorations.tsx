
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
  const imgTopLeft = getDriveMediaUrl(assets.heroFloralTopLeft || assets.floralCorner);
  const imgTopRight = getDriveMediaUrl(assets.heroFloralTopRight || assets.floralCornerMid || assets.floralCorner);
  const imgBottomLeft = getDriveMediaUrl(assets.heroFloralBottomLeft || assets.floralSide || assets.floralCorner);
  const imgBottomRight = getDriveMediaUrl(assets.heroFloralBottomRight || assets.floralCorner);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-visible">
      {/* Cluster Atas Kiri Frame - Reduced size */}
      <div className="absolute top-2 left-2 -translate-x-1/3 -translate-y-1/3 w-28 h-28 opacity-90">
        <img 
          src={imgTopLeft} 
          className="w-full h-full object-contain rotate-[75deg] animate-floral-sway-gentle origin-base" 
        />
      </div>
      {/* Cluster Atas Kanan Frame - Reduced size */}
      <div className="absolute top-2 right-2 translate-x-1/3 -translate-y-1/3 w-24 h-24 opacity-80">
        <img 
          src={imgTopRight} 
          className="w-full h-full object-contain scale-x-[-1] rotate-[-75deg] origin-base" 
        />
      </div>
      {/* Cluster Bawah Kiri Frame - Reduced size */}
      <div className="absolute bottom-6 -left-8 w-32 h-32 opacity-100">
        <img 
          src={imgBottomLeft} 
          className="w-full h-full object-contain rotate-[60deg] animate-floral-sway origin-base" 
        />
      </div>
      {/* Cluster Bawah Kanan Frame - Reduced size */}
      <div className="absolute bottom-8 -right-8 w-36 h-36 opacity-100">
        <img 
          src={imgBottomRight} 
          className="w-full h-full object-contain scale-x-[-1] scale-y-[-1] rotate-[65deg] animate-floral-sway-gentle origin-base" 
          style={{ animationDelay: '-2s' }}
        />
      </div>
    </div>
  );
};

export const FloralCorner = ({ position, assets }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', assets: any }) => {
  const styles: Record<string, string> = { 
    'top-left': '-top-8 -left-8', 
    'top-right': '-top-8 -right-8 scale-x-[-1]', 
    'bottom-left': '-bottom-8 -left-8 scale-y-[-1]', 
    'bottom-right': '-bottom-8 -right-8 scale-x-[-1] scale-y-[-1]' 
  };

  const imgBack = getDriveMediaUrl(assets.floralCornerBack || assets.floralCorner);
  const imgMid = getDriveMediaUrl(assets.floralCornerMid || assets.floralCorner);
  const imgFront = getDriveMediaUrl(assets.floralCorner);

  // Reduced container size from w-56/72 to w-32/48
  return (
    <div className={`absolute pointer-events-none select-none z-30 w-32 h-32 md:w-48 md:h-48 ${styles[position]}`}>
      <div className="absolute inset-0 transform scale-[1.3] scale-x-[-1] origin-base opacity-30 blur-[0.5px]">
          <img 
            src={imgBack} 
            alt="floral-back" 
            className="w-full h-full object-contain origin-base animate-floral-sway-gentle rotate-[15deg] translate-x-2 translate-y-2" 
          />
      </div>
      <div className="absolute inset-0 transform scale-[1.15] origin-base opacity-60">
          <img 
            src={imgMid} 
            alt="floral-mid" 
            className="w-full h-full object-contain origin-base animate-floral-sway-gentle -rotate-[8deg] translate-x-1 translate-y-1" 
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
