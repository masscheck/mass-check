import { SchemaDefinitionProperty } from 'mongoose';

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
  jurorsId: string[];
  forfeitedId: string[];
  wipId: [
    { _id: string; startedOn?: SchemaDefinitionProperty<DateConstructor> }
  ];
  eachStageRequiredUserNum: number;
  totalUserHadParticipants: number;
  submitBy: string;
  submitTime: SchemaDefinitionProperty<DateConstructor>;
  trustIndex: number;
  lastAnalysedTime: SchemaDefinitionProperty<DateConstructor>;
}
