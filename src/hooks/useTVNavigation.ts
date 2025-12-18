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
        const firstFocusable = document.querySelector('a, button, [tabindex="0"]') as HTMLElement;
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
        document.querySelectorAll('a, button, [tabindex="0"]')
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
        let distance = 0;

        // Spatial navigation logic: prioritize elements in the direction, then distance
        if (key === 'ArrowRight' && dx > 0) {
          isCorrectDirection = Math.abs(dy) < Math.abs(dx);
          distance = Math.sqrt(dx * dx + dy * dy * 2); // Penalize vertical deviation
        } else if (key === 'ArrowLeft' && dx < 0) {
          isCorrectDirection = Math.abs(dy) < Math.abs(dx);
          distance = Math.sqrt(dx * dx + dy * dy * 2);
        } else if (key === 'ArrowDown' && dy > 0) {
          isCorrectDirection = Math.abs(dx) < Math.abs(dy);
          distance = Math.sqrt(dy * dy + dx * dx * 2); // Penalize horizontal deviation
        } else if (key === 'ArrowUp' && dy < 0) {
          isCorrectDirection = Math.abs(dx) < Math.abs(dy);
          distance = Math.sqrt(dy * dy + dx * dx * 2);
        }

        if (isCorrectDirection && distance < minDistance) {
          minDistance = distance;
          bestElement = el;
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
