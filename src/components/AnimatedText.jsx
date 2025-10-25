import { useEffect, useState } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const AnimatedText = ({ 
  text, 
  className = '', 
  delay = 0, 
  staggerDelay = 0.1,
  animationDuration = 0.8 
}) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  const [animatedWords, setAnimatedWords] = useState([]);

  useEffect(() => {
    if (isIntersecting) {
      const words = text.split(' ');
      const animatedWordsArray = words.map((word, index) => ({
        word,
        delay: delay + (index * staggerDelay),
        id: index
      }));
      setAnimatedWords(animatedWordsArray);
    }
  }, [isIntersecting, text, delay, staggerDelay]);

  return (
    <div ref={ref} className={`${className} relative`}>
      {animatedWords.map(({ word, delay: wordDelay, id }) => (
        <span
          key={id}
          className="text-word"
          style={{
            animation: isIntersecting 
              ? `textIn ${animationDuration}s ease-out ${wordDelay}s forwards` 
              : 'none'
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default AnimatedText;
