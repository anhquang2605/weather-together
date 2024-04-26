import { useMemo, useState } from 'react';

export default function useFlexState() {
  const [isFlexed, setIsFlexed] = useState(false);
  const toggleFlex = (flex:boolean) => {
      setIsFlexed(flex)
  };
  const memorizedIsFlexed = useMemo(()=>{
    return isFlexed;
  },[isFlexed])
  return { toggleFlex, memorizedIsFlexed };
}