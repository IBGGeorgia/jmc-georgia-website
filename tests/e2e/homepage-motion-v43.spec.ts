import {test,expect} from '@playwright/test';

test.describe('Homepage 4.3 progressive motion',()=>{
 for(const width of [1440,768,390,320]){
  test('scroll reveals and model/photo transitions do not break UI at '+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto('/',{waitUntil:'domcontentloaded'});
   await expect(page.getByRole('heading',{level:1})).toBeVisible();
   await page.locator('.home3-story-intro').scrollIntoViewIfNeeded();
   await expect.poll(()=>page.locator('.home3-story-intro').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
   const tabs=page.getByRole('group',{name:'აირჩიე JMC-ის მოდელი'});
   await tabs.getByRole('button',{name:'Grand Avenue PRO'}).click();
   await expect(page.locator('.home3-stage-copy h3')).toHaveText('Grand Avenue PRO');
   const gallery=page.getByRole('group',{name:'გალერეის მოდელი'});
   await gallery.getByRole('button',{name:'VIGUS'}).click();
   await page.getByRole('button',{name:'შემდეგი ფოტო'}).click();
   await expect(page.locator('.home3-photo-controls span')).toContainText('2 /');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
 }
 test('reduced motion leaves all content accessible and disables decorative animations',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await page.locator('.home3-conversion').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading',{name:'გამოსცადე შენი JMC.'})).toBeVisible();
  expect(await page.locator('.home3-motion-pending').count()).toBe(0);
  expect(await page.locator('.home3-hero-backdrop').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 });
});
