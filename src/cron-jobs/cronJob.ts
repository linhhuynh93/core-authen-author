import { CronCommand, CronJob as Cron } from "cron";
import { injectable } from "inversify";
import { Logger } from "src/utils/logger";

@injectable()
export abstract class CronJob {
  public useCase: any;
  public logger: Logger;
  public abstract execute(): CronCommand;
  public abstract onComplete(): CronCommand;

  protected static create(
    executeTime: string,
    execute: CronCommand,
    onComplete: CronCommand,
    timeZone: string,
    useCase: any,
    logger: Logger
  ) {
    try {
      // tslint:disable-next-line: no-unused-expression
      new Cron(executeTime, execute, onComplete, true, timeZone, { useCase, logger });
    } catch (err) {
      // @TODO: handle error
      logger.error(err);
    }
  }
}
