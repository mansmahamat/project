import { useState } from 'react';

export const useRandomPaywall = () => {
  const [shouldShowPaywall, setShouldShowPaywall] = useState(false);

  return {
    shouldShowPaywall,
    setShouldShowPaywall
  };
}; 