const playwright = require('playwright');
const guid = '16b65ee8-a716-53b7-920f-3529fb0154f4';

(async () => {
    for (const browserType of ['chromium', 'firefox', 'webkit']) {
        const browser = await playwright[browserType].launch({
            headless: false
        });

        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://www.diaart.org');

        // await page.waitForResponse(response => {
        //     return response.request().resourceType() === "xhr";
        // });

        await page.screenshot({ path: `${guid}/images/${browserType}/membership.png` });
        await browser.close();
    }
})();