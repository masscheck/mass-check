export class TweetModel {
  tweetId: string;
  authorName: string;
  authorTag: string;
  content: string;
  submitBy: string;
  submitTime: Date;
  aiScore?: number;
  stage: string;
  investigatedReportIdList: [];
}
