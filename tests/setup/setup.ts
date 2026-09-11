import { beforeAll, afterEach, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

const domHtml = fs.readFileSync(path.resolve(__dirname, 'dom.html'), 'utf8');

beforeEach(() => {
  document.body.innerHTML = domHtml;
});

afterEach(() => {
  window.localStorage.clear();
});
