import React from 'react';

import './Tweet.scss';

interface TweetInfo {
  name: string;
  tag: string;
  content: string;
  submitBy: string;
  submitTime: Date;
  authenticityScore: number;
  stage: string;
  currentPhaseTotalPplList: string[];
  maxPhaseTotalPpl: number;
}

const Tweet: React.FC<TweetInfo> = ({
  name,
  tag,
  content,
  submitBy,
  submitTime,
  authenticityScore,
  stage,
  currentPhaseTotalPplList,
  maxPhaseTotalPpl,
}) => {
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.toLocaleString('en-US', { day: 'numeric' });
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.toLocaleString('en-US', { year: 'numeric' });

    return `${day} ${month} ${year}`;
  };

  return (
    <div className='tweet'>
      <div className='tweet__handle'>
        <div>
          <span className='tweet__handle__name'>{name}</span>{' '}
          <span className='tweet__handle__tag'>{tag}</span>
        </div>
      </div>
      <div className='tweet__content'>{content}</div>
      <div className='tweet__detail'>
        <div className='tweet__detail__submit-by'>
          Submitted by {submitBy} on {formatDate(submitTime)}
        </div>
        <div>
          <span className='tweet__detail__authenticity-score'>
            {authenticityScore
              ? `${authenticityScore}\% Real`
              : 'AI Predicting...'}
          </span>
          <span className='tweet__detail__stage'>
            {` | ${stage}`}
            {stage !== 'Completed' &&
              ` (${currentPhaseTotalPplList.length}/${maxPhaseTotalPpl})`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
