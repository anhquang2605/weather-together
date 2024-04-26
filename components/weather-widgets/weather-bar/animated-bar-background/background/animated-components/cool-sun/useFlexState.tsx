import { useState } from 'react';

export default function useFlexState() {
  const [isFlexed, setIsFlexed] = useState(false);
    const toggleFlex = (flex:boolean) => {
        setIsFlexed(flex)
    };
  return { toggleFlex };
}