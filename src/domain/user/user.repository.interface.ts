import { User } from './user.entity';
import { UserId, CreateUserInput, UpdateUserInput } from './user.types';

export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  update(id: UserId, input: UpdateUserInput): Promise<User>;
  isAdmin(userId: UserId): Promise<boolean>;
}
