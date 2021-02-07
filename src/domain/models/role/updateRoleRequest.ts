export class UpdateRoleRequest {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly abbreviation: string,
    public readonly level: number,
  ) {}
}
