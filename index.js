const puppeteer = require("puppeteer");

const run = async (url, outputFile) => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.goto("https://www.daraz.com.bd/");

  //generate a pdf
  await page.pdf({ path: outputFile, format: "A4" });
  await browser.close();
};

run();
