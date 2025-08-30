import puppeteer from 'puppeteer'
import { defineUnlighthouseConfig } from 'unlighthouse/config'

export default defineUnlighthouseConfig({
  puppeteerOptions: {
    executablePath: puppeteer.executablePath(),
    headless: true,
  },
  chrome: {
    useSystem: false,
    useDownloadFallback: false,
  },
})

