import { test, expect } from '@playwright/test';
import cfg from '../config.json';

test('membership', async ({ browser }) => {
    test.setTimeout(120000);

    const context = await browser.newContext({
        recordVideo: {
            dir: `videos/${cfg.guid}/${cfg.pages.media.membership.video}`
        }
    });
    const page = await context.newPage();

    await page.goto(cfg.pages.membership.url);
    await page.screenshot({ path: `images/${cfg.guid}/${cfg.pages.media.membership.images}/membership1.png`, fullPage: true });

    await page.click('#heading90');

    const [joinPage] = await Promise.all([
        page.waitForEvent('popup'),
        page.click('#collapse90 >> .section-link')
    ]);

    // Wait for the new tab to open
    await joinPage.click('.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.newLogin .ui-dialog-titlebar .ui-dialog-titlebar-close');
    // await renewOrGiftMembershipPage.click('button.ui-dialog-titlebar-close');

    await joinPage.selectOption('select[id*="_listViewMembers_ddTitle_0"]', cfg.personal.title);
    await joinPage.fill('input[id*="_listViewMembers_txtFirstName_0"]', cfg.personal.first);
    await joinPage.fill('input[id*="_listViewMembers_txtLastName_0"]', cfg.personal.last);

    await joinPage.screenshot({ path: `images/${cfg.guid}/${cfg.pages.media.membership.images}/membership2.png`, fullPage: true });

    await joinPage.click('text=Continue');

    await joinPage.fill('input[id*="_PersonalInfoShippingAddress_txtEmail"]', cfg.personal.email);
    await joinPage.fill('input[id*="_PersonalInfoShippingAddress_txtPhoneNumber"]', cfg.personal.phone);
    await joinPage.selectOption('select[id*="_PersonalInfoShippingAddress_AddressControl_dd_Country"]', cfg.personal.country);
    await joinPage.fill('[id*="_AddressControl_tb_AddressLine"]', cfg.personal.address);
    await joinPage.fill('input[id*="_PersonalInfoShippingAddress_AddressControl_tb_CityUS"]', cfg.personal.city);
    await joinPage.selectOption('select[id*="_PersonalInfoShippingAddress_AddressControl_dd_StateUS"]', cfg.personal.state);
    await joinPage.fill('input[id*="_PersonalInfoShippingAddress_AddressControl_tb_zipUS"]', cfg.personal.zip);

    await joinPage.screenshot({ path: `images/${cfg.guid}/${cfg.pages.media.membership.images}/membership3.png`, fullPage: true });
});

