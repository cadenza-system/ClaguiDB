import { prisma } from '../database/prisma';
import { ITagRepository } from '@/domain/tag/tag.repository.interface';
import { Tag } from '@/domain/tag/tag.entity';
import { TagId, CreateTagInput } from '@/domain/tag/tag.types';

type TagModel = {
  id: number;
  name: string;
  createdAt: Date;
  createdByUserId: number;
};

export class TagRepository implements ITagRepository {
  async findById(id: TagId): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({
      where: { id, deletedAt: null },
    });

    if (!tag) return null;
    return this.toDomain(tag);
  }

  async findByName(name: string): Promise<Tag | null> {
    const tag = await prisma.tag.findFirst({
      where: { name, deletedAt: null },
    });

    if (!tag) return null;
    return this.toDomain(tag);
  }

  async findAll(): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });

    return tags.map((t: TagModel) => this.toDomain(t));
  }

  async create(input: CreateTagInput): Promise<Tag> {
    const tag = await prisma.tag.create({
      data: {
        name: input.name,
        createdByUserId: input.createdByUserId,
      },
    });

    return this.toDomain(tag);
  }

  async delete(id: TagId, deletedByUserId: number): Promise<void> {
    await prisma.tag.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedByUserId,
      },
    });
  }

  private toDomain(prismaModel: TagModel): Tag {
    return new Tag(
      prismaModel.id,
      prismaModel.name,
      prismaModel.createdAt,
      prismaModel.createdByUserId
    );
  }
}
