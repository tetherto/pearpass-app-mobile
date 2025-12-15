import { $, $$, browser } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import * as fs from 'node:fs';
import * as path from 'node:path';

declare global {
  interface Window {
  }
}

type DeviceType = 'Android' | 'iOS';
type SwipeDirection = 'left' | 'right' | 'up' | 'down';

interface ScreenSize {
  width: number;
  height: number;
}

interface SwipeCoordinates {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'screenshots');

export default abstract class BasePage {
  protected abstract selectors: Record<string, string>;

  protected readonly platform: DeviceType;
  protected readonly isAndroid: boolean;
  protected readonly isIOS: boolean;

  private readonly DEFAULT_TIMEOUT = 15_000;

  constructor() {
    this.platform = this.detectPlatform();
    this.isAndroid = this.platform === 'Android';
    this.isIOS = this.platform === 'iOS';
  }

  /* ==================== PLATFORM ==================== */
  private detectPlatform(): DeviceType {
    const platform = (process.env.PLATFORM || '').toLowerCase();

    if (platform === 'android') return 'Android';
    if (platform === 'ios') return 'iOS';

    throw new Error('ENV PLATFORM must be "android" or "ios"');
  }

  /* ==================== SELECTORS ==================== */
  protected $(name: string): ChainablePromiseElement {
    const selector = this.resolveSelector(name);
    return $(selector);
  }

  protected get $$() {
    return (name: string) => {
      return $$(this.resolveSelector(name));
    };
  }

  private resolveSelector(name: string): string {
    const platformKey = `${name}${this.platform}`;
    const selector = this.selectors[platformKey] ?? this.selectors[name];

    if (!selector) {
      throw new Error(
        `Selector not found!\n` +
          `  Key: "${name}" (tried "${platformKey}" and "${name}")\n` +
          `  Platform: ${this.platform}\n` +
          `  Available keys: ${Object.keys(this.selectors).join(', ')}`
      );
    }
    return selector;
  }

  /* ==================== CHAIN HELPER ==================== */
  /** Use in child classes to easily return this after async operations */
  protected async chain<T extends BasePage>(fn: () => Promise<void>): Promise<T> {
    await fn();
    return this as unknown as T;
  }

  protected get self(): this {
    return this;
  }

  /* ==================== WAITING ==================== */
  async waitForDisplayed(name: string, timeout = this.DEFAULT_TIMEOUT): Promise<this> {
    const selector = this.resolveSelector(name);
    await $(selector).waitForDisplayed({
      timeout,
      timeoutMsg: `Element "${name}" is not displayed after ${timeout}ms\nSelector: ${selector}`,
    });
    return this;
  }

  async waitForExist(name: string, timeout = this.DEFAULT_TIMEOUT): Promise<this> {
    const selector = this.resolveSelector(name);
    await $(selector).waitForExist({
      timeout,
      timeoutMsg: `Element "${name}" does not exist after ${timeout}ms\nSelector: ${selector}`,
    });
    return this;
  }

  /* ==================== GETTERS ==================== */
  async getElement(name: string, timeout?: number): Promise<ChainablePromiseElement> {
    await this.waitForDisplayed(name, timeout ?? this.DEFAULT_TIMEOUT);
    return this.$(name);
  }

  protected raw(name: string): ChainablePromiseElement {
    return this.$(name);
  }

  async getText(name: string): Promise<string> {
    const el = await this.getElement(name);
    return (await el.getText()) || '';
  }

  async getAttribute(name: string, attr: string): Promise<string | null> {
    const el = await this.getElement(name);
    return el.getAttribute(attr);
  }

  /* ==================== SCREENSHOTS ==================== */
  private ensureScreenshotDir(): void {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  }

