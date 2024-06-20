/**
 * Code taken from
 * https://dana-scheider.medium.com/troubleshooting-dom-leakage-between-tests-with-react-testing-library-a7c5343bb614
 *
 * Updated default url from localhost:3000 to localhost:5173
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { type ReactElement } from 'react'; // Only required if using TypeScript
import { JSDOM } from 'jsdom';
import { render as originalRender } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Global type declarations, can be skipped if not using TypeScript
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace NodeJS {
    interface Global {
      document: Document;
      window: Window;
    }
  }
}

// Helper function to copy properties from window to global
function copyProps(src: Window, target: NodeJS.Global & typeof globalThis) {
  const props: PropertyDescriptorMap = {};

  Object.getOwnPropertyNames(src)
    .concat(Object.getOwnPropertySymbols(src) as any) // Handle symbols as well
    .forEach((prop) => {
      const descriptor = Object.getOwnPropertyDescriptor(src, prop);
      // Check if descriptor exists and if the property does not exist in target
      if (
        descriptor &&
        typeof target[prop as keyof typeof globalThis] === 'undefined'
      ) {
        // Safely cast prop to any to satisfy TypeScript's strict type checks for indexing
        props[prop as any] = descriptor;
      }
    });

  Object.defineProperties(target, props);
}

// Function to create a new DOM with JSDOM and use it as the source
// of global `window` and `document` objects
const setDom = () => {
  // Note that you can set the empty object to any options you would like
  // for your JSDOM instance. You could also make it configurable by allowing
  // the options to be passed in as an argument to the `setDom` function.
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost:5173',
  });

  // The `as` and anything after it can be omitted if you aren't using
  // TypeScript.
  global.window = dom.window as unknown as Window & typeof globalThis;
  global.document = dom.window.document;

  // Configure globals that are not handled by jsdom itself
  global.navigator = {
    ...global.window.navigator,
    userAgent: 'node.js',
  };

  // Mock window.matchMedia
  Object.defineProperty(global.window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Copy all the properties of the default view (window) to global
  copyProps(window, global);
};

// If not using TypeScript, you can just use `(ui) => {`. If you'd like to
// include render options to pass through, you could give this function a
// second optional 'options' argument.
const render = (ui: ReactElement) => {
  setDom();

  return originalRender(ui);
};

// Clean up after each test to remove any data appended to the body
afterEach(() => {
  document.body.innerHTML = '';
});

export default render;
