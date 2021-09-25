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
          } = tweet;

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
                />
              </div>
              <div className='activity-details'>
                <div className='activity-role'>{role}</div>
                <div className='activity-credibility'>
                  {credibilityScoreReward >= 0 ? '+' : '-'}
                  {credibilityScoreReward}
                </div>
                <div className='activity-xpx'>{xpxReward}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Activity;
