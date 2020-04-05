import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Avatar, Col, Typography, Row } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import styles from './styles.module.scss';

const { Title } = Typography;
const { Meta } = Card;


const SubscriptionPage = () => {

    const [Videos, setVideos] = useState([]);

    useEffect(() => {

        const subscriptionVariables = {
            userFrom: localStorage.getItem('userId')
        };

        axios.post('/api/video/getSubscriptionVideos', subscriptionVariables)
            .then(response => {
                if (response.data.success) {
                    setVideos(response.data.videos);
                } else {
                    alert("구독정보를 가져올 수 없습니다.");
                }
            })
    }, []);

    const renderCards = Videos.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return (
            <Col key={index} lg={6} md={8} xs={24}>
                <Link to={`/video/${video._id}`}>
                    <div style={{ position: 'relative' }}>
                        <img style={{ width: '100%' }} src={`http://localhost:4000/${video.thumbnail}`} alt="thumbnail" />
                        <div className={styles.duration}>
                            <span>{minutes} : {seconds}</span>
                        </div>
                    </div>
                </Link>
                <br />
                <Meta
                    avatar={
                        <Avatar src={video.writer.image} /> // 유저이미지
                    }
                    title={video.title}
                    description=""
                />
                <span>{video.writer.name} </span><br />
                <span stryle={{ marginLeft: '3rem' }}>{video.views} views</span> - <span>{moment(video.createAt).format("MMM Do YY")}</span>
            </Col>
        );
    });

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}> Recommended </Title>
            <hr />
            <Row gutter={[32, 16]}>

                {renderCards}

            </Row>
        </div>
    )
}


export default SubscriptionPage;
