import { test, expect } from '@playwright/test';
import cfg from '../config.json';
import uaParser from 'ua-parser-js';

test.describe('Membership', () => {
    test('Join, renew or gift this membership', async ({ browser, page }, workerInfo) => {
        test.setTimeout(120000);

        const getUA = await page.evaluate(() => navigator.userAgent);
        const userAgentInfo = uaParser(getUA);
        const browserName = userAgentInfo.browser.name;
        const projectName = workerInfo.project.name;
        // const viewport = `${page.viewportSize().width}x${page.viewportSize().height}`;

        const imagePath = `images/${cfg.guid}/${browserName}/${projectName}/${cfg.media.membership.images}`;
        const videoPath = `videos/${cfg.guid}/${browserName}/${projectName}/${cfg.media.membership.video}`;

        const context = await browser.newContext({
            recordVideo: { dir: videoPath }
        });
        
        page.close();
        page = await context.newPage();

        //Go to membership URL
        await page.goto(cfg.pages.membership.url);
        // await page.screenshot({ path: `${imagePath}/1_membership_homepage.png`, fullPage: true });

        //Click Join, renew or gift this membership
        await page.click(cfg.pages.membership.selectors[0]);

        const [joinPage] = await Promise.all([
            page.waitForEvent('popup'),
            page.click(cfg.pages.membership.selectors[1])
        ]);

        await joinPage.video().path();

        //Close membership pop up
        await joinPage.click(cfg.common.selectors['membership-close']);

        //Fill out membership information
        await joinPage.selectOption(cfg.common['membership-form'].title, cfg.personal.title);
        await joinPage.fill(cfg.common['membership-form'].first, cfg.personal.first);
        await joinPage.fill(cfg.common['membership-form'].last, cfg.personal.last);
        await joinPage.screenshot({ path: `${imagePath}/1_membership_checkout.png`, fullPage: true });
        await joinPage.click(cfg.pages.membership.continue);

        //Fill cart page fill out personal information
        await joinPage.fill(cfg.common['cart-form'].phone, cfg.personal.phone);
        await joinPage.fill(cfg.common['cart-form'].email, cfg.personal.email);
        await joinPage.waitForTimeout(500);
        await joinPage.selectOption(cfg.common['cart-form'].country, cfg.personal.country);
        await joinPage.selectOption(cfg.common['cart-form'].state, cfg.personal.state);
        await joinPage.fill(cfg.common['cart-form'].zip, cfg.personal.zip);
        await joinPage.fill(cfg.common['cart-form'].city, cfg.personal.city);
        await joinPage.fill(cfg.common['cart-form'].address, cfg.personal.address);
        await joinPage.screenshot({ path: `${imagePath}/2_membership_cart.png`, fullPage: true });

        await context.close();
    });
});