import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useNotification } from '../Context/NotificationContext';
import {
  postCreateXpxAcc,
  postUpdateUserXpxAddress,
} from '../Util/API/SignUpAPI';
import { RouteConstant } from '../Util/Constant/RouteConstant';
import downloadFile from '../Util/Useful/DownloadFile';
import { useLoadingSpinner } from '../Context/LoadingSpinnerContext';

import './SignUpSuccess.scss';
import { useAccountInfo } from '../Context/AccountInfoContext';

const SignUpSuccess: React.FC = () => {
  const [hasRemind, setHasRemind] = useState(false);
  const [xpxPrivateKey, setXpxPrivateKey] = useState('');
  const history = useHistory();
  const { warnToast, errorToast } = useNotification();
  const { setIsLoading } = useLoadingSpinner();
  const { accountInfo, setAccountInfo } = useAccountInfo();

  const onDownload = async () => {
    if (!hasRemind) {
      try {
        setIsLoading(true);

        const { privateKey, address } = await postCreateXpxAcc();

        const newAccountInfo = { ...accountInfo };
        newAccountInfo.xpxAddress = address;
        setAccountInfo(newAccountInfo);

        setXpxPrivateKey(privateKey);
        downloadFile('xpx-private-key', privateKey);

        setHasRemind(true);
      } catch (error) {
        errorToast('Please download the XPX Private Key again.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      downloadFile('xpx-private-key', xpxPrivateKey);
    }
  };

  const onGetStart = async () => {
    if (!hasRemind) {
      warnToast('Please download your XPX private key before proceeding');
      return;
    }
    try {
      setIsLoading(true);
      console.log(accountInfo);
      const { uid, xpxAddress } = accountInfo;

      await postUpdateUserXpxAddress(uid, xpxAddress);

      history.push(RouteConstant.SECURE_HOME);
    } catch (err) {
      errorToast("Please click 'Get Started Now' again");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='sign-up-success'>
      <p className='sign-up-success__description'>
        You have successfully signed up for a MassCheck account! Before you
        proceed, please ensure to download your{' '}
        <strong>unique private key</strong> by clicking on the download button
        below.
      </p>
      <p className='sign-up-success__note'>
        Note: You will need your private key in the future when you check out
        your XPX rewards in your ProximaX wallet.{' '}
      </p>
      <div className='sign-up-success__btn-group'>
        <button className='sign-up-success__download-btn' onClick={onDownload}>
          Download
        </button>
        <button
          className='sign-up-success__get-started-btn'
          onClick={onGetStart}
        >
          Get Started Now
        </button>
      </div>
    </div>
  );
};

export default SignUpSuccess;
