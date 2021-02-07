import { TYPES } from "injection/types";
import { DatabaseTables } from "models/databaseTables";
import { Models } from "models/models";
import { inject, injectable } from "inversify";
import { SettingsModel } from "models/settings/settingsModel";
import { SETTING_KEY } from "src/common/enum/settingsKeyEnum";

export interface SettingsDbGateway {
  getByKey(key: SETTING_KEY): Promise<SettingsModel>;
}

@injectable()
export class SettingsDbGatewayImpl implements SettingsDbGateway {
  private readonly settingsDb: typeof SettingsModel;

  constructor(@inject(TYPES.Models) models: Models) {
    this.settingsDb = models.getModels()[
      DatabaseTables.TABLE_SETTINGS
    ] as typeof SettingsModel;
  }

  public async getByKey(key: SETTING_KEY): Promise<SettingsModel> {
    return this.settingsDb.findOne({
      where: { key },
      raw: true,
    });
  }
}
