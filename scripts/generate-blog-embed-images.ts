import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const publicRuntimeConfig = JSON.parse(fs.readFileSync('../publicRuntimeConfig.json').toString());
const WEBSITES = [publicRuntimeConfig['en'], publicRuntimeConfig['en-US']];

const DEVELOPMENT_ROOT = 'http://localhost:3000';

const blogEmbeds = path.join('..', 'public', 'embeds', 'blog');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 800, height: 400 });
  await page.goto(`${DEVELOPMENT_ROOT}/blog`);

  for (const existing of await fs.promises.readdir(blogEmbeds)) {
    await fs.promises.rm(path.join(blogEmbeds, existing));
  }

  const slugs = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLAnchorElement>('main section a')).map(anchor =>
      anchor.getAttribute('href')!.split('/').at(-1),
    ),
  );
  for (const [i, slug] of Array.from(slugs.entries())) {
    process.stdout.write(`${((i / slugs.length) * 100).toFixed(2)}          \r`);
    await page.goto(`${DEVELOPMENT_ROOT}/blog/embed/` + slug, { waitUntil: 'networkidle' });

    const buffer = await page.screenshot({ type: 'jpeg', quality: 100 });
    await fs.promises.writeFile(path.join(blogEmbeds, `${slug}.jpg`), buffer);
    for (const website of WEBSITES)
      await fs.promises.writeFile(
        path.join(blogEmbeds, `${slug}-oembed-${website.short}.json`),
        JSON.stringify({
          type: 'link',
          version: '1.0',
          author_name: website.name,
          author_url: website.website,
          provider_name: 'Your next Software Engineer!',
          provider_url: website.website,
          thumbnail_url: `${website.website}/embeds/blog/${slug}.png`,
        }),
      );
  }

  console.log();

  await browser.close();
})();
