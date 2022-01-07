interface TrustIndexInterface {
  credibilityScore: number;
  voteIsReal: boolean;
}

const calculateTrustIndex = (data: TrustIndexInterface[]) => {
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

  return trustIndex;
};

export { calculateTrustIndex, TrustIndexInterface };
