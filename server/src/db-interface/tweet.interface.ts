import { SchemaDefinitionProperty} from 'mongoose'

export default interface TweetInterface {
  _id: string;
  aiScore: number;
  authorName: string;
  authorTag: string;
  content: string;
  curAnalysedPhase: string;
  crowdVotedResult: boolean;
  investigatedReportIdList: string[];
  investigatorsId: string[];
  jurorsId:  string[];
  wipId:  string[];
  eachStageRequiredUserNum: number;
  totalUserHadParticipants: number;
  submitBy: string;
  submitTime: SchemaDefinitionProperty<DateConstructor>;
  trustIndex: number;
}
