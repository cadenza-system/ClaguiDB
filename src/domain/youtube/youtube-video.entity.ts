export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface SerializedYoutubeVideo {
  id: number;
  pieceId: number;
  url: string;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  createdByUserId: number;
}

export class YoutubeVideo {
  constructor(
    public readonly id: number,
    public readonly pieceId: number,
    public readonly url: string,
    public readonly approvalStatus: ApprovalStatus,
    public readonly createdAt: Date,
    public readonly createdByUserId: number
  ) {}

  toSerializable(): SerializedYoutubeVideo {
    return {
      id: this.id,
      pieceId: this.pieceId,
      url: this.url,
      approvalStatus: this.approvalStatus,
      createdAt: this.createdAt.toISOString(),
      createdByUserId: this.createdByUserId,
    };
  }

  isApproved(): boolean {
    return this.approvalStatus === 'approved';
  }

  isPending(): boolean {
    return this.approvalStatus === 'pending';
  }

  getVideoId(): string | null {
    const match = this.url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  }

  getThumbnailUrl(): string | null {
    const videoId = this.getVideoId();
    return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
  }
}
