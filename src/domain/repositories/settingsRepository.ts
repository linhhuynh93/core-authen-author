import { SettingsModel } from "models/settings/settingsModel";
import { inject, injectable } from "inversify";
import { TYPES } from "src/injection/types";
import { SETTING_KEY } from "src/common/enum/settingsKeyEnum";
import { SettingsDbGateway } from "gateways/settingsGateway";

export interface SettingsRepository {
  getByKey(key: SETTING_KEY): Promise<SettingsModel>;
}

@injectable()
export class SettingsRepositoryImpl implements SettingsRepository {
  constructor(
    @inject(TYPES.SettingsDbGateway)
    private readonly settingsDbGateway: SettingsDbGateway
  ) {}

  public async getByKey(key: SETTING_KEY): Promise<SettingsModel> {
    const setting = await this.settingsDbGateway.getByKey(key);

    switch (key) {
      case SETTING_KEY.CL_WELCOME_ABOARD:
        const maxLead = await this.settingsDbGateway.getByKey(
          SETTING_KEY.MAX_LEAD_REQUEST
        );
        setting.value = JSON.parse(
          setting.value.replace("{upTo}", maxLead.value)
        );
        break;
      case SETTING_KEY.IC_WELCOME_ABOARD:
        setting.value = JSON.parse(setting.value);
        break;
    }
    return setting;
  }
}
