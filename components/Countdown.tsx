
import React, { useState, useEffect } from 'react';
import { CountdownTime } from '../types';

interface CountdownProps {
  targetDate: string;
}

// Fix: Use targetDate from props instead of non-existent WEDDING_DATE constant
const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const weddingDateObj = new Date(targetDate);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDateObj.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const Box = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-blue-900 text-white rounded-xl p-3 w-20 shadow-md">
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center gap-2 md:gap-4 my-8">
      <Box value={timeLeft.days} label="Hari" />
      <Box value={timeLeft.hours} label="Jam" />
      <Box value={timeLeft.minutes} label="Menit" />
      <Box value={timeLeft.seconds} label="Detik" />
    </div>
  );
};

export default Countdown;
