import React from 'react';
import CustomizedAccordions from '../Component/FaqAccordion';
import FaqQuestionAnswers from '../Asset/FaqQuestionAnswers';
import './Faq.scss';

const Faq: React.FC = () => {

  return (
    <div className = 'faq'>
      {FaqQuestionAnswers.map(datum => (
        <CustomizedAccordions question = {datum.question} answer = {datum.answer}/>
      ))}
    </div>
  );
};

export default Faq;
