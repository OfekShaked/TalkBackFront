import React, { useEffect, useRef } from 'react'
import { handleError } from '../services/errorHandling.service';

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    try {
      const node = elementRef.current;
      node?.scrollIntoView()
    } catch (error) {
      handleError(error);
    }

  });
  return <div ref={elementRef} />;
};

export default AlwaysScrollToBottom;

