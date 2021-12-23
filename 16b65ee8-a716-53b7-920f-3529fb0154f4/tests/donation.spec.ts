import { test, expect } from '@playwright/test';
import cfg from '../config.json';
import uaParser from 'ua-parser-js';

test.describe('Donation', () => {
    test('Make a donation', async ({ browser, page }, workerInfo) => {
        test.setTimeout(120000);

        const getUA = await page.evaluate(() => navigator.userAgent);
        const userAgentInfo = uaParser(getUA);
        const browserName = userAgentInfo.browser.name;
        const projectName = workerInfo.project.name;
        // const viewport = `${page.viewportSize().width}x${page.viewportSize().height}`;

        const imagePath = `images/${cfg.guid}/${browserName}/${projectName}/${cfg.media.donation.images}`;
        const videoPath = `videos/${cfg.guid}/${browserName}/${projectName}/${cfg.media.donation.video}`;

        const context = await browser.newContext({
            recordVideo: { dir: videoPath }
        });

        page.close();
        page = await context.newPage();

        //Go to donation URL
        await page.goto(cfg.pages.donation.url);
        // await page.screenshot({ path: `${imagePath}/1_donation_homepage.png`, fullPage: true });

        //Click Make a donation
        const [donationPage] = await Promise.all([
            page.waitForEvent('popup'),
            page.click(cfg.pages.donation.selectors[0])
        ]);

        await donationPage.video().path();

        //Fill invalid donation amount and continue
        await donationPage.waitForSelector(cfg.pages.donation.selectors[1]);
        await donationPage.fill(cfg.pages.donation.selectors[1], cfg.pages.donation['amount-invalid']);
        await donationPage.click(cfg.pages.donation.continue);
        await donationPage.waitForTimeout(500);
        await donationPage.screenshot({ path: `${imagePath}/1_donation_checkout_invalid.png`, fullPage: true });

        //Fill valid donation amount and continue
        await donationPage.fill(cfg.pages.donation.selectors[1], cfg.pages.donation['amount-valid']);
        await donationPage.waitForTimeout(500);
        await donationPage.screenshot({ path: `${imagePath}/2_donation_checkout_valid.png`, fullPage: true });
        await donationPage.click(cfg.pages.donation.continue);

        //Go back and edit amount
        await donationPage.waitForSelector(cfg.common.selectors['cart-empty']);
        await donationPage.waitForTimeout(500);
        await donationPage.screenshot({ path: `${imagePath}/3_donation_cart.png`, fullPage: true });
        await donationPage.click(cfg.pages.donation['edit-item']);
        await donationPage.fill(cfg.pages.donation.selectors[1], cfg.pages.donation['amount-valid-update']);
        await donationPage.waitForTimeout(500);
        await donationPage.screenshot({ path: `${imagePath}/4_donation_checkout_valid_update.png`, fullPage: true });
        await donationPage.click(cfg.pages.donation.continue);
        await donationPage.waitForSelector(cfg.common.selectors['cart-empty']);
        await donationPage.waitForTimeout(500);
        await donationPage.screenshot({ path: `${imagePath}/5_donation_cart_update.png`, fullPage: true });

        //Empty cart
        await donationPage.waitForSelector(cfg.common.selectors['cart-empty']);
        await donationPage.click(cfg.common.selectors['cart-empty']);
        await donationPage.waitForSelector(cfg.common.selectors['cart-empty-page']);
        await donationPage.waitForTimeout(500);
        await donationPage.screenshot({ path: `${imagePath}/6_empty_cart.png`, fullPage: true });

        await context.close();
    });
});