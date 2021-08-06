import React from 'react';

const Page2: React.FC = () => {
    return(
        <div className="page2">
            <p>
                Matching you to a news tweet...
            </p>
            <button
                type='submit'
                className='cancel_button'
            >
          Cancel
        </button>
        </div>

    ); 
};

export default Page2;