const puppeteer = require("puppeteer");

module.exports = {
  pdfGenerator: async function (html = "") {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setContent(html);
    const pdfBuffer = await page.pdf({ printBackground: true });

    console.log("success create pdf");
    await page.close();
    await browser.close();

    return pdfBuffer;
  },
};
