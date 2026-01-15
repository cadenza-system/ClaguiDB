import { prisma } from '../database/prisma';
import { IUserRepository } from '@/domain/user/user.repository.interface';
import { User } from '@/domain/user/user.entity';
import { UserId, CreateUserInput, UpdateUserInput } from '@/domain/user/user.types';

export class UserRepository implements IUserRepository {
  async findById(id: UserId): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { admin: true },
    });

    if (!user) return null;
    return this.toDomain(user);
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { googleId },
      include: { admin: true },
    });

    if (!user) return null;
    return this.toDomain(user);
  }

  async create(input: CreateUserInput): Promise<User> {
    const user = await prisma.user.create({
      data: {
        googleId: input.googleId,
        email: input.email,
        name: input.name,
      },
      include: { admin: true },
    });

    return this.toDomain(user);
  }

  async update(id: UserId, input: UpdateUserInput): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: input.name,
        isPremium: input.isPremium,
        stripeCustomerId: input.stripeCustomerId,
      },
      include: { admin: true },
    });

    return this.toDomain(user);
  }

  async isAdmin(userId: UserId): Promise<boolean> {
    const admin = await prisma.admin.findUnique({
      where: { userId },
    });
    return admin !== null;
  }

  private toDomain(prismaModel: {
    id: number;
    googleId: string;
    email: string;
    name: string;
    createdAt: Date;
    isPremium: boolean;
    admin: { id: number } | null;
  }): User {
    return new User(
      prismaModel.id,
      prismaModel.googleId,
      prismaModel.email,
      prismaModel.name,
      prismaModel.createdAt,
      prismaModel.isPremium,
      prismaModel.admin !== null
    );
  }
}
