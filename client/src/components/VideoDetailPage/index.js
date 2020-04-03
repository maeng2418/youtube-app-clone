import React, { useState, useEffect } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const VdieoDetailPage = (props) => {

    const variable = { videoId: props.match.params.videoId };
    const [VideoDetail, setVideoDetail] = useState([]);

    useEffect(() => {

        axios.post('/api/video/getVideoDetail', variable)
        .then(response => {
            if(response.data.success) {
                setVideoDetail(response.data.videoDetail);
            } else {
                alert("비디오 정보를 가져오길 실패했습니다.");
            }
        })

    }, []);

    if(VideoDetail.writer) {
        return (
            <Row gutter={[16, 16]} style={{width: '100%'}}>
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:4000/${VideoDetail.filePath}`} controls />
    
                        <List.Item
                            actions
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image}/>}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description} />
                        </List.Item>
                        {/* Commnets */}
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    Side Videos
            </Col>
    
            </Row>
        );
    } else {
        return (
            <div>Loading...</div>
        );
    }
}

export default withRouter(VdieoDetailPage);
