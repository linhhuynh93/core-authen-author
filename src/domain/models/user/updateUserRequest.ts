export class UpdateUserRequest {
  constructor(
    public readonly id: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly roleId: number,
  ) {}
}
