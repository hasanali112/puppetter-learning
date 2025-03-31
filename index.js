const puppeteer = require("puppeteer");

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();
    await page.goto("https://google.com");

    const title = await page.title();
    console.log(title);

    const heading = await page.$eval("p", (elements) => {
      return elements.map((element) => element.textContent);
    });
    console.log(heading);

    await page.pdf({ path: "google.pdf", format: "A4" });

    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
