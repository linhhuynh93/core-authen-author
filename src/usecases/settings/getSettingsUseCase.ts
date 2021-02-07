import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { SETTING_KEY } from "src/common/enum/settingsKeyEnum";
import { SettingsRepository } from "src/domain/repositories/settingsRepository";
import { SettingsViewResponse } from "src/view-models/settings/settingsViewResponse";
import { settings } from "cluster";

export interface GetSettingsUseCase {
  execute(key: SETTING_KEY): Promise<SettingsViewResponse>;
}

@injectable()
export class GetSettingsUseCaseImpl implements GetSettingsUseCase {
  constructor(
    @inject(TYPES.SettingsRepository)
    private readonly settingsRepository: SettingsRepository
  ) {}

  public async execute(key: SETTING_KEY): Promise<SettingsViewResponse> {
    return this.settingsRepository.getByKey(key);
  }
}
