import { test, expect } from '@playwright/test';
import cfg from '../config.json';
import uaParser from 'ua-parser-js';

test.describe('Portal', () => {
    test('Sign In', async ({ browser, page }) => {
        test.setTimeout(120000);

        const getUA = await page.evaluate(() => navigator.userAgent);
        const userAgentInfo = uaParser(getUA);
        const browserName = userAgentInfo.browser.name;

        const imagePath = `images/${cfg.guid}/${browserName}/${cfg.media.signin.images}`;
        const videoPath = `videos/${cfg.guid}/${browserName}/${cfg.media.signin.video}`;

        const context = await browser.newContext({
            recordVideo: { dir: videoPath }
        });

        page = await context.newPage();

        //Go to membership URL
        await page.goto(cfg.pages.membership.url);

        //Click Join, renew or gift this membership
        await page.click(cfg.pages.membership.selectors[0]);

        const [joinPage] = await Promise.all([
            page.waitForEvent('popup'),
            page.click(cfg.pages.membership.selectors[1])
        ]);

        await joinPage.video().path();

        //Close membership pop up
        await joinPage.click(cfg.common.selectors['membership-close']);

        //Click Sign In 
        await joinPage.click('text=Sign In');

        //Fill out invalid sign in information
        await joinPage.fill('input#sign-username', cfg.signin.username);
        await joinPage.fill('input#sign-password', cfg.signin['password-invalid']);
        await joinPage.click('#signinbutton');

        //Fill out valid sign in information
        await joinPage.fill('input#sign-username', cfg.signin.username);
        await joinPage.fill('input#sign-password', cfg.signin['password-valid']);
        await joinPage.screenshot({ path: `${imagePath}/1_signin_failed.png`, fullPage: true });
        await joinPage.waitForTimeout(500);
        await joinPage.click('#signinbutton');
        //Signed in state
        await Promise.all([
            await joinPage.waitForSelector('text=Continue'),
            await joinPage.waitForSelector('text=Sign Out')
        ]);
        await joinPage.screenshot({ path: `${imagePath}/2_signin_success.png`, fullPage: true });

        //Click Sign Out
        await joinPage.click('[id*="_LinkbuttonSignOut"]');
        //Signed out state
        await Promise.all([
            await joinPage.waitForSelector('text=Continue'),
            await joinPage.waitForSelector('text=Sign In')
        ]);
        await joinPage.screenshot({ path: `${imagePath}/3_signout.png`, fullPage: true });

        // await context.close();
    });
});