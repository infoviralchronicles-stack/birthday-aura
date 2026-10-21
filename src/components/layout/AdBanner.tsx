import React from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'rectangle' | 'sidebar' | 'banner';
  className?: string;
  label?: string;
}

export default function AdBanner({
  slot = '1234567890',
  format = 'horizontal',
  className = '',
  label = 'Advertisement'
}: AdBannerProps) {
  // Hide placeholder boxes completely unless explicitly configured with live Google ads
  return null;
}
