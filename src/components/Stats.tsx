import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface StatItemProps {
  number: number;
  label: string;
  suffix?: string;
  delay?: number;
}

const StatItem: React.FC<StatItemProps> = ({ number, label, suffix = '+', delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      let startTime = 0;
      const duration = 2000;

      const animate = (currentTime: number) => {
        if (startTime === 0) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(number * easeOut));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, number, delay]);

  return (
    <div
      ref={ref}
      className="bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105"
    >
      <div className="text-center">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mb-1 sm:mb-2">
          {count}{suffix}
        </div>
        <div className="text-white text-xs sm:text-sm md:text-base leading-tight">{label}</div>
      </div>
    </div>
  );
};

const Stats: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { number: 50, label: t('stats.projects'), delay: 0 },
    { number: 30, label: t('stats.clients'), delay: 200 },
    { number: 15, label: t('stats.solutions'), delay: 400 },
    { number: 5, label: t('stats.experience'), delay: 600 }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              number={stat.number}
              label={stat.label}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;