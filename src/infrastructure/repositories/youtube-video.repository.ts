import { prisma } from '../database/prisma';
import { IYoutubeVideoRepository } from '@/domain/youtube/youtube-video.repository.interface';
import { YoutubeVideo, ApprovalStatus } from '@/domain/youtube/youtube-video.entity';
import { CreateYoutubeVideoInput } from '@/domain/youtube/youtube-video.types';

export class YoutubeVideoRepository implements IYoutubeVideoRepository {
  async findById(id: number): Promise<YoutubeVideo | null> {
    const video = await prisma.youtubeVideo.findUnique({
      where: { id, deletedAt: null },
    });

    if (!video) return null;
    return this.toDomain(video);
  }

  async findByPieceId(
    pieceId: number,
    onlyApproved: boolean = true
  ): Promise<YoutubeVideo[]> {
    const videos = await prisma.youtubeVideo.findMany({
      where: {
        pieceId,
        deletedAt: null,
        ...(onlyApproved && { approvalStatus: 'approved' }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return videos.map((v) => this.toDomain(v));
  }

  async findPending(): Promise<YoutubeVideo[]> {
    const videos = await prisma.youtubeVideo.findMany({
      where: { approvalStatus: 'pending', deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });

    return videos.map((v) => this.toDomain(v));
  }

  async create(input: CreateYoutubeVideoInput): Promise<YoutubeVideo> {
    const video = await prisma.youtubeVideo.create({
      data: {
        pieceId: input.pieceId,
        url: input.url,
        createdByUserId: input.createdByUserId,
      },
    });

    return this.toDomain(video);
  }

  async approve(id: number, adminId: number): Promise<YoutubeVideo> {
    const video = await prisma.youtubeVideo.update({
      where: { id },
      data: {
        approvalStatus: 'approved',
        approvedByAdminId: adminId,
      },
    });

    return this.toDomain(video);
  }

  async reject(id: number, adminId: number): Promise<YoutubeVideo> {
    const video = await prisma.youtubeVideo.update({
      where: { id },
      data: {
        approvalStatus: 'rejected',
        approvedByAdminId: adminId,
      },
    });

    return this.toDomain(video);
  }

  async delete(id: number, deletedByUserId: number): Promise<void> {
    await prisma.youtubeVideo.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedByUserId,
      },
    });
  }

  private toDomain(prismaModel: {
    id: number;
    pieceId: number;
    url: string;
    approvalStatus: string;
    createdAt: Date;
    createdByUserId: number;
  }): YoutubeVideo {
    return new YoutubeVideo(
      prismaModel.id,
      prismaModel.pieceId,
      prismaModel.url,
      prismaModel.approvalStatus as ApprovalStatus,
      prismaModel.createdAt,
      prismaModel.createdByUserId
    );
  }
}
