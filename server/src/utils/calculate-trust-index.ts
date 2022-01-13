interface TrustIndexInterface {
  credibilityScore: number;
  voteIsReal: boolean;
}

const calculateTrustIndex = (data: TrustIndexInterface[], aiScore: number) => {
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

  return trustIndex * 0.7 + aiScore * 0.3;
};

export { calculateTrustIndex, TrustIndexInterface };
