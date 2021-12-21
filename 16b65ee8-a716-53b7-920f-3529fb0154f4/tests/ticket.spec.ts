import { test, expect } from '@playwright/test';
import cfg from '../config.json';
import uaParser from 'ua-parser-js';

test.describe('Tickets', () => {
    test('Dia Beacon Timed Tickets', async ({ browser, page }) => {
        test.setTimeout(120000);

        const getUA = await page.evaluate(() => navigator.userAgent);
        const userAgentInfo = uaParser(getUA);
        const browserName = userAgentInfo.browser.name;

        const imagePath = `images/${cfg.guid}/${browserName}/${cfg.pages.media.tickets.images}`;
        const videoPath = `videos/${cfg.guid}/${browserName}/${cfg.pages.media.tickets.video}`;

        const context = await browser.newContext({
            recordVideo: { dir: videoPath }
        });

        page = await context.newPage();

        await page.video().path();

        //Go to tickets URL
        await page.goto(cfg.pages.ticket.event.url);

        const [eventPage] = await Promise.all([
            page.waitForEvent('popup'),
            page.click('.fc-event-container >> a')
        ]);

        await eventPage.video().path();

        //Close membership pop up
        await eventPage.click('.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.newLogin .ui-dialog-titlebar .ui-dialog-titlebar-close');

        //Add ticket quantity
        await eventPage.fill('input[id*="_listPriceList_textboxQuantity_2"]', cfg.pages.ticket.event.quantity);

        await eventPage.screenshot({ path: `${imagePath}/1_event_addItems.png`, fullPage: true });

        //Click Continue
        await eventPage.click('text=Continue');

        await Promise.all([
            eventPage.waitForSelector('[id*="_listRegistrationGroups_listRegistrations_0_registrantContainer_0"]'),
        ]);

        //Fill out registrant information
        await eventPage.fill('input[id*="_listRegistrationGroups_listRegistrations_0_txtRegistrantFirstName_0"]', cfg.personal.first);
        await eventPage.fill('input[id*="_listRegistrationGroups_listRegistrations_0_txtRegistrantLastName_0"]', cfg.personal.last);
        await eventPage.fill('input[id*="_listRegistrationGroups_listRegistrations_0_txtRegistrantPhone_0"]', cfg.personal.phone);
        await eventPage.fill('input[id*="_listRegistrationGroups_listRegistrations_0_txtRegistrantEmail_0"]', cfg.personal.email);
        await eventPage.waitForTimeout(500);
        await eventPage.selectOption('select[id*="_listRegistrationGroups_listRegistrations_0_AddressControl_0_dd_Country_0"]', cfg.personal.country);
        await eventPage.selectOption('select[id*="_listRegistrationGroups_listRegistrations_0_AddressControl_0_dd_StateUS_0"]', cfg.personal.state);
        await eventPage.fill('input[id*="_listRegistrationGroups_listRegistrations_0_AddressControl_0_tb_zipUS_0"]', cfg.personal.zip);
        await eventPage.fill('input[id*="_listRegistrationGroups_listRegistrations_0_AddressControl_0_tb_CityUS_0"]', cfg.personal.city);
        await eventPage.fill('textarea[id*="_listRegistrationGroups_listRegistrations_0_AddressControl_0_tb_AddressLine_0"]', cfg.personal.address);
        //Check covid waiver
        await eventPage.click('input#agree-to-terms');

        await eventPage.screenshot({ path: `${imagePath}/2_event_registration.png`, fullPage: true });

        //Click Add To Cart
        await eventPage.click('text=Add To Cart');

        await Promise.all([
            eventPage.waitForSelector('#sgs-cart-buttons'),
        ]);

        await eventPage.screenshot({ path: `${imagePath}/3_event_cart.png`, fullPage: true });

        //Click Empty Cart
        await eventPage.click('#sgs-cart-buttons >> a');

        await Promise.all([
            eventPage.waitForSelector('#sgs-empty-cart'),
        ]);

        await eventPage.screenshot({ path: `${imagePath}/4_empty_cart.png`, fullPage: true });

        // await context.close();
    });
});