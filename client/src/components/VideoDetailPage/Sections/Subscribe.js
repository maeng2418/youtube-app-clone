import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

const Subscribe = (props) => {

    const [SubscribeNumber, setSubscribeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);
    const isAuth = useSelector(state => state.user.userData.isAuth);

    const onSubscribe = () => {
        
        // 로그인 하지 않은 상태
        if (!isAuth) {
            props.history.push('/login');
        } else {
            let subscribeVariables = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }

            // 이미 구독 중이라면
            if (Subscribed) {
                axios.post('/api/subscribe/unSubscribe', subscribeVariables)
                    .then(response => {
                        if (response.data.success) {
                            setSubscribeNumber(SubscribeNumber - 1);
                            setSubscribed(!Subscribed);
                        } else {
                            alert("구독 취소를 실패하였습니다.");
                        }
                    })
            } else {
                // 구독중이 아니라면
                axios.post('/api/subscribe/subscribe', subscribeVariables)
                    .then(response => {
                        if (response.data.success) {
                            setSubscribeNumber(SubscribeNumber + 1);
                            setSubscribed(!Subscribed);
                        } else {
                            alert("구독하는데 실패하였습니다.");
                        }
                    })
            }
        }
    }

    useEffect(() => {

        const subscribeNumberVariables = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }

        axios.post('/api/subscribe/subscribeNumber', subscribeNumberVariables)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber);
                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다.');
                }
            });

        axios.post('/api/subscribe/subscribed', subscribeNumberVariables)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subscribed);
                } else {
                    alert('정보를 받아오지 못했습니다.')
                }
            })
    }, []);

    return (
        <div>
            <button
                style={{ backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px', color: "white", padding: "10px 16px", fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase' }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}

            </button>
        </div>
    );
}

export default withRouter(Subscribe);
