import validator from 'html-validator';
import { join } from "path";

export class HTMLValidatorWrapper {
  private currentDateTime = new Date().toISOString();
  private reportFolder = join(process.cwd(), `reports/htmlValidator/${this.currentDateTime}`);

  async auditSite(): Promise<void> {

    const options = {
      url: 'https://www.jobrad.org/',
      format: 'text'
    }

    try {
      const result = await validator(options)
      console.log(result)
    } catch (error) {
      console.error(error)
    }


  }

}








