import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

export async function analyzeWebsite(req, res) {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // --- 1. Fetch HTML Content ---
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    // --- 2. Basic SEO Elements ---
    const title = $("title").text() || "Not Found";
    const metaDescription =
      $('meta[name="description"]').attr("content") || "Not Found";
    const metaKeywords =
      $('meta[name="keywords"]').attr("content") || "Not Found";

    // Social Meta Tags (Open Graph & Twitter)
    const ogTitle =
      $('meta[property="og:title"]').attr("content") || "Not Found";
    const ogDescription =
      $('meta[property="og:description"]').attr("content") || "Not Found";
    const twitterTitle =
      $('meta[name="twitter:title"]').attr("content") || "Not Found";
    const twitterDescription =
      $('meta[name="twitter:description"]').attr("content") || "Not Found";

    // --- 3. Indexability & Canonical ---
    const robotsMeta =
      $('meta[name="robots"]').attr("content") || "index, follow";
    const canonicalLink =
      $('link[rel="canonical"]').attr("href") || "Not specified";

    // --- 4. Header Tags Analysis ---
    const h1Tags = [];
    const h2Tags = [];
    const h3Tags = [];
    $("h1").each((i, el) => h1Tags.push($(el).text().trim()));
    $("h2").each((i, el) => h2Tags.push($(el).text().trim()));
    $("h3").each((i, el) => h3Tags.push($(el).text().trim()));

    // --- 5. Broken Links Check ---
    const links = [];
    $("a").each((i, el) => {
      const link = $(el).attr("href");
      if (link) links.push(link);
    });

    let brokenLinks = [];
    await Promise.all(
      links.map(async (link) => {
        try {
          let completeUrl = link;
          // Agar link relative hai toh convert karo absolute URL mein
          if (completeUrl.startsWith("/")) {
            completeUrl = new URL(completeUrl, url).href;
          }
          // Ignore javascript and mailto links
          if (
            completeUrl.startsWith("javascript:") ||
            completeUrl.startsWith("mailto:")
          ) {
            return;
          }
          const response = await axios.get(completeUrl, { timeout: 10000 });
          if (response.status >= 400) {
            brokenLinks.push(completeUrl);
          }
        } catch (err) {
          brokenLinks.push(link);
        }
      })
    );

    // --- 6. Server Response Time ---
    const startTime = Date.now();
    await axios.get(url);
    const responseTime = Date.now() - startTime;
    console.log("responseTime", responseTime);
    // --- 7. JavaScript Rendering, Mobile View, & Clickable Elements ---
    // { headless: false }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {
      timeout: 60000,
      waitUntil: "networkidle2",
    });
    await page.setViewport({ width: 375, height: 667 });

    // Screenshot for mobile view (base64 encoded)
    const mobileViewScreenshot = await page.screenshot({ encoding: "base64" });

    // Count clickable elements (links and buttons)
    const clickableElementsCount = await page.evaluate(() => {
      return document.querySelectorAll("a, button").length;
    });

    await browser.close();

    // --- 8. JS & CSS Minification Check ---
    const jsMinified = [];
    const cssMinified = [];
    $("script").each((i, el) => {
      const src = $(el).attr("src");
      if (src && src.includes(".min.js")) {
        jsMinified.push(src);
      }
    });
    $('link[rel="stylesheet"]').each((i, el) => {
      const href = $(el).attr("href");
      if (href && href.includes(".min.css")) {
        cssMinified.push(href);
      }
    });

    // --- 9. Additional Details (e.g., language, charset) ---
    const htmlLang = $("html").attr("lang") || "Not specified";
    const charset =
      $("meta[charset]").attr("charset") ||
      $('meta[http-equiv="Content-Type"]').attr("content") ||
      "Not specified";
    // --- Build Final Detailed Report ---
    const report = {
      url,
      basic: {
        title,
        metaDescription,
        metaKeywords,
        htmlLang,
        charset,
      },
      socialMeta: {
        ogTitle,
        ogDescription,
        twitterTitle,
        twitterDescription,
      },
      indexability: {
        robotsMeta,
        canonicalLink,
      },
      headers: {
        h1Tags,
        h2Tags,
        h3Tags,
      },
      links: {
        totalLinks: links,
        brokenLinks,
      },
      performance: {
        serverResponseTime: responseTime, // in milliseconds
      },
      rendering: {
        mobileViewScreenshot, // base64 encoded image
        clickableElementsCount,
      },
      assets: {
        jsMinified,
        cssMinified,
      },
    };

    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error analyzing website", err });
  }
}

// export async function analyzeWebsite(req, res) {
//   const { url } = req.body;

//   if (!url) {
//     return res.status(400).json({ error: "URL is required" });
//   }

//   try {
//     // --- 1. Fetch HTML Content ---
//     const { data: html } = await axios.get(url);
//     const $ = cheerio.load(html);

//     // --- 2. Indexability Check ---
//     const robotsMeta =
//       $('meta[name="robots"]').attr("content") || "index, follow";

//     // --- 3. Canonical Check ---
//     const canonicalLink =
//       $('link[rel="canonical"]').attr("href") || "Not specified";

//     // --- 4. Broken Links Check ---
//     const links = [];
//     $("a").each((i, el) => {
//       const link = $(el).attr("href");
//       if (link) links.push(link);
//     });

//     let brokenLinks = [];
//     await Promise.all(
//       links.map(async (link) => {
//         try {
//           let completeUrl = link;
//           // Agar link relative hai toh usko absolute URL mein convert karo
//           if (completeUrl.startsWith("/")) {
//             completeUrl = new URL(completeUrl, url).href;
//           }
//           const response = await axios.get(completeUrl);
//           if (response.status >= 400) {
//             brokenLinks.push(completeUrl);
//           }
//         } catch (err) {
//           brokenLinks.push(link);
//         }
//       })
//     );

//     // --- 5. Server Response Time ---
//     const startTime = Date.now();
//     await axios.get(url);
//     const responseTime = Date.now() - startTime;

//     // --- 6. JS Rendering, Mobile View, & Clickable Elements ---
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Navigate to page
//     await page.goto(url, { waitUntil: "networkidle2" });

//     // Mobile view check: set viewport to a typical mobile size
//     await page.setViewport({ width: 375, height: 667, isMobile: true });

//     // Screenshot for mobile view (encoded in base64)
//     const mobileScreenshot = await page.screenshot({ encoding: "base64" });

//     // Count clickable elements (for example: <a> and <button>)
//     const clickableElementsCount = await page.$$eval(
//       "a, button",
//       (elements) => elements.length
//     );

//     await browser.close();

//     // --- 7. JS & CSS Minification Check ---
//     const jsMinified = [];
//     const cssMinified = [];
//     $("script").each((i, el) => {
//       const src = $(el).attr("src");
//       if (src && src.includes(".min.js")) {
//         jsMinified.push(src);
//       }
//     });
//     $('link[rel="stylesheet"]').each((i, el) => {
//       const href = $(el).attr("href");
//       if (href && href.includes(".min.css")) {
//         cssMinified.push(href);
//       }
//     });

//     // --- Build Final Report ---
//     const report = {
//       url,
//       robotsMeta,
//       canonicalLink,
//       brokenLinks,
//       totalLinksFound: links.length,
//       serverResponseTime: responseTime, // milliseconds
//       mobileViewScreenshot: mobileScreenshot, // base64 encoded image
//       clickableElementsCount,
//       jsMinified,
//       cssMinified,
//     };

//     res.json(report);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error analyzing website" });
//   }
// }
