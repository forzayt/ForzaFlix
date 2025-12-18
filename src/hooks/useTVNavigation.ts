import { useEffect } from 'react';

export const useTVNavigation = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      
      const { key } = e;
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(key)) return;

      const currentFocus = document.activeElement as HTMLElement;
      
      // If nothing is focused, focus the first focusable element
      if (!currentFocus || currentFocus === document.body) {
        const firstFocusable = document.querySelector('a, button, input, select, [tabindex="0"]') as HTMLElement;
        if (firstFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
        return;
      }

      if (key === 'Enter') {
        currentFocus.click();
        return;
      }

      e.preventDefault();

      const focusableElements = Array.from(
        document.querySelectorAll('a, button, input, select, [tabindex="0"]')
      ).filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }) as HTMLElement[];

      const currentRect = currentFocus.getBoundingClientRect();
      const currentCenter = {
        x: currentRect.left + currentRect.width / 2,
        y: currentRect.top + currentRect.height / 2,
      };

      let bestElement: HTMLElement | null = null;
      let minDistance = Infinity;

      focusableElements.forEach((el) => {
        if (el === currentFocus) return;

        const rect = el.getBoundingClientRect();
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };

        const dx = center.x - currentCenter.x;
        const dy = center.y - currentCenter.y;

        let isCorrectDirection = false;
        
        // Loosen the direction check to allow for horizontal/vertical offsets
        // and use a more robust distance scoring system
        if (key === 'ArrowRight' && dx > 0) {
          isCorrectDirection = dx > Math.abs(dy) * 0.5;
        } else if (key === 'ArrowLeft' && dx < 0) {
          isCorrectDirection = Math.abs(dx) > Math.abs(dy) * 0.5;
        } else if (key === 'ArrowDown' && dy > 0) {
          isCorrectDirection = dy > Math.abs(dx) * 0.3; // Be even more forgiving for vertical movement
        } else if (key === 'ArrowUp' && dy < 0) {
          isCorrectDirection = Math.abs(dy) > Math.abs(dx) * 0.3; // Help reach the navbar even if offset
        }

        if (isCorrectDirection) {
          // Calculate distance with a heavy penalty for the non-primary axis
          // This ensures we prefer items directly in line, but can still move diagonally
          let distance = 0;
          if (key === 'ArrowLeft' || key === 'ArrowRight') {
            distance = Math.sqrt(dx * dx + (dy * dy * 4));
          } else {
            distance = Math.sqrt((dx * dx * 2) + dy * dy);
          }

          if (distance < minDistance) {
            minDistance = distance;
            bestElement = el;
          }
        }
      });

      if (bestElement) {
        (bestElement as HTMLElement).focus();
        // Ensure the focused element is scrolled into view
        (bestElement as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
