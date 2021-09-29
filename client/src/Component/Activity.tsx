import Tweet from '../Component/Tweet';
import './Activity.scss';

const Activity = ({ activityList }) => {
  return (
    <div className='activity-layout'>
      <div className='activity-title'>
        <div>Activity</div>
      </div>
      <div className='activity-header'>
        <div>News</div>
        <div className='details'>Role</div>
        <div className='details'>Credibility</div>
        <div className='details'>XPX</div>
      </div>

      <div className='activity-content'>
        {activityList.map((tweet, index) => {
          const {
            _id,
            curAnalysedPhase,
            submitBy,
            submitTime,
            aiScore,
            authorName,
            authorTag,
            content,
            xpxReward,
            credibilityScoreReward,
            role,
            eachStageRequiredUserNum,
            investigatorsId,
            jurorsId,
          } = tweet;

          let credibilityScoreRewardText = 'PENDING';
          let xpxRewardText = 'PENDING';

          if (credibilityScoreReward !== null) {
            console.log('not undefined');
            credibilityScoreRewardText = credibilityScoreReward >= 0 ? '+' : '';
            credibilityScoreRewardText += credibilityScoreReward;
          }

          if (xpxReward !== null) {
            xpxRewardText = xpxReward;
          }

          return (
            <div className='activity-item-container' key={index}>
              <div className='activity-tweet'>
                <Tweet
                  name={authorName}
                  tag={authorTag}
                  content={content}
                  submitBy={submitBy}
                  submitTime={submitTime}
                  authenticityScore={aiScore}
                  stage={curAnalysedPhase}
                  maxPhaseTotalPpl={eachStageRequiredUserNum}
                  currentPhaseTotalPplList={
                    curAnalysedPhase === 'Investigating'
                      ? investigatorsId
                      : jurorsId
                  }
                />
              </div>
              <div className='activity-details'>
                <div className='activity-role'>{role}</div>
                <div
                  className={`activity-credibility ${
                    credibilityScoreReward <= 0 &&
                    'deduct' &&
                    credibilityScoreRewardText !== 'PENDING'
                  }`}
                >
                  {credibilityScoreRewardText}
                </div>
                <div
                  className={`activity-xpx ${
                    xpxReward <= 0 && 'deduct' && xpxRewardText !== 'PENDING'
                  }`}
                >
                  {xpxRewardText}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Activity;
