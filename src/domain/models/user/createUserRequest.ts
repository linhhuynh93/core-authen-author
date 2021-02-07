import { USER_STATUS } from "src/common/enum/userEnum";

export class CreateUserRequest {
  constructor(
    public readonly email: string,
    public readonly hashPassword: string,
    public readonly roleId: number,
    public readonly status: USER_STATUS
  ) {}
}
