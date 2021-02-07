import { USER_STATUS } from "src/common/enum/userEnum";

export interface UserReponse {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly hashPassword: string;
  readonly status: USER_STATUS;
  readonly roleId: number;
  readonly priorLoginAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
