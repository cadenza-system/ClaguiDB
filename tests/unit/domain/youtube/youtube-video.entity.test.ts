import { YoutubeVideo } from '@/domain/youtube/youtube-video.entity';
import { createYoutubeVideo } from '../../../helpers/factories';

describe('YoutubeVideo Entity', () => {
  describe('isApproved', () => {
    it('approvalStatusがapprovedの場合はtrueを返す', () => {
      const video = createYoutubeVideo({ approvalStatus: 'approved' });

      expect(video.isApproved()).toBe(true);
    });

    it('approvalStatusがpendingの場合はfalseを返す', () => {
      const video = createYoutubeVideo({ approvalStatus: 'pending' });

      expect(video.isApproved()).toBe(false);
    });

    it('approvalStatusがrejectedの場合はfalseを返す', () => {
      const video = createYoutubeVideo({ approvalStatus: 'rejected' });

      expect(video.isApproved()).toBe(false);
    });
  });

  describe('isPending', () => {
    it('approvalStatusがpendingの場合はtrueを返す', () => {
      const video = createYoutubeVideo({ approvalStatus: 'pending' });

      expect(video.isPending()).toBe(true);
    });

    it('approvalStatusがapprovedの場合はfalseを返す', () => {
      const video = createYoutubeVideo({ approvalStatus: 'approved' });

      expect(video.isPending()).toBe(false);
    });

    it('approvalStatusがrejectedの場合はfalseを返す', () => {
      const video = createYoutubeVideo({ approvalStatus: 'rejected' });

      expect(video.isPending()).toBe(false);
    });
  });

  describe('getVideoId', () => {
    it('youtube.comのwatch URLからビデオIDを抽出する', () => {
      const video = createYoutubeVideo({
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      });

      expect(video.getVideoId()).toBe('dQw4w9WgXcQ');
    });

    it('youtu.beの短縮URLからビデオIDを抽出する', () => {
      const video = createYoutubeVideo({
        url: 'https://youtu.be/dQw4w9WgXcQ',
      });

      expect(video.getVideoId()).toBe('dQw4w9WgXcQ');
    });

    it('無効なURLの場合はnullを返す', () => {
      const video = createYoutubeVideo({
        url: 'https://example.com/video',
      });

      expect(video.getVideoId()).toBeNull();
    });

    it('空のURLの場合はnullを返す', () => {
      const video = createYoutubeVideo({ url: '' });

      expect(video.getVideoId()).toBeNull();
    });
  });

  describe('getThumbnailUrl', () => {
    it('有効なビデオIDがある場合、サムネイルURLを返す', () => {
      const video = createYoutubeVideo({
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      });

      expect(video.getThumbnailUrl()).toBe(
        'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
      );
    });

    it('無効なURLの場合はnullを返す', () => {
      const video = createYoutubeVideo({
        url: 'https://example.com/video',
      });

      expect(video.getThumbnailUrl()).toBeNull();
    });
  });

  describe('toSerializable', () => {
    it('シリアライズ可能なオブジェクトを返す', () => {
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const video = createYoutubeVideo({
        id: 1,
        pieceId: 10,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        approvalStatus: 'approved',
        createdAt,
        createdByUserId: 1,
      });

      const serialized = video.toSerializable();

      expect(serialized).toEqual({
        id: 1,
        pieceId: 10,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        approvalStatus: 'approved',
        createdAt: '2024-01-01T00:00:00.000Z',
        createdByUserId: 1,
      });
    });

    it('createdAtがISO文字列に変換される', () => {
      const video = createYoutubeVideo({
        createdAt: new Date('2024-06-15T12:30:00.000Z'),
      });

      const serialized = video.toSerializable();

      expect(typeof serialized.createdAt).toBe('string');
      expect(serialized.createdAt).toBe('2024-06-15T12:30:00.000Z');
    });
  });
});
