import { postAPIModel } from './ReqAPIModel';

const getUserCredibilityScore = async (uid) => {
  return await postAPIModel('/api/user-profile/get-credibility-score', { uid });
};

export { getUserCredibilityScore };
