import { ApprovalStatus } from './youtube-video.entity';

export interface CreateYoutubeVideoInput {
  pieceId: number;
  url: string;
  createdByUserId: number;
}

export interface YoutubeVideoSearchCriteria {
  pieceId?: number;
  approvalStatus?: ApprovalStatus;
}
