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
  jurorsId: [{ _id: string; isTweetReal: boolean; xpxAddress: string }];
  forfeitedId: string[];
  wipId: [
    { _id: string; startedOn?: SchemaDefinitionProperty<DateConstructor> }
  ];
  eachStageRequiredUserNum: number;
  totalUserHadParticipants: number;
  submitBy: string;
  submitByUid: string;
  submitTime: SchemaDefinitionProperty<DateConstructor>;
  trustIndex: number;
  lastAnalysedTime: SchemaDefinitionProperty<DateConstructor>;
}
