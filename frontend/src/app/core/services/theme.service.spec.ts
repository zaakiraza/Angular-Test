import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { THEME_STORAGE_KEY, ThemeService } from './theme.service';

/** jsdom does not implement matchMedia, so tests install a stub that reports the OS preference. */
function setOsPrefersDark(prefersDark: boolean | null): void {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value:
      prefersDark === null
        ? undefined
        : (query: string) => ({ matches: prefersDark, media: query }),
  });
}

function createService(): ThemeService {
  TestBed.resetTestingModule();
  return TestBed.inject(ThemeService);
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    setOsPrefersDark(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    setOsPrefersDark(null);
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('falls back to light when nothing is stored and no OS preference is available', () => {
    setOsPrefersDark(null);

    const service = createService();

    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('follows the OS dark preference on first visit when nothing is stored', () => {
    setOsPrefersDark(true);

    const service = createService();

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('does not write to storage just because the page loaded', () => {
    setOsPrefersDark(true);

    createService();

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('restores the stored choice over the OS preference', () => {
    setOsPrefersDark(true);
    localStorage.setItem(THEME_STORAGE_KEY, 'light');

    const service = createService();

    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('ignores an unrecognised stored value and falls back to the OS preference', () => {
    setOsPrefersDark(true);
    localStorage.setItem(THEME_STORAGE_KEY, 'purple');

    const service = createService();

    expect(service.theme()).toBe('dark');
  });

  it('toggles between light and dark, applies it to <html> and persists it', () => {
    const service = createService();

    service.toggle();

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

    service.toggle();

    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('keeps the chosen theme across a new service instance (simulated reload)', () => {
    setOsPrefersDark(false);
    createService().toggle();

    setOsPrefersDark(false);
    const reloaded = createService();

    expect(reloaded.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('keeps working when storage access is blocked', () => {
    setOsPrefersDark(false);
    const service = createService();
    const blocked = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(blocked);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(blocked);

    expect(() => service.toggle()).not.toThrow();
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
