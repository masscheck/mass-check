import mongoose from 'mongoose';

import AccountInterface from '../db-interface/account.interface';

const { Schema, model } = mongoose;

const accountSchema = new Schema<AccountInterface>({
  _id: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  xpxAddress: {
    type: String,
  },
  userCredibilityScore: {
    type: Number,
    required: true,
    default: 50,
  },
  submittedTweet: [
    // tweet user submit using extension
    {
      type: String,
    },
  ],
  wipTweets: [
    {
      tweetId: {
        type: String,
      },
      workType: {
        type: String,
      },
      startedOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  investigatedTweets: [
    {
      _id: {
        type: String,
        ref: 'Tweets',
      },
      xpxReward: {
        type: Number,
      },
      credibilityScoreReward: {
        type: Number,
      },
      submittedOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  verifiedTweets: [
    {
      _id: {
        type: String,
        ref: 'Tweets',
      },
      xpxReward: {
        type: Number,
        default: null,
      },
      credibilityScoreReward: {
        type: Number,
        default: null,
      },
      submittedOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  forfeitedTweets: [
    {
      _id: {
        type: String,
        ref: 'Tweets',
      },
      xpxReward: {
        type: Number,
      },
      credibilityScoreReward: {
        type: Number,
      },
      submittedOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default model<AccountInterface>('Accounts', accountSchema);
