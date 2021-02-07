import { TYPES } from "injection/types";
import { Container } from "inversify";
import { CronJob } from "src/cron-jobs/cronJob";

export class InitCronJob {
  constructor() {}

  public static init(appContainer: Container) {
    // appContainer.get<CronJob>(TYPES.ExpiredLeadCronJob);
  }
}
