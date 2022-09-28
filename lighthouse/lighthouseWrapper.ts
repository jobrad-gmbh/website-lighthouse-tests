import { join } from "path";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { launch } from "chrome-launcher";
import urlsToTest from "../resources/urls.json";
import lighthouse from "lighthouse";

enum REPORT_OUTPUT_TYPE {
  html = 'html',
  json = 'json'
}

const reportOutputType: REPORT_OUTPUT_TYPE = REPORT_OUTPUT_TYPE.html;

export class LightHouseWrapper {
  private currentDateTime = new Date().toISOString();
  private reportFolder = join(process.cwd(), `reports/lighthouse/${this.currentDateTime}`);
  private chrome: any;

  async auditSite(): Promise<void> {
    await this.setup();
    let urls = await this.getUrls();
    let options = await this.getBrowserConfig();
    await this.triggerLightHouseAuditAndGetResults(urls, options);
    await this.teardown();
  }

  async triggerLightHouseAuditAndGetResults(
    testSource: {}[],
    options: any
  ): Promise<void> {
    for (let index = 0; index < testSource.length; index++) {
      let runnerResult = await lighthouse(testSource[index]["url"], options);
      let reportHtml = await runnerResult.report;
      await writeFileSync(
        `${this.reportFolder}/${testSource[index]["pageName"].trim()}.${reportOutputType}`,
        reportHtml
      );
    }
  }

  async setup(): Promise<void> {
    await this.makeReportDirectory();
    this.chrome = await launch({ chromeFlags: ["--headless"] });
  }

  async getUrls(): Promise<{}[]> {
    return urlsToTest.URLS;
  }

  async makeReportDirectory(): Promise<void> {
    try {
      if (!(await existsSync(`${this.reportFolder}`))) {
        await mkdirSync(`${this.reportFolder}`);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async teardown(): Promise<void> {
    await this.chrome.kill();
  }

  async getBrowserConfig(): Promise<any> {
    const options = {
      logLevel: "info",
      output: reportOutputType,
      onlyCategories: ['accessibility'],
      port: this.chrome.port,
    };
    return options;
  }
}