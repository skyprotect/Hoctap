const { chromium } = require('@playwright/test');

(async () => {
  console.log('Starting debugger...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(`[Browser Console] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[Browser PageError] ${err.toString()}`);
  });

  console.log('Navigating to student app...');
  await page.goto('http://localhost:3000/student.html');

  // Check splash screen button
  const startBtn = page.locator('#splash-start-btn');
  if (await startBtn.isVisible()) {
    console.log('Clicking splash start button...');
    await startBtn.click();
    // Wait for the splash screen to completely fade out
    await page.waitForSelector('#splash-screen', { state: 'hidden', timeout: 5000 }).catch(e => {
      console.log('Splash screen fade-out took too long or was already hidden');
    });
  }

  // Click on the first active/completed math lesson in the timeline
  console.log('Locating first lesson node...');
  const firstNode = page.locator('.node-btn.active, .node-btn.completed').first();
  await firstNode.waitFor({ state: 'visible', timeout: 5000 });
  const id = await firstNode.getAttribute('id');
  console.log(`Clicking lesson node with id: ${id}`);
  await firstNode.click();
  await page.waitForTimeout(1000);

  // Measure bounding boxes
  const metrics = await page.evaluate(() => {
    const wrapper = document.getElementById('video-wrapper');
    const innerWrapper = wrapper ? wrapper.querySelector('.video-aspect-ratio-box') : null;
    const overlay = wrapper ? wrapper.querySelector('.video-thumbnail-overlay') : null;
    
    return {
      wrapper: wrapper ? {
        width: wrapper.offsetWidth,
        height: wrapper.offsetHeight,
      } : null,
      innerWrapper: innerWrapper ? {
        width: innerWrapper.offsetWidth,
        height: innerWrapper.offsetHeight,
        position: window.getComputedStyle(innerWrapper).position
      } : null,
      overlay: overlay ? {
        width: overlay.offsetWidth,
        height: overlay.offsetHeight,
        position: window.getComputedStyle(overlay).position
      } : null
    };
  });

  console.log('Dimensions metrics:', JSON.stringify(metrics, null, 2));

  // Click the video thumbnail overlay to trigger fullscreen video
  const playOverlay = page.locator('#video-wrapper .video-thumbnail-overlay');
  if (await playOverlay.isVisible()) {
    console.log('Clicking play overlay...');
    await playOverlay.click();
    await page.waitForTimeout(1000);

    const bodyClass = await page.evaluate(() => document.body.className);
    console.log(`Body classes after playing video: "${bodyClass}"`);

    const globalWrapperStyle = await page.evaluate(() => {
      const el = document.getElementById('global-fullscreen-video-wrapper');
      return el ? {
        display: el.style.display,
        visible: window.getComputedStyle(el).display,
        zIndex: window.getComputedStyle(el).zIndex,
        width: el.offsetWidth,
        height: el.offsetHeight
      } : null;
    });
    console.log('Global wrapper style after playing video:', globalWrapperStyle);
  } else {
    console.error('Video thumbnail overlay not found!');
  }

  await browser.close();
  console.log('Finished debugger.');
})();
