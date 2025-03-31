const puppeteer = require("puppeteer");
const fs = require("fs");

const run = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();

  try {
    // Configure page settings
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    await page.setViewport({ width: 1366, height: 768 });

    // Navigate with more options
    await page.goto("https://www.yahoo.com/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Wait for page to load (alternative approach)
    await page.waitForFunction(() => document.readyState === "complete");

    // Get basic page info
    const title = await page.title();
    console.log(`Page title: ${title}`);

    // More reliable way to get meta tags
    const metaDescription = await page.evaluate(() => {
      const meta = document.querySelector("meta[name='description']");
      return meta ? meta.content : "Not found";
    });

    const metaKeywords = await page.evaluate(() => {
      const meta = document.querySelector("meta[name='keywords']");
      return meta ? meta.content : "Not found";
    });

    // More robust link extraction
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a"))
        .filter((a) => a.href && !a.href.startsWith("javascript:"))
        .map((a) => ({
          href: a.href,
          text: a.textContent.trim().replace(/\s+/g, " "),
          title: a.title || "",
        }));
    });

    // More robust image extraction
    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("img")).map((img) => ({
        src: img.src,
        alt: img.alt || "",
        width: img.naturalWidth,
        height: img.naturalHeight,
      }));
    });

    // Save data
    const data = {
      title,
      metaDescription,
      metaKeywords,
      links: links.slice(0, 100), // Limit to first 100 links
      images: images.slice(0, 50), // Limit to first 50 images
    };

    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
    console.log("✅ Data successfully saved to data.json");
  } catch (error) {
    console.error("❌ Error occurred:", error);
    // Take screenshot for debugging
    await page.screenshot({ path: "error.png" });
  } finally {
    await browser.close();
  }
};

run();
