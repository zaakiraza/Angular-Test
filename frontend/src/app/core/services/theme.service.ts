import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'todo-theme';

/**
 * Owns the light/dark theme. The active theme is exposed as the `data-theme` attribute on <html>,
 * which the CSS custom properties in styles.css key off. The choice is persisted in localStorage
 * only. Without a stored choice, the OS/browser colour-scheme preference is used (fallback: light).
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly theme = signal<Theme>(this.readInitialTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  toggle(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.applyTheme(theme);
    this.storeTheme(theme);
  }

  private readInitialTheme(): Theme {
    return this.readStoredTheme() ?? (this.prefersDark() ? 'dark' : 'light');
  }

  private readStoredTheme(): Theme | null {
    try {
      const value = this.document.defaultView?.localStorage.getItem(THEME_STORAGE_KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      // Storage can be unavailable (privacy modes, blocked cookies); fall back to the OS preference.
      return null;
    }
  }

  private storeTheme(theme: Theme): void {
    try {
      this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore: the theme still applies for this page view.
    }
  }

  private prefersDark(): boolean {
    const query = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    return query?.matches ?? false;
  }

  private applyTheme(theme: Theme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}
