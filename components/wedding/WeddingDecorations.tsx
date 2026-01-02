
import React from 'react';
import { getDriveMediaUrl } from '../../constants';

interface DecorationProps {
  assets: any;
}

export const FloralSideDecoration = ({ side, top, assets }: { side: 'left' | 'right', top: string, assets: any }) => {
  const isLeft = side === 'left';
  return (
    <div 
      className={`absolute z-20 w-32 h-32 md:w-40 md:h-40 pointer-events-none select-none ${isLeft ? '-left-16' : '-right-16'} transition-all`}
      style={{ top }}
    >
      <img 
        src={getDriveMediaUrl(assets.floralSide || assets.floralCorner)} 
        alt="floral-side" 
        className={`w-full h-full object-contain opacity-80 drop-shadow-lg origin-base ${isLeft ? 'rotate-[90deg]' : '-rotate-[90deg] scale-x-[-1]'} animate-floral-sway-gentle`}
      />
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

  return (
    <div className={`absolute pointer-events-none select-none z-30 w-56 h-56 md:w-72 md:h-72 ${styles[position]}`}>
      {/* BACK LAYER */}
      <div className="absolute inset-0 transform scale-[1.3] scale-x-[-1] opacity-20 blur-[1px]">
          <img 
            src={getDriveMediaUrl(assets.floralCornerBack || assets.floralCorner)} 
            alt="floral-back" 
            className="w-full h-full object-contain origin-base animate-floral-sway-gentle rotate-[15deg] translate-x-4 translate-y-4" 
          />
      </div>
      
      {/* MID LAYER */}
      <div className="absolute inset-0 transform scale-[1.15] opacity-40">
          <img 
            src={getDriveMediaUrl(assets.floralCornerMid || assets.floralCorner)} 
            alt="floral-mid" 
            className="w-full h-full object-contain origin-base animate-floral-sway-gentle -rotate-[8deg] translate-x-2 translate-y-2" 
            style={{ animationDelay: '-1.5s' }}
          />
      </div>

      {/* FRONT LAYER */}
      <div className="absolute inset-0 opacity-100 drop-shadow-xl">
          <img 
            src={getDriveMediaUrl(assets.floralCorner)} 
            alt="floral-front" 
            className="w-full h-full object-contain origin-base animate-floral-sway" 
          />
      </div>
    </div>
  );
};
