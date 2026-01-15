import { Tag } from './tag.entity';
import { TagId, CreateTagInput } from './tag.types';

export interface ITagRepository {
  findById(id: TagId): Promise<Tag | null>;
  findByName(name: string): Promise<Tag | null>;
  findAll(): Promise<Tag[]>;
  create(input: CreateTagInput): Promise<Tag>;
  delete(id: TagId, deletedByUserId: number): Promise<void>;
}
