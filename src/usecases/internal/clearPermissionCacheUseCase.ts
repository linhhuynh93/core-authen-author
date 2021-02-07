import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { RoleRepository } from "src/domain/repositories/roleRepository";

export interface ClearPermissionCacheUseCase {
  execute(): Promise<void>;
}

@injectable()
export class ClearPermissionCacheUseCaseImpl implements ClearPermissionCacheUseCase {
  constructor(
    @inject(TYPES.RoleRepository) private readonly roleRepository: RoleRepository
  ) { }

  public async execute(): Promise<void> {
    await this.roleRepository.clearCache();
  }
}
