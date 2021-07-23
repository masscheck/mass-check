import React from 'react';
import Tweet from '../Component/Tweet';
import './Activity.scss';


const Activity: React.FC = () => {
    return (
        <div className='activity-layout'>
            <div className='activity-title'>    
                <text>Activity</text>
            </div>
            <div className='activity-header'>
                <text>News</text>
                <text className='details'>Role</text>
                <text className='details'>Credibility</text>
                <text className='details'>XPX</text>
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
                        <text className='activity-role'>Investigator</text>
                        <text className='activity-credibility'>+8</text>
                        <text className='activity-xpx'>+0.2</text>
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
                        <text className='activity-role'>Investigator</text>
                        <text className='activity-credibility'>+8</text>
                        <text className='activity-xpx'>+0.2</text>
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
                        <text className='activity-role'>Investigator</text>
                        <text className='activity-credibility'>+8</text>
                        <text className='activity-xpx'>+0.2</text>
                    </div>
                </div>               
            </div>
        </div>
    );
};

export default Activity;