import React,{useEffect, useRef} from 'react'


const AlwaysScrollToBottom = () => {
    const elementRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
      const node = elementRef.current;
      node?.scrollIntoView()
    });
    return <div ref={elementRef} />;
  };

  export default AlwaysScrollToBottom;

