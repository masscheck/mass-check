import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import Tweet from '../../Component/Tweet';
import UploadBox from '../../Component/UploadBox';
import CountDownTimer from '../../Component/CountdownTimer';
import { storage } from '../../Util/Firebase/FirebaseConfig';
import { useNotification } from '../../Context/NotificationContext';

import { RouteConstant } from '../../Util/Constant/RouteConstant';
import { useTweetModel } from '../../Context/InvestigationContext';
import {
  submitReport,
  systemCancelledInvestigationJob,
} from '../../Util/API/InvestigationAPI';
import { useLoadingSpinner } from '../../Context/LoadingSpinnerContext';
import { useAccountInfo } from '../../Context/AccountInfoContext';

import './InvestigateStepFour.scss';

const InvestigateStepFour: React.FC = () => {
  const history = useHistory();
  const [file, setFile] = useState<File>();
  const { errorToastPersistent } = useNotification();
  const {
    accountInfo: { uid },
  } = useAccountInfo();
  const {
    tweetModel: {
      _id,
      curAnalysedPhase,
      submitBy,
      submitTime,
      aiScore,
      authorName,
      authorTag,
      content,
    },
  } = useTweetModel();
  const { setIsLoading } = useLoadingSpinner();

  const genUploadDateTime = () => {
    const date = new Date();
    const day = date.toLocaleString('en-US', { day: 'numeric' });
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.toLocaleString('en-US', { year: 'numeric' });
    const hour = date.toLocaleString('en-US', { hour: '2-digit' });
    const minute = date.toLocaleString('en-US', { minute: 'numeric' });
    const seconds = date.toLocaleString('en-US', { second: 'numeric' });

    return `${day}_${month}_${year}_${hour}${minute}${seconds}`;
  };

  const onNext = async () => {
    const storageRef = storage.ref();
    const sanitisedFileName = file.name.replace(/ /g, '_');

    // FileName: UID_Tweet ID_DateTime_File Name
    const fileName = `${uid}_${_id}_${genUploadDateTime()}_${sanitisedFileName}`;
    const fileRef = storageRef.child(fileName);

    try {
      setIsLoading(true);
      const res = await fileRef.put(file);
      await submitReport(uid, _id, fileName);

      history.push(RouteConstant.SECURE_INVESTIGATE_STEP_FIVE);
    } catch (err) {
      console.log(err);
      errorToastPersistent('Upload Failed! Please Try Again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSystemCancelled = async () => {
    return await new Promise(async (resolve, reject) => {
      try {
        setIsLoading(true);
        const res = await systemCancelledInvestigationJob(uid, _id);
        resolve(res);
      } catch (err) {
        reject(err);
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <div className='investigate-step-four'>
      <div className='investigate-step-four__timer'>
        Timer:&nbsp;
        <CountDownTimer
          hoursMinSecs={{ hours: 1, minutes: 0, seconds: 0 }}
          isHour={true}
          onTimeOut={onSystemCancelled}
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
          stage={curAnalysedPhase}
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
