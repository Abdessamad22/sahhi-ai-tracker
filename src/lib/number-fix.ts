// Additional number fixing utilities
import { toWesternNumerals } from './number-utils';

// Apply Western numerals to any number element
export function fixNumberDisplay() {
  // This function can be called to ensure all numbers are Western
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            // Fix any text content that contains Arabic-Indic numerals
            const walker = document.createTreeWalker(
              element,
              NodeFilter.SHOW_TEXT,
              null
            );
            
            let textNode = walker.nextNode();
            while (textNode) {
              if (textNode.textContent) {
                const fixed = toWesternNumerals(textNode.textContent);
                if (fixed !== textNode.textContent) {
                  textNode.textContent = fixed;
                }
              }
              textNode = walker.nextNode();
            }
          }
        });
      }
    });
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return observer;
}

// Force number elements to use Western numerals
export function forceWesternNumerals() {
  // Add class to all number inputs
  const numberInputs = document.querySelectorAll('input[type="number"]');
  numberInputs.forEach(input => {
    input.classList.add('western-numbers');
  });
  
  // Add class to elements that likely contain numbers
  const numberElements = document.querySelectorAll('.text-xl, .text-2xl, .text-3xl, .font-bold');
  numberElements.forEach(element => {
    if (/\d/.test(element.textContent || '')) {
      element.classList.add('western-numbers');
    }
  });
}