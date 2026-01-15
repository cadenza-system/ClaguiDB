import { YoutubeVideo } from './youtube-video.entity';
import {
  CreateYoutubeVideoInput,
  YoutubeVideoSearchCriteria,
} from './youtube-video.types';

export interface IYoutubeVideoRepository {
  findById(id: number): Promise<YoutubeVideo | null>;
  findByPieceId(pieceId: number, onlyApproved?: boolean): Promise<YoutubeVideo[]>;
  findPending(): Promise<YoutubeVideo[]>;
  create(input: CreateYoutubeVideoInput): Promise<YoutubeVideo>;
  approve(id: number, adminId: number): Promise<YoutubeVideo>;
  reject(id: number, adminId: number): Promise<YoutubeVideo>;
  delete(id: number, deletedByUserId: number): Promise<void>;
}
