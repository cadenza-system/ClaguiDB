export type UserId = number;

export interface CreateUserInput {
  googleId: string;
  email: string;
  name: string;
}

export interface UpdateUserInput {
  name?: string;
  isPremium?: boolean;
  stripeCustomerId?: string;
}
