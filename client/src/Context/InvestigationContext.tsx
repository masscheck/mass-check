import React, { useContext, useState } from 'react';
import { TweetModel } from '../Model/TweetModel';

type InvestigationContextType = {
  tweetModel: TweetModel;
  setTweetModel: (model: TweetModel) => void;
};

const InvestigationContext = React.createContext<
  Partial<InvestigationContextType>
>({});

const useInvestigation = () => {
  return useContext(InvestigationContext);
};

const InvestigationProvider: React.FC = ({ children }) => {
  const [tweetModel, setTweetModel] = useState<TweetModel>(null);

  const value = {
    tweetModel,
    setTweetModel,
  };

  return (
    <InvestigationContext.Provider value={value}>
      {children}
    </InvestigationContext.Provider>
  );
};

export { useInvestigation, InvestigationProvider };
