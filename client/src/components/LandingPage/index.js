import React, { useState, useEffect } from 'react';
import { Card, Avatar, Col, Typography, Row } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import styles from './styles.module.scss';

const { Title } = Typography;
const { Meta } = Card;

function LandingPage(props) {

  const [Video, setVideo] = useState([]);

  useEffect(() => {

    axios.get('/api/video/getVideos')
      .then(response => {
        if (response.data.success) {
          setVideo(response.data.videos);
        } else {
          alert('비디오 가져오기를 실패 했습니다.')
        }
      })
  }, []); // 뒤에 input 배열 없으면 계속 실행, 빈 배열이면 업데이트 될때만 실행

  const renderCards = Video.map((video, index) => {

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

export default LandingPage;
