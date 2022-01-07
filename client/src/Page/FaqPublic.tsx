import React from 'react';
import CustomizedAccordions from '../Component/FaqAccordionPublic';
import FaqQuestionAnswers from '../Asset/FaqQuestionAnswers';
import './FaqPublic.scss';

const Faq: React.FC = () => {
  return (
    <div className='faq'>
      <div className='background'>
        <img src={require(`../Asset/Background.png`).default} />
      </div>
      {FaqQuestionAnswers.map((datum, index) => (
        <CustomizedAccordions
          key={index}
          question={datum.question}
          answer={datum.answer}
        />
      ))}
    </div>
  );
};

export default Faq;
