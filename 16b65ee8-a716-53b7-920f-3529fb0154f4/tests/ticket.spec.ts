import { test, expect } from '@playwright/test';
import cfg from '../config.json';
import uaParser from 'ua-parser-js';

test.describe('Tickets', () => {
    test('Dia Beacon Timed Tickets', async ({ browser, page }, workerInfo) => {
        test.setTimeout(120000);

        const getUA = await page.evaluate(() => navigator.userAgent);
        const userAgentInfo = uaParser(getUA);
        const browserName = userAgentInfo.browser.name;
        const projectName = workerInfo.project.name;
        // const viewport = `${page.viewportSize().width}x${page.viewportSize().height}`;

        const imagePath = `images/${cfg.guid}/${browserName}/${projectName}/${cfg.media.tickets.images}`;
        const videoPath = `videos/${cfg.guid}/${browserName}/${projectName}/${cfg.media.tickets.video}`;

        const context = await browser.newContext({
            recordVideo: { dir: videoPath }
        });

        page.close();
        page = await context.newPage();

        //Go to tickets URL
        await page.goto(cfg.pages.ticket.event.url);

        //Click the first event in calendar
        let eventSelector = cfg.pages.ticket.event.selectors[0];
        if (page.viewportSize().width <= 665) {
            eventSelector = cfg.pages.ticket.event.selectors[2];
        }

        let hasEvent = false;
        while (!hasEvent) {
            await page.click(cfg.pages.ticket.event.selectors[3]);
            try {
                await page.waitForSelector(eventSelector, { timeout: 500 })
                hasEvent = true;
            } catch (error) {
                // console.log("The element didn't appear.");
            }
        }

        page.click(eventSelector);
        const [eventPage] = await Promise.all([
            page.waitForEvent('popup')
        ]);

        await eventPage.video().path();

        //Close membership pop up
        await eventPage.click(cfg.common.selectors['membership-close']);

        //Add ticket quantity
        await eventPage.fill(cfg.pages.ticket.event.selectors[1], cfg.pages.ticket.event.quantity);
        await eventPage.waitForTimeout(500);
        await eventPage.screenshot({ path: `${imagePath}/1_ticket_checkout_item.png`, fullPage: true });
        await eventPage.click('text=Continue');

        //Fill out registrant information
        await Promise.all([
            eventPage.waitForSelector('[id*="_listRegistrationGroups_listRegistrations_0_registrantContainer_0"]'),
        ]);
        await eventPage.fill(cfg.common['checkout-form'].first, cfg.personal.first);
        await eventPage.fill(cfg.common['checkout-form'].last, cfg.personal.last);
        await eventPage.fill(cfg.common['checkout-form'].phone, cfg.personal.phone);
        await eventPage.fill(cfg.common['checkout-form'].email, cfg.personal.email);
        await eventPage.waitForTimeout(500);
        await eventPage.selectOption(cfg.common['checkout-form'].country, cfg.personal.country);
        await eventPage.selectOption(cfg.common['checkout-form'].state, cfg.personal.state);
        await eventPage.fill(cfg.common['checkout-form'].zip, cfg.personal.zip);
        await eventPage.fill(cfg.common['checkout-form'].city, cfg.personal.city);
        await eventPage.fill(cfg.common['checkout-form'].address, cfg.personal.address);
        //Check covid waiver
        await eventPage.click(cfg.common.selectors['covid-waiver']);
        await eventPage.waitForTimeout(500);
        await eventPage.screenshot({ path: `${imagePath}/2_ticket_checkout_registration.png`, fullPage: true });
        //Click Add To Cart
        await eventPage.click('text=Add To Cart');

        //Cart Page
        await Promise.all([
            eventPage.waitForSelector('#sgs-cart-buttons'),
        ]);
        await eventPage.waitForTimeout(500);
        await eventPage.screenshot({ path: `${imagePath}/3_ticket_cart.png`, fullPage: true });

        //Click Empty Cart
        await eventPage.click(cfg.common.selectors['cart-empty']);
        await Promise.all([
            eventPage.waitForSelector('#sgs-empty-cart'),
        ]);
        await eventPage.waitForTimeout(500);
        await eventPage.screenshot({ path: `${imagePath}/4_empty_cart.png`, fullPage: true });

        await context.close();
    });
});