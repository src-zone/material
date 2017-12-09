const puppeteer = require('puppeteer');
import * as express from 'express';
const { join, dirname } = require('path');
const { readFile, exists, writeFile, mkdir } = require('mz/fs')
const { uniq, difference } = require('lodash');

// Settings:
const PORT = 4000;
const HOST = `http://localhost:${PORT}`;
const DIST = join(process.cwd(), 'dist');
const SEED = 'material';
const ELM = "blox-app";

let defaultPage = SEED + '.html';
let todoPages = [SEED];
let donePages: string[] = [];

// Based on a blog article on cloudboost:
//  https://blog.cloudboost.io/prerender-an-angular-application-with-angular-cli-and-puppeteer-25dede2f0252
async function main() {
  const app = express();

  // Getting the html content for the default html to bootstrap pages:
  const defaultContent = (await readFile(join(DIST, defaultPage))).toString();
  // Serve static files as is:
  app.get('*.*', express.static(DIST));
  // Serve defaultContent otherwise:
  app.get('*', (_, res) => res.send(defaultContent));
  // Start the express server:
  const server: any = await (new Promise((resolve, reject) => {
    const s = app.listen(PORT, (e: any) => e ? reject(e) : resolve(s));
  }));

  console.log(`Started prerender server ${HOST}`);
  const browser = await puppeteer.launch();
  console.log(`Started prerender browser`);

  const page = await browser.newPage();
  page.setViewport({width: 1200, height: 900});
  do {
    const p = todoPages[0];
    await page.goto(`${HOST}/${p}`);

    // Getting the html content after the page finished rendering:
    const file = join(DIST, p + '.html');
    const result: string = await page.evaluate(() => document.documentElement.outerHTML);
    let content = replaceRoot(ELM, defaultContent, result, file);
    content = replaceMeta(content, result, file);
    const dir = dirname(file);
    if (!(await exists(dir)))
      await mkdir(dir);
    await writeFile(file, content);
    console.log(`Rendered: ${file}`);

    // Compute new todoPages & donePages:
    donePages = [...donePages, p];
    todoPages = difference(
      uniq(todoPages.concat(result.match(/href="\/[\/\w\d\-]*"/g)!.map((s: string) => s.match(/\/([\/\w\d\-]*[\w\d\-])/)![1]))),
      donePages
    );
  } while (todoPages.length !== 0);

  // Closes browser & server:
  browser.close();
  server.close();
}

/**
 * Replace the bootstrap component with the fully rendered bootstrap component,
 * but leave all other content on the page untouched. (Thus, don't render the
 * styles that angular added to the page for components, keep the same doctype
 * declaration, etc.)
 * 
 * @param bootstrapElement The bootstrap element
 * @param org The original html of the page
 * @param dest The prerendered page after Angular has rendered all components
 * @param file The filename of the html file that is being created (used for error messages)
 */
function replaceRoot(bootstrapElement: string, org: string, dest: string, file: string): string {
  let orgStartIndex = org.indexOf('<' + bootstrapElement + '>');
  let orgEndIndex = org.indexOf('</' + bootstrapElement + '>', orgStartIndex + 1);
  if (orgStartIndex === -1 || orgEndIndex === -1)
    throw new Error('Could not find ' + bootstrapElement + ' in ' + defaultPage);
  let destStartIndex = dest.indexOf('<' + bootstrapElement + ' ng-version=');
  let destEndIndex = dest.indexOf('</' + bootstrapElement + '>', destStartIndex + 1);
  if (destStartIndex === -1 || destEndIndex === -1)
    throw new Error('Could not find ' + bootstrapElement + ' in ' + file);
  return org.substring(0, orgStartIndex)
    + dest.substring(destStartIndex, destEndIndex)
    + org.substring(orgEndIndex);
}

/**
 * Replace the meta information that needs to be retained from the prerendered
 * page
 * 
 * @param org The html to use as source
 * @param dest The html that contains the required metadata
 * @param file The filename of the html file that is being created (used for error messages)
 */
function replaceMeta(org: string, dest: string, file: string): string {
  let orgStartIndex = org.indexOf('ng-prerender:start');
  let orgEndIndex = org.indexOf('ng-prerender:end', orgStartIndex + 1);
  if (orgStartIndex === -1 || orgEndIndex === -1)
    throw new Error('Could not find meta tags in ' + file);
  let destStartIndex = dest.indexOf('ng-prerender:start');
  let destEndIndex = dest.indexOf('ng-prerender:end', destStartIndex + 1);
  if (destStartIndex === -1 || destEndIndex === -1)
    throw new Error('Could not find meta tags in ' + file);
  return org.substring(0, orgStartIndex)
    + dest.substring(destStartIndex, destEndIndex)
    + org.substring(orgEndIndex);
}

main()
  .then(() => console.log('Done!'))
  .catch(err => {
    console.error('Error: ', err);
    process.exit(1);
  });
