import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import Tweet from '../../Component/Tweet';
import UploadBox from '../../Component/UploadBox';
import CountDownTimer from '../../Component/CountdownTimer';
import { storage } from '../../Util/Firebase/FirebaseConfig';
import { useNotification } from '../../Context/NotificationContext';

import './InvestigateStepFour.scss';
import { RouteConstant } from '../../Util/Constant/RouteConstant';
import { useInvestigation } from '../../Context/InvestigationContext';
import { LocalStorageEnum } from '../../Util/Constant/LocalStorageEnum';
import { submitReport } from '../../Util/API/InvestigationAPI';

window.onbeforeunload = function () {
  return window.alert('you can not refresh the page');
};

const InvestigateStepFour: React.FC = () => {
  const history = useHistory();
  const [file, setFile] = useState<File>();
  const { errorToastPersistent } = useNotification();
  const uid = localStorage.getItem(LocalStorageEnum.UID);
  const {
    tweetModel: {
      tweetId,
      stage,
      submitBy,
      submitTime,
      aiScore,
      authorName,
      authorTag,
      content,
    },
  } = useInvestigation();

  const genUploadDateTime = () => {
    const date = new Date();
    const day = date.toLocaleString('en-US', { day: 'numeric' });
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.toLocaleString('en-US', { year: 'numeric' });
    const hour = date.toLocaleString('en-US', { hour: 'numeric' });
    const minute = date.toLocaleString('en-US', { minute: 'numeric' });
    const seconds = date.toLocaleString('en-US', { second: 'numeric' });

    return `${day}_${month}_${year}_${hour}${minute}${seconds}`;
  };

  const onNext = async () => {
    const storageRef = storage.ref();

    // FileName: UID_Tweet ID_DateTime_File Name
    const fileName = `${uid}_${tweetId}_${genUploadDateTime()}_${file.name}`;
    const fileRef = storageRef.child(fileName);

    try {
      const res = await fileRef.put(file);

      await submitReport(uid, tweetId, fileName);

      console.log(res);
      history.push(RouteConstant.SECURE_INVESTIGATE_STEP_FIVE);
    } catch (err) {
      console.log(err);
      errorToastPersistent('Upload Failed! Please Try Again.');
    }
  };

  return (
    <div className='investigate-step-four'>
      <div className='investigate-step-four__timer'>
        Timer:&nbsp;
        <CountDownTimer
          hoursMinSecs={{ hours: 1, minutes: 0, seconds: 0 }}
          isHour={true}
        />
      </div>

      <div className='investigate-step-four__tweet'>
        <Tweet
          name={authorName}
          tag={authorTag}
          content={content}
          submitBy={submitBy}
          submitTime={submitTime}
          authenticityScore={aiScore}
          stage={stage}
        />
      </div>

      <br />

      <div className='investigate-step-four__description'>
        Find evidence to prove or disprove the news tweet above.
        <br />
        Compile your findings into a PDF document to submit below.
        <br />
        It will be read by the jury for their final verdict.
      </div>

      <div className='investigate-step-four__download'>
        Please download the
        <Link
          to='/Investigation_Report_Template.docx'
          target='_blank'
          className='investigate-step-four__download__link'
          download
        >
          {` report template here `}
        </Link>
        and add your findings directly into it.
      </div>

      <br />

      <div className='investigate-step-four__upload-box'>
        <UploadBox onSetFile={setFile} />
      </div>

      <br />

      <button
        className='investigate-step-four__button'
        onClick={onNext}
        disabled={!!!file}
      >
        Submit
      </button>
    </div>
  );
};

export default InvestigateStepFour;
