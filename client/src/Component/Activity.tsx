import React from 'react';
import Tweet from '../Component/Tweet';
import './Activity.scss';


const Activity: React.FC = () => {
    return (
        <div className='activity-layout'>
            <div className='activity-title'>    
                <div>Activity</div>
            </div>
            <div className='activity-header'>
                <div>News</div>
                <div className='details'>Role</div>
                <div className='details'>Credibility</div>
                <div className='details'>XPX</div>
            </div>
            <div className='activity-content'>
                <div className='activity-item-container'>
                    <div className='activity-tweet'>
                        <Tweet
                            name='Jill Chenraya'
                            tag='@jillcry'
                            content='#Malaysia recorded a total of 2,875 new #Covid19 cases on Thursday. This is the eighth consecutive day with the number of cases above 2,000. Read more at https://bit.ly/3neKgcD'
                            submitBy='Jackie Chan'
                            submitTime={new Date()}
                            authenticityScore={67}
                            stage='Verifying'
                            />
                    </div>
                    <div className='activity-details'>
                        <div className='activity-role'>Investigator</div>
                        <div className='activity-credibility'>+8</div>
                        <div className='activity-xpx'>+0.2</div>
                    </div>
                </div>
                <div className='activity-item-container'>
                    <div className='activity-tweet'>
                        <Tweet
                            name='Jill Chenraya'
                            tag='@jillcry'
                            content='#Malaysia recorded a total of 2,875 new #Covid19 cases on Thursday. This is the eighth consecutive day with the number of cases above 2,000. Read more at https://bit.ly/3neKgcD'
                            submitBy='Jackie Chan'
                            submitTime={new Date()}
                            authenticityScore={67}
                            stage='Verifying'
                            />
                    </div>
                    <div className='activity-details'>
                        <div className='activity-role'>Investigator</div>
                        <div className='activity-credibility'>+8</div>
                        <div className='activity-xpx'>+0.2</div>
                    </div>
                </div>
                <div className='activity-item-container'>
                    <div className='activity-tweet'>
                        <Tweet
                            name='Jill Chenraya'
                            tag='@jillcry'
                            content='#Malaysia recorded a total of 2,875 new #Covid19 cases on Thursday. This is the eighth consecutive day with the number of cases above 2,000. Read more at https://bit.ly/3neKgcD'
                            submitBy='Jackie Chan'
                            submitTime={new Date()}
                            authenticityScore={67}
                            stage='Verifying'
                            />
                    </div>
                    <div className='activity-details'>
                        <div className='activity-role'>Investigator</div>
                        <div className='activity-credibility'>+8</div>
                        <div className='activity-xpx'>+0.2</div>
                    </div>
                </div>               
            </div>
        </div>
    );
};

export default Activity;