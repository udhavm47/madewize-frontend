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
    // Process text regardless of intersection state
    // Split by newlines first, then by spaces within each line
    const lines = text.split('\n');
    const animatedWordsArray = [];
    lines.forEach((line, lineIndex) => {
      const words = line.split(' ').filter(word => word.length > 0);
      words.forEach((word, wordIndex) => {
        animatedWordsArray.push({
          word,
          isNewline: false,
          delay: delay + (animatedWordsArray.length * staggerDelay),
          id: animatedWordsArray.length
        });
      });
      // Add newline after each line except the last one
      if (lineIndex < lines.length - 1) {
        animatedWordsArray.push({
          word: '\n',
          isNewline: true,
          delay: delay + (animatedWordsArray.length * staggerDelay),
          id: animatedWordsArray.length
        });
      }
    });
    setAnimatedWords(animatedWordsArray);
  }, [text, delay, staggerDelay, isIntersecting]);

  return (
    <div ref={ref} className={`${className} relative`}>
      {animatedWords.map(({ word, isNewline, delay: wordDelay, id }) => {
        if (isNewline) {
          return <br key={id} />;
        }
        return (
          <span
            key={id}
            className="text-word"
            style={{
              animation: isIntersecting 
                ? `textIn ${animationDuration}s ease-out ${wordDelay}s forwards` 
                : 'none'
            }}
          >
            {word}{' '}
          </span>
        );
      })}
    </div>
  );
};

export default AnimatedText;
