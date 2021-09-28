export class TweetModel {
  _id: string;
  authorName: string;
  authorTag: string;
  content: string;
  submitBy: string;
  submitTime: Date;
  aiScore?: number;
  curAnalysedPhase: string;
  investigatedReportIdList: [];
  investigatorsId: string[];
  jurorsId: string[];
  eachStageRequiredUserNum: number;
}
