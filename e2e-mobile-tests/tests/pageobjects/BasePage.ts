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
const DEFAULT_TIMEOUT_MS = Number(process.env.E2E_DEFAULT_TIMEOUT_MS || '3000');
const WAIT_INTERVAL_MS = Number(process.env.E2E_WAIT_INTERVAL_MS || '200');

export default abstract class BasePage {
  protected abstract selectors: Record<string, string>;

  protected readonly platform: DeviceType;
  protected readonly isAndroid: boolean;
  protected readonly isIOS: boolean;
  protected readonly deviceName: string;

  private readonly DEFAULT_TIMEOUT: number;
  private readonly WAIT_INTERVAL: number;

  private readonly selectorCache: Map<string, string> = new Map();

  constructor() {
    this.platform = this.detectPlatform();
    this.isAndroid = this.platform === 'Android';
    this.isIOS = this.platform === 'iOS';
    this.deviceName = process.env.ANDROID_DEVICE_NAME || process.env.IOS_DEVICE_NAME || 'unknown';
    this.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT_MS;
    this.WAIT_INTERVAL = WAIT_INTERVAL_MS;
    this.cacheSelectors();
  }

  /* ==================== PLATFORM ==================== */
  private detectPlatform(): DeviceType {
    const platform = (process.env.PLATFORM || '').toLowerCase();

    if (platform === 'android') return 'Android';
    if (platform === 'ios') return 'iOS';

    throw new Error('ENV PLATFORM must be "android" or "ios"');
  }

  /* ==================== SELECTOR CACHING ==================== */
  private cacheSelectors(): void {
    for (const key in this.selectors) {
      if (Object.prototype.hasOwnProperty.call(this.selectors, key)) {
        this.selectorCache.set(key, this.selectors[key]);
      }
    }
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
    const cached = this.selectorCache.get(name);
    if (cached) {
      return cached;
    }

    const selector = this.selectors[name];
    if (selector) {
      this.selectorCache.set(name, selector);
      return selector;
    }

    const availableKeys = Array.from(this.selectorCache.keys()).join(', ');
    throw new Error(
      `Selector not found!\n` +
        `  Key: "${name}"\n` +
        `  Platform: ${this.platform}\n` +
        `  Device: ${this.deviceName}\n` +
        `  Available keys: ${availableKeys || 'none'}`
    );
  }

  /* ==================== CHAIN HELPER ==================== */
  protected async chain<T extends BasePage>(fn: () => Promise<void>): Promise<T> {
    await fn();
    return this as unknown as T;
  }

  protected get self(): this {
    return this;
  }

  /* ==================== WAITING ==================== */
  async waitForDisplayed(name: string, timeout = 1000): Promise<this> {
    const selector = this.resolveSelector(name);
    const el = $(selector);
    const isDisplayed = await el.isDisplayed().catch(() => false);
    
    if (isDisplayed) {
      return this;
    }
    await el.waitForDisplayed({
      timeout,
      timeoutMsg: `Element "${name}" is not displayed after ${timeout}ms`,
      interval: 100,
    });
    
    return this;
  }

  async waitForExist(name: string, timeout = this.DEFAULT_TIMEOUT): Promise<this> {
    const selector = this.resolveSelector(name);
    await $(selector).waitForExist({
      timeout,
      timeoutMsg: `Element "${name}" does not exist after ${timeout}ms\nSelector: ${selector}`,
      interval: this.WAIT_INTERVAL,
    });
    return this;
  }

  /* ==================== GETTERS ==================== */
  async getElement(name: string, timeout?: number): Promise<ChainablePromiseElement> {
    try {
      await this.waitForDisplayed(name, timeout ?? this.DEFAULT_TIMEOUT);
      return this.$(name);
    } catch (error: any) {
      const selector = this.selectorCache.get(name) || 'unknown';
      throw new Error(
        `Failed to get element "${name}": ${error.message}\n` +
        `  Selector: ${selector}\n` +
        `  Platform: ${this.platform}`
      );
    }
  }

  protected raw(name: string): ChainablePromiseElement {
    try {
      return this.$(name);
    } catch (error: any) {
      throw new Error(`Failed to resolve selector "${name}": ${error.message}`);
    }
  }

