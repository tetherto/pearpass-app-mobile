'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DEVICE_DCIM = '/sdcard/DCIM';
const TEMPLATE_FILES = [
  'passport-template.jpg',
  'id-card-template.jpg',
  'driving-license-template.jpg'
];

const testDataDir = path.resolve(__dirname, '..', 'tests', 'data', 'test-data');

function main() {
  execSync(`adb shell mkdir -p ${DEVICE_DCIM}`, { stdio: 'inherit' });

  let pushed = 0;
  for (const file of TEMPLATE_FILES) {
    const src = path.join(testDataDir, file);
    if (!fs.existsSync(src)) {
      console.warn(`⚠️ Skip (missing): ${file}`);
      continue;
    }
    execSync(`adb push "${src}" "${DEVICE_DCIM}/"`, {
      stdio: 'inherit',
      maxBuffer: 10 * 1024 * 1024
    });
    pushed++;
  }
  console.log(`📁 ${pushed} template image(s) pushed to ${DEVICE_DCIM}`);
}

main();
