import { TweetModel } from './TweetModel';

export class ActivityModel extends TweetModel {
  role: string;
  credibilityScoreReward: number;
  xpxReward: number;
}