  async getText(name: string, timeout = this.DEFAULT_TIMEOUT, allowEmpty = false): Promise<string> {
    const start = Date.now();
    let lastErr: any;
  
    while (Date.now() - start < timeout) {
      try {
        const el = this.raw(name);
        const displayed = await el.isDisplayed().catch(() => false);
        if (!displayed) {
          await browser.pause(this.WAIT_INTERVAL);
          continue;
        }
  
        const text = (await el.getText()).trim();
  
        if (allowEmpty) return text;
        if (text.length > 0) return text;

        await browser.pause(this.WAIT_INTERVAL);
        continue;
      } catch (e: any) {
        lastErr = e;
        await browser.pause(this.WAIT_INTERVAL);
      }
    }
  
    throw new Error(
      `Failed to getText("${name}") within ${timeout}ms` +
        (lastErr?.message ? `\nLast error: ${lastErr.message}` : '')
    );
  }

  async getAttribute(name: string, attr: string): Promise<string | null> {
    try {
      const el = await this.getElement(name);
      return await el.getAttribute(attr);
    } catch (error: any) {
      throw new Error(`Failed to get attribute "${attr}" from element "${name}": ${error.message}`);
    }
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
  async isTextMatching(name: string, expectedText: string, exact = true): Promise<boolean> {
    const attribute = this.isAndroid ? 'text' : 'label';
    const actualText = await (await this.getElement(name)).getAttribute(attribute) ?? '';
    
    return exact 
      ? actualText === expectedText
      : actualText.includes(expectedText);
  }

  /**
   * Verifies that element text exactly matches expected text
   * Uses getText() and direct comparison for strict text matching
   * This method ensures exact text matching, unlike toHaveText which may do partial matching
   */
  async expectExactText(name: string, expectedText: string, message?: string): Promise<this> {
    const el = await this.getElement(name);
    const actualText = await el.getText();
    
    if (actualText !== expectedText) {
      const errorMsg = message || `Text mismatch for element "${name}"`;
      const screenshotPath = await this.takeScreenshot('FAIL_text', name);
      
      throw new Error(
        `${errorMsg}\n` +
        `  Expected: "${expectedText}"\n` +
        `  Actual: "${actualText}"\n` +
        `  Platform: ${this.platform}\n` +
        `  Screenshot → ${screenshotPath}`
      );
    }
    
    return this;
  }

  /**
   * Helper method for soft exact text verification
   * Returns a promise that resolves if text matches, rejects if not
   * Can be used with expect.soft() pattern
   */
  async getExactText(name: string): Promise<string> {
    const el = await this.getElement(name);
    return await el.getText();
  }

  /**
   * Verifies that element is displayed (soft check - doesn't throw immediately)
   * Replaces expect.soft().toBeDisplayed()
   */
  async verifyDisplayedSoft(name: string, message?: string): Promise<this> {
    try {
      const el = await this.getElement(name);
      const isDisplayed = await el.isDisplayed();
      if (!isDisplayed) {
        const errorMsg = message || `Element "${name}" should be displayed`;
        const screenshotPath = await this.takeScreenshot('FAIL_visibility', name);
        throw new Error(
          `${errorMsg}\n` +
          `  Platform: ${this.platform}\n` +
          `  Screenshot → ${screenshotPath}`
        );
      }
    } catch (error: any) {
      const errorMsg = message || `Element "${name}" should be displayed`;
      const screenshotPath = await this.takeScreenshot('FAIL_visibility', name);
      throw new Error(
        `${errorMsg}\n` +
        `  Error: ${error.message}\n` +
        `  Platform: ${this.platform}\n` +
        `  Screenshot → ${screenshotPath}`
      );
    }
    return this;
  }

  /**
   * Verifies that element is displayed (accepts element directly)
   * Replaces expect.soft(element).toBeDisplayed()
   */
  async verifyElementDisplayed(el: ChainablePromiseElement, elementName: string, message?: string): Promise<this> {
    try {
      const isDisplayed = await el.isDisplayed();
      if (!isDisplayed) {
        const errorMsg = message || `Element "${elementName}" should be displayed`;
        const screenshotPath = await this.takeScreenshot('FAIL_visibility', elementName);
        throw new Error(
          `${errorMsg}\n` +
          `  Platform: ${this.platform}\n` +
          `  Screenshot → ${screenshotPath}`
        );
      }
    } catch (error: any) {
      const errorMsg = message || `Element "${elementName}" should be displayed`;
      const screenshotPath = await this.takeScreenshot('FAIL_visibility', elementName);
      throw new Error(
        `${errorMsg}\n` +
        `  Error: ${error.message}\n` +
        `  Platform: ${this.platform}\n` +
        `  Screenshot → ${screenshotPath}`
      );
    }
    return this;
  }

  /**
   * Verifies that element is enabled (soft check)
   * Replaces expect.soft().toBeEnabled() or expect.soft().not.toBeEnabled()
   */
  async verifyEnabledSoft(name: string, shouldBeEnabled: boolean, message?: string): Promise<this> {
    try {
      const el = await this.getElement(name);
      const isEnabled = await el.isEnabled();
      if (isEnabled !== shouldBeEnabled) {
        const errorMsg = message || `Element "${name}" should ${shouldBeEnabled ? 'be' : 'not be'} enabled`;
        const screenshotPath = await this.takeScreenshot('FAIL_enabled', name);
        throw new Error(
          `${errorMsg}\n` +
          `  Expected: ${shouldBeEnabled}\n` +
          `  Actual: ${isEnabled}\n` +
          `  Platform: ${this.platform}\n` +
          `  Screenshot → ${screenshotPath}`
        );
      }
    } catch (error: any) {
      const errorMsg = message || `Element "${name}" should ${shouldBeEnabled ? 'be' : 'not be'} enabled`;
      const screenshotPath = await this.takeScreenshot('FAIL_enabled', name);
      throw new Error(
        `${errorMsg}\n` +
        `  Error: ${error.message}\n` +
        `  Platform: ${this.platform}\n` +
        `  Screenshot → ${screenshotPath}`
      );
    }
    return this;
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
    // Use isEnabled() instead of isClickable() for mobile WebDriver compatibility
    // isClickable() is not supported in mobile WebDriver for Android
    const isClickable = await el.isEnabled();

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

  async touchAction(x: number, y: number): Promise<this> {
    try {
      await browser.performActions([
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: Math.round(x), y: Math.round(y) },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 100 },
            { type: 'pointerUp', button: 0 }
          ]
        }
      ]);
      await browser.releaseActions();
      return this;
    } catch (error: any) {
      throw new Error(`Failed to perform touch action at (${x}, ${y}): ${error.message}`);
    }
  }

  async tapRandomlyOnScreen(): Promise<this> {
    try {
      const size = (await browser.getWindowSize()) as ScreenSize;
      
      // Add padding to avoid tapping on system UI elements (status bar, navigation bar, etc.)
      const padding = 50;
      const minX = padding;
      const maxX = size.width - padding;
      const minY = padding;
      const maxY = size.height - padding;
      
      // Generate random coordinates within safe area
      const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
      
      await this.touchAction(randomX, randomY);
      return this;
    } catch (error: any) {
      throw new Error(`Failed to tap randomly on screen: ${error.message}`);
    }
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
    
    await browser.releaseActions();
    return this;
  }


  /* ==================== NAVIGATION ==================== */
  async pressBack(): Promise<this> {
    try {
      if (this.isAndroid) {
        await (browser as any).pressKeyCode(4);
        await browser.pause(300);
      } else {
        await browser.back();
        await browser.pause(300);
      }
      return this;
    } catch (error: any) {
      throw new Error(`Failed to press back button: ${error.message}`);
    }
  }

  async tapSystemHomeButton(): Promise<this> {
    try {
      if (this.isAndroid) {
        await (browser as any).pressKeyCode(3);
        await browser.pause(300);
      } else {
        throw new Error('System Home button is not available on iOS');
      }
      return this;
    } catch (error: any) {
      throw new Error(`Failed to press system Home button: ${error.message}`);
    }
  }

  async activateApp(): Promise<this> {
    try {
      if (this.isAndroid) {
        await browser.activateApp('com.pears.pass');
        await browser.pause(500);
      } else {
        // For iOS, you would use bundleId instead
        // await browser.activateApp('com.pears.pass');
        throw new Error('activateApp for iOS not implemented');
      }
      return this;
    } catch (error: any) {
      throw new Error(`Failed to activate app: ${error.message}`);
    }
  }
}
