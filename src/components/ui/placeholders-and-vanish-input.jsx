import { useEffect, useRef, useState } from 'react';
import './placeholders-and-vanish-input.css';

export function PlaceholdersAndVanishInput({
  value,
  onChange,
  onSubmit,
  placeholders = [],
  disabled = false,
}) {
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState(
    placeholders[0] || ''
  );
  const [isFocused, setIsFocused] = useState(false);

  const animationStateRef = useRef({
    index: 0,
    charIndex: 0,
    deleting: false,
    timeoutId: null,
  });

  const clearAnimationTimeout = () => {
    if (animationStateRef.current.timeoutId) {
      clearTimeout(animationStateRef.current.timeoutId);
      animationStateRef.current.timeoutId = null;
    }
  };

  useEffect(() => {
    clearAnimationTimeout();

    if (!placeholders.length || value || isFocused) {
      setAnimatedPlaceholder('');
      animationStateRef.current = {
        index: 0,
        charIndex: 0,
        deleting: false,
        timeoutId: null,
      };
      return;
    }

    const runAnimation = () => {
      const { index, charIndex, deleting } = animationStateRef.current;
      const currentPlaceholder = placeholders[index] || '';

      let nextIndex = index;
      let nextCharIndex = charIndex;
      let nextDeleting = deleting;
      let delay = deleting ? 42 : 90;

      if (!nextDeleting) {
        if (nextCharIndex < currentPlaceholder.length) {
          nextCharIndex += 1;
        }

        if (nextCharIndex >= currentPlaceholder.length) {
          nextCharIndex = currentPlaceholder.length;
          nextDeleting = true;
          delay = 1500;
        }
      } else {
        if (nextCharIndex > 0) {
          nextCharIndex -= 1;
        }

        if (nextCharIndex <= 0) {
          nextDeleting = false;
          nextIndex = (nextIndex + 1) % placeholders.length;
          delay = 400;
        }
      }

      setAnimatedPlaceholder(currentPlaceholder.slice(0, nextCharIndex));

      animationStateRef.current = {
        index: nextIndex,
        charIndex: nextCharIndex,
        deleting: nextDeleting,
        timeoutId: setTimeout(runAnimation, delay),
      };
    };

    animationStateRef.current.timeoutId = setTimeout(runAnimation, 70);

    return clearAnimationTimeout;
  }, [placeholders, value, isFocused]);

  useEffect(() => clearAnimationTimeout, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!disabled && typeof onSubmit === 'function') {
      onSubmit();
    }
  };

  return (
    <form className="pvi-form" onSubmit={handleSubmit}>
      <div className="pvi-inputBox">
        <div className="rainbow-border-container">
          <input
            value={value}
            onChange={(event) => onChange?.(event.target.value, event)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
          />
          {!value && !isFocused && (
            <span className="pvi-placeholder" aria-hidden="true">
              {animatedPlaceholder}
            </span>
          )}
          <button
            type="submit"
            id="submit"
            className="pvi-submit"
            disabled={disabled}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
    </form>
  );
}

