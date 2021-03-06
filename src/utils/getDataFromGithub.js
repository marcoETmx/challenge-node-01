const puppeteer = require('puppeteer');
const fs = require('fs');
const getTime = require('./getTime');
const postToSlack = require('./postToSlack');

const imagesDir = './src/images';

const URL_GITHUB = 'https://github.com/';

const getDataFromGithub = async (githubUser) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }

  await page.goto(`${URL_GITHUB}${githubUser}`);
  await page.screenshot({ path: `src/images/${getTime()}-${githubUser}.png` });

  const githubCounter = await page.evaluate(() => document.getElementsByClassName('Counter')[0].innerText);
  const githubUserPhoto = await page.evaluate(() => document.getElementsByClassName('avatar-before-user-status')[0].src);
  postToSlack(githubUser, githubUserPhoto, githubCounter);
  await browser.close();
};

exports.getDataFromGithub = getDataFromGithub;
