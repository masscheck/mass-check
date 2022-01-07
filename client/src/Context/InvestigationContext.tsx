import React, { useContext, useState } from 'react';
import { TweetModel } from '../Model/TweetModel';

type TweetModelContextType = {
  tweetModel: TweetModel;
  setTweetModel: (model: TweetModel) => void;
};

const TweetModelContext = React.createContext<
  Partial<TweetModelContextType>
>({});

const useTweetModel = () => {
  return useContext(TweetModelContext);
};

const TweetProvider: React.FC = ({ children }) => {
  const [tweetModel, setTweetModel] = useState<TweetModel>(null);

  const value = {
    tweetModel,
    setTweetModel,
  };

  return (
    <TweetModelContext.Provider value={value}>
      {children}
    </TweetModelContext.Provider>
  );
};

export { useTweetModel, TweetProvider };
