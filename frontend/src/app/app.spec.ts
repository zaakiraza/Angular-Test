import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { of } from 'rxjs';
import { App } from './app';
import { TaskApiService } from './core/services/task-api.service';
import { THEME_STORAGE_KEY } from './core/services/theme.service';

describe('App theme toggle', () => {
  let fixture: ComponentFixture<App>;

  const toggleButton = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('.theme-toggle') as HTMLButtonElement;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: undefined,
    });
    TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: TaskApiService, useValue: { getTasks: () => of([]) } }],
    });
  });

  function create(): void {
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  }

  it('renders the toggle as the first element of the shell, labelled with the action', () => {
    create();

    const first = fixture.nativeElement.firstElementChild as HTMLElement;
    expect(first.classList).toContain('theme-toggle');
    expect(toggleButton().getAttribute('aria-label')).toBe('Switch to dark theme');
    expect(toggleButton().type).toBe('button');
  });

  it('switches to dark on activation, without reloading, and persists the choice', () => {
    create();

    toggleButton().click();
    fixture.detectChanges();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(toggleButton().getAttribute('aria-label')).toBe('Switch to light theme');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('switches back to light on a second activation', () => {
    create();

    toggleButton().click();
    fixture.detectChanges();
    toggleButton().click();
    fixture.detectChanges();

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(toggleButton().getAttribute('aria-label')).toBe('Switch to dark theme');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('starts in the stored theme and labels the button accordingly', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');

    create();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(toggleButton().getAttribute('aria-label')).toBe('Switch to light theme');
  });
});
