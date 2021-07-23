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
}

const Tweet: React.FC<TweetInfo> = (props: any) => {
  return (
    <div className='tweet'>
      <div className='tweet__handle'>
        <text>
          <span className='tweet__handle__name'>{props.name}</span>{' '}
          <span className='tweet__handle__tag'>{props.tag}</span>
        </text>
      </div>
      <div className='tweet__content'>{props.content}</div>
      <div className='tweet__detail'>
        <div className='tweet__detail__submit-by'>
          Submitted by {props.submitBy} {props.submitTime.toString()}
        </div>
        <div>
          <span className='tweet__detail__authenticity-score'>
            {props.authenticityScore}% Real
          </span>{' '}
          <span className='tweet__detail__stage'>| {props.stage}</span>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
