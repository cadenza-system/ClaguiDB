import { IPersonRepository } from '@/domain/person/person.repository.interface';
import { IPieceRepository } from '@/domain/piece/piece.repository.interface';
import { ITagRepository } from '@/domain/tag/tag.repository.interface';
import { IYoutubeVideoRepository } from '@/domain/youtube/youtube-video.repository.interface';

export const createMockPersonRepository = (): jest.Mocked<IPersonRepository> => ({
  findById: jest.fn(),
  search: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  addName: jest.fn(),
  removeName: jest.fn(),
});

export const createMockPieceRepository = (): jest.Mocked<IPieceRepository> => ({
  findById: jest.fn(),
  findByIdWithRelations: jest.fn(),
  search: jest.fn(),
  findByComposerId: jest.fn(),
  findByArrangerId: jest.fn(),
  findChildPieces: jest.fn(),
  findRecent: jest.fn(),
  findPopular: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  addName: jest.fn(),
  removeName: jest.fn(),
  addTag: jest.fn(),
  removeTag: jest.fn(),
});

export const createMockTagRepository = (): jest.Mocked<ITagRepository> => ({
  findById: jest.fn(),
  findByName: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
});

export const createMockYoutubeVideoRepository = (): jest.Mocked<IYoutubeVideoRepository> => ({
  findById: jest.fn(),
  findByPieceId: jest.fn(),
  findPending: jest.fn(),
  create: jest.fn(),
  approve: jest.fn(),
  reject: jest.fn(),
  delete: jest.fn(),
});

export const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: '2025-12-31',
};

export const mockPrisma = {
  person: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  piece: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  tag: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  youtubeVideo: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  favorite: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    count: jest.fn(),
  },
};
