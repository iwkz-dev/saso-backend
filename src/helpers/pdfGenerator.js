const puppeteer = require('puppeteer');

module.exports = {
  async pdfGenerator(html = '') {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();

    await page.setContent(html);
    const pdfBuffer = await page.pdf({ printBackground: true });

    console.log('success create pdf');
    await page.close();
    await browser.close();

    return pdfBuffer;
  },
};
