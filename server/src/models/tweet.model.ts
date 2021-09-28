import mongoose from 'mongoose';
import { AnalysePhaseConstant } from '../constants/analyse-phase-constant';

import Tweet from '../db-interface/tweet.interface';

const { Schema, model } = mongoose;

const tweetSchema = new Schema<Tweet>({
  _id: {
    // Twitter Tweet Id
    type: String,
    required: true,
  },
  aiScore: {
    type: Number,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorTag: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  curAnalysedPhase: {
    type: String,
    default: AnalysePhaseConstant.INVESTIGATING,
  },
  crowdVotedResult: {
    type: Boolean,
  },
  investigatedReportIdList: [
    {
      type: String,
    },
  ],
  investigatorsId: [{ type: String }],
  jurorsId: [{ type: String }],
  wipId: [
    { _id: { type: String }, startedOn: { type: Date, default: Date.now } },
  ],
  forfeitedId: [{ type: String }],
  eachStageRequiredUserNum: { type: Number, default: 5 },
  totalUserHadParticipants: { type: Number, default: 0 },
  submitBy: { type: String, required: true },
  submitTime: { type: Date, default: Date.now },
  trustIndex: { type: Number },
  lastAnalysedTime: { type: Date },
});

export default model<Tweet>('Tweets', tweetSchema);
