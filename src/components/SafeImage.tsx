import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  loading?: 'eager' | 'lazy';
  fallbackTitle?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  loading = 'lazy',
  fallbackTitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#1C1A19] via-[#141211] to-[#0B0B0D] border border-white/10 p-6 text-center ${containerClassName}`}
        role="img"
        aria-label={alt}
      >
        <Sparkles className="w-6 h-6 text-[#AE553C] mb-2 opacity-80" aria-hidden="true" />
        <span className="text-xs font-medium text-[#A9A19A] max-w-[20ch]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
