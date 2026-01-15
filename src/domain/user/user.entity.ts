export class User {
  constructor(
    public readonly id: number,
    public readonly googleId: string,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly isPremium: boolean,
    public readonly isAdmin: boolean = false
  ) {}

  canEdit(): boolean {
    return true;
  }

  canApprove(): boolean {
    return this.isAdmin;
  }

  hasAdsDisabled(): boolean {
    return this.isPremium;
  }
}
