import { SchemaDefinitionProperty } from 'mongoose';

export default interface AccountInterface {
  _id: string;
  displayName: string;
  email: string;
  xpxAddress: string;
  userCredibilityScore: number;
  submittedTweet: string[];
  wipTweets: [
    {
      tweetId: string;
      workType: string;
      startedOn: SchemaDefinitionProperty<DateConstructor>;
    }
  ]
  investigatedTweets: [
    {
      _id: string;
      xpxReward: number;
      credibilityScoreReward: number;
      submittedOn: SchemaDefinitionProperty<DateConstructor>;
    }
  ];
  verifiedTweets: [
    {
      _id: string;
      xpxReward: number;
      credibilityScoreReward: number;
      votedCorrectly: boolean;
      submittedOn: SchemaDefinitionProperty<DateConstructor>;
    }
  ];
}