  private async takeScreenshot(prefix: string, name: string): Promise<string> {
    this.ensureScreenshotDir();
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${prefix}_${this.constructor.name}_${safeName}_${Date.now()}.png`;
    const fullPath = path.join(SCREENSHOT_DIR, filename);
    await browser.saveScreenshot(fullPath);
    return fullPath;
  }

  /* ==================== CHECKS WITH ERRORS ==================== */
  async expectText(
    name: string,
    expected: string,
    options: { exact?: boolean; context?: string } = {}
  ): Promise<this> {
    const { exact = true, context = '' } = options;

    let actual = '';
    let selector = '';

    try {
      selector = this.resolveSelector(name);
      const el = $(selector);
      await el.waitForDisplayed({ timeout: 8_000 });
      actual = await el.getText();
    } catch {
      actual = '<element not visible or not found>';
    }

    const normalize = (v: string) => v.trim();
    const matcher = exact
      ? (a: string, b: string) => normalize(a) === normalize(b)
      : (a: string, b: string) => normalize(a).includes(normalize(b));

    if (matcher(actual, expected)) {
      return this;
    }

    const screenshotPath = await this.takeScreenshot('FAIL_text', name);

    const errorMsg = [
      `TEXT MISMATCH`,
      `Element: "${name}"`,
      `Platform: ${this.platform}`,
      selector && `Selector: ${selector}`,
      `Expected${exact ? '' : ' (contains)'}: "${expected}"`,
      `Actual:   "${actual}"`,
      context && `Context: ${context}`,
      '',
      `Fix the locator or update the expected text!`,
      `Screenshot → ${screenshotPath}`,
    ]
      .filter(Boolean)
      .join('\n   ');

    throw new Error(errorMsg);
  }

  async expectDisplayed(
    name: string,
    shouldBe = true,
    context = '',
    timeout = this.DEFAULT_TIMEOUT
  ): Promise<this> {
    let selector = '';
    let isDisplayed = false;

    try {
      selector = this.resolveSelector(name);
      const el = $(selector);

      if (shouldBe) {
        await el.waitForDisplayed({ timeout });
        isDisplayed = true;
      } else {
        await el.waitForDisplayed({ timeout, reverse: true });
        isDisplayed = false;
      }
    } catch {
      isDisplayed = !shouldBe;
    }

    if (isDisplayed === shouldBe) return this;

    const action = shouldBe ? 'be displayed' : 'NOT be displayed';
    const screenshotPath = await this.takeScreenshot('FAIL_visibility', name);

    const errorMsg = [
      `VISIBILITY CHECK FAILED`,
      `Element: "${name}"`,
      `Should ${action}`,
      `Platform: ${this.platform}`,
      selector && `Selector: ${selector}`,
      context && `Context: ${context}`,
      `Screenshot → ${screenshotPath}`,
    ]
      .filter(Boolean)
      .join('\n   ');

    throw new Error(errorMsg);
  }

  async expectEnabled(name: string, shouldBe = true): Promise<this> {
    const el = await this.getElement(name);
    const isEnabled = await el.isEnabled();

    if (isEnabled === shouldBe) return this;

    throw new Error(
      `ENABLED CHECK FAILED\n` +
        `   Element: "${name}"\n` +
        `   Expected enabled: ${shouldBe}\n` +
        `   Actual: ${isEnabled}\n` +
        `   Selector: ${this.resolveSelector(name)}`
    );
  }

  async expectClickable(name: string, shouldBe = true): Promise<this> {
    const el = await this.getElement(name);
    const isClickable = await el.isClickable();

    if (isClickable === shouldBe) return this;

    throw new Error(
      `CLICKABLE CHECK FAILED\n` +
        `   Element: "${name}"\n` +
        `   Expected clickable: ${shouldBe}\n` +
        `   Actual: ${isClickable}\n` +
        `   Selector: ${this.resolveSelector(name)}`
    );
  }

  /* ==================== ACTIONS ==================== */
  async tap(name: string): Promise<this> {
    const el = await this.getElement(name);
    await el.click();
    return this;
  }

  async type(name: string, text: string): Promise<this> {
    const el = await this.getElement(name);
    await el.click();
    await el.clearValue();
    await el.addValue(text);
    return this;
  }

  /* ==================== GESTURES ==================== */
  async swipe(direction: SwipeDirection, percent = 0.7): Promise<this> {
    const size = (await browser.getWindowSize()) as ScreenSize;

    const verticalPadding = 0.1;
    const horizontalPadding = 0.1;

    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));

    percent = clamp(percent, 0.1, 0.9);

    const coordsMap: Record<SwipeDirection, SwipeCoordinates> = {
      left: {
        startX: size.width * (1 - horizontalPadding),
        startY: size.height * 0.5,
        endX: size.width * (1 - horizontalPadding - percent),
        endY: size.height * 0.5,
      },
      right: {
        startX: size.width * horizontalPadding,
        startY: size.height * 0.5,
        endX: size.width * (horizontalPadding + percent),
        endY: size.height * 0.5,
      },
      up: {
        startX: size.width * 0.5,
        startY: size.height * (1 - verticalPadding),
        endX: size.width * 0.5,
        endY: size.height * (1 - verticalPadding - percent),
      },
      down: {
        startX: size.width * 0.5,
        startY: size.height * verticalPadding,
        endX: size.width * 0.5,
        endY: size.height * (verticalPadding + percent),
      },
    };

    const { startX, startY, endX, endY } = coordsMap[direction];

    if (this.isAndroid) {
      await browser.performActions([
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: Math.round(startX), y: Math.round(startY) },
            { type: 'pointerDown' },
            { type: 'pause', duration: 100 },
            { type: 'pointerMove', duration: 600, x: Math.round(endX), y: Math.round(endY) },
            { type: 'pointerUp' },
          ],
        },
      ]);
    } else {
      await browser.execute('mobile: swipe', {
        direction,
      });
    }
    return this;
  }
}