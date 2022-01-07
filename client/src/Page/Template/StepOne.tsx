import './StepOne.scss';

const StepOne = ({ role, onNextPage, iconName }) => {
  return (
    <div className='step-one'>
      <div className='step-one__left'>
        <div className='step-one__left__description'>
          <p className='step-one__left__description__p1'>
            Want to unearth the truth?
          </p>
          <p className='step-one__left__description__p2'>
            Contribute to our cause and detect fake news by taking on the role
            of <strong>{role}</strong>.
          </p>
          <br />
        </div>
        <button className='step-one__left__button' onClick={onNextPage}>
          <span>Give me a Tweet! </span>
          <img src={require(`../../Asset/twitter-32.png`).default} />
        </button>
      </div>
      <div className='step-one__image'>
        <img src={require(`../../Asset/${iconName}.png`).default} />
      </div>
    </div>
  );
};

export default StepOne;
