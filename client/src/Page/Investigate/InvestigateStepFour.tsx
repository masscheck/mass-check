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
  const { errorToast } = useNotification();
  const {
    accountInfo: { uid, xpxAddress },
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
      eachStageRequiredUserNum,
      investigatorsId,
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
      await submitReport(uid, _id, fileName, xpxAddress);

      history.push(RouteConstant.SECURE_INVESTIGATE_STEP_FIVE);
    } catch (err) {
      console.log(err);
      errorToast('Upload Failed! Please Try Again.');
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
      <div className='investigate-step-four__left'>
        <div className='investigate-step-four__left__step-1'>
          <p className='investigate-step-four__left__step-1__number'>1</p>
          <Link
            to='/Investigation_Report_Template.docx'
            target='_blank'
            className='investigate-step-four__left__step-1__button'
            download
          >
            {`Download Report Template`}
          </Link>
        </div>
        <br />
        <div className='investigate-step-four__left__step-2'>
          <div className='investigate-step-four__left__step-2__headline'>
            <p className='investigate-step-four__left__step-2__headline__number'>
              2
            </p>
            <p className='investigate-step-four__left__step-2__headline__description'>
              Find evidence to prove or disprove this news tweet and compile
              your findings in the Report Template.
            </p>
          </div>
          <div className='investigate-step-four__left__step-2__tweet'>
            <Tweet
              name={authorName}
              tag={authorTag}
              content={content}
              submitBy={submitBy}
              submitTime={submitTime}
              authenticityScore={aiScore}
              stage={curAnalysedPhase}
              currentPhaseTotalPplList={investigatorsId}
              maxPhaseTotalPpl={eachStageRequiredUserNum}
            />
          </div>
        </div>
        <br />
        <div className='investigate-step-four__left__step-3'>
          <div className='investigate-step-four__left__step-3__headline'>
            <p className='investigate-step-four__left__step-3__headline__number'>
              3
            </p>
            <p className='investigate-step-four__left__step-3__headline__description'>
              Upload your completed Report Remplate PDF
            </p>
          </div>
          <div className='investigate-step-four__left__step-3__dropbox'>
            <UploadBox onSetFile={setFile} />
          </div>
        </div>
      </div>

      <div className='investigate-step-four__right'>
        <div className='investigate-step-four__right__timer'>
          <img src={require(`../../Asset/stopwatch.png`).default} />
          <CountDownTimer
            hoursMinSecs={{ hours: 1, minutes: 0, seconds: 0 }}
            isHour={true}
            onTimeOut={onSystemCancelled}
          />
          <p>Submit your investigation before the timer runs out.</p>
        </div>
        <button
          className='investigate-step-four__right__button'
          onClick={onNext}
          disabled={!!!file}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default InvestigateStepFour;
