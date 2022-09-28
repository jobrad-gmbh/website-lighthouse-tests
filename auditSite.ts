import { LightHouseWrapper } from "./lighthouse/lighthouseWrapper";
import { HTMLValidatorWrapper } from './htmlValidator/htmlValidatorWrapper';

let lighthouse = new LightHouseWrapper();
let htmlValidator = new HTMLValidatorWrapper();
(async () => {
    await lighthouse.auditSite();
    await htmlValidator.auditSite();
})();
