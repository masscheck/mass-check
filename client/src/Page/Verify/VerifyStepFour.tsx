import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Tweet from '../../Component/Tweet';
import CountDownTimer from '../../Component/CountdownTimer';
import { storage } from '../../Util/Firebase/FirebaseConfig';
import PDFViewer from '../../Component/PDFViewer';
import { RouteConstant } from '../../Util/Constant/RouteConstant';

import './VerifyStepFour.scss';
import { useTweetModel } from '../../Context/InvestigationContext';
import { submitVerificationResult } from '../../Util/API/VerificationAPI';
import { LocalStorageEnum } from '../../Util/Constant/LocalStorageEnum';

const VerifyStepFour: React.FC = () => {
  const [researchIndex, setResearchIndex] = useState(1);
  const [hasDownload, setHasDownload] = useState(false);
  const [hasFinishDowload, setHasFinishDowload] = useState(false);
  const [vote, setVote] = useState('');
  const [voted, setVoted] = useState(false);
  const [researchFileList, setResearchFileList] = useState({});
  const [researchFileNameList, setResearchFileNameList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const history = useHistory();
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
      investigatedReportIdList,
    },
  } = useTweetModel();
  const res = useTweetModel();

  useEffect(() => {
    console.log({ tweetRes: res });

    setResearchFileNameList(investigatedReportIdList);
  }, []);

  useEffect(() => {
    console.log(researchFileNameList);

    if (researchFileNameList.length === 5 && !hasDownload) {
      researchFileNameList.forEach((x, index) => {
        downloadPDF(x, index + 1);
      });

      setHasDownload(true);
    }
  }, [researchFileNameList]);

  useEffect(() => {
    setVoted(!!vote);
  }, [vote]);

  useEffect(() => {
    if (Object.keys(researchFileList).length === 5) {
      setSelectedFile(researchFileList[1]);

      setHasFinishDowload(true);
    }

    console.log(researchFileList);
  }, [researchFileList]);

  const downloadPDF = (filename: string, index: number) => {
    const storageRef = storage.ref();
    const fileRef = storageRef.child(filename);

    fileRef
      .getDownloadURL()
      .then((url) => {
        let blob;

        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';

        xhr.onload = (event) => {
          blob = xhr.response;

          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64String = reader.result;
            const newObj = researchFileList;
            newObj[index] = base64String;
            setResearchFileList({ ...newObj });

            console.log(Object.keys(researchFileList).length);
            console.log(newObj);
          };
        };

        xhr.open('GET', url);
        xhr.send();
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const onRealSelected = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setVote('real');
  };

  const onFakeSelected = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setVote('fake');
  };

  const onResearchSelected = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    setResearchIndex(index);

    setSelectedFile(researchFileList[index]);
  };

  const onNext = async () => {
    const uid = localStorage.getItem(LocalStorageEnum.UID);

    submitVerificationResult(uid, tweetId, vote === 'real');
    history.push(RouteConstant.SECURE_VERIFTY_STEP_FIVE);
  };

  return (
    <div className='verify-step-four'>
      <div className='verify-step-four__timer'>
        Timer:&nbsp;
        <CountDownTimer
          hoursMinSecs={{ hours: 0, minutes: 30, seconds: 0 }}
          isHour={true}
        />
      </div>

      <div className='verify-step-four__container'>
        <div className='verify-step-four__container__left'>
          <div className='verify-step-four__container__left__button_group'>
            {[1, 2, 3, 4, 5].map((x) => {
              return (
                <button
                  key={x}
                  className={
                    researchIndex === x
                      ? `verify-step-four__container__left__active`
                      : ''
                  }
                  onClick={(e) => onResearchSelected(e, x)}
                >
                  Research {x}
                </button>
              );
            })}
          </div>
          <div className='verify-step-four__container__left__pdf-viewer'>
            {hasFinishDowload ? <PDFViewer pdf={selectedFile} /> : 'Loading'}
            {/* Loading */}
          </div>
        </div>
        <div className='verify-step-four__container__right'>
          <div className='verify-step-four__tweet'>
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
          <div className='verify-step-four__container__right__button_group'>
            <button
              className={vote === 'real' ? 'selected-real' : 'deselected-real'}
              onClick={(e) => onRealSelected(e)}
            >
              Real
            </button>
            <button
              className={vote === 'fake' ? 'selected-fake' : 'deselected-fake'}
              onClick={(e) => onFakeSelected(e)}
            >
              Fake
            </button>
          </div>
          <button className='confirm' onClick={onNext} disabled={!voted}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyStepFour;
