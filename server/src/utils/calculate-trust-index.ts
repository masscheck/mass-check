import { logger } from '../middlewares/logger';

interface TrustIndexInterface {
  credibilityScore: number;
  voteIsReal: boolean;
}

const calculateTrustIndex = (data: TrustIndexInterface[], aiScore: number) => {
  logger.verbose('Trust Index - Started');
  logger.verbose('User credibility score + vote', data);

  let totalCredibilityScore = 0;
  let trustIndex = 0;

  data.map((element) => {
    totalCredibilityScore += element.credibilityScore;
  });

  data.map((element) => {
    let voteValue = element.voteIsReal ? 1 : 0;
    trustIndex +=
      voteValue * (element.credibilityScore / totalCredibilityScore);
  });

  logger.verbose('--- Result ---');
  logger.verbose('User evaluation: ', totalCredibilityScore);
  logger.verbose('AI Score: ', aiScore);
  logger.verbose('Trust Index: ', trustIndex);
  logger.verbose('Trust Index - Ended');

  return trustIndex * 0.7 + aiScore * 0.3;
};

export { calculateTrustIndex, TrustIndexInterface };
