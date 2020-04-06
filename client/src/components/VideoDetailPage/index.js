import React, { useState, useEffect } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import LikeDislike from './Sections/LikeDislike';
import { useSelector } from 'react-redux';

const VdieoDetailPage = (props) => {

    const variable = { videoId: props.match.params.videoId };
    const [VideoDetail, setVideoDetail] = useState([]);
    const [Comments, setComments] = useState([]);
    const user = useSelector(state => state.user);

    useEffect(() => {

        axios.post('/api/video/getVideoDetail', variable)
        .then(response => {
            if(response.data.success) {
                setVideoDetail(response.data.videoDetail);
            } else {
                alert("비디오 정보를 가져오길 실패했습니다.");
            }
        });

        axios.post('/api/comment/getComments', variable)
        .then(response => {
            if(response.data.success) {
                setComments(response.data.comments);
            } else {
                alert('코멘트 정보를 가져오는 것을 실패하였습니다.');
            }
        })

    }, []);

    const refreshFunction = (newComment) => {
        setComments((Comments.concat(newComment)));
    };

    if(VideoDetail.writer) {

        const subscribeButton = (VideoDetail.writer._id !== localStorage.getItem('userId') && user.userData.isAuth !== false) && <Subscribe userTo={VideoDetail.writer._id}/>

        return (
            <Row gutter={[16, 16]} style={{width: '100%'}}>
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:4000/${VideoDetail.filePath}`} controls />
    
                        <List.Item
                            actions={[<LikeDislike video userId={localStorage.getItem('userId')} videoId={props.match.params.videoId}/>, subscribeButton]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image}/>}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description} />
                        </List.Item>
                        {/* Comments */}
                        <Comment refreshFunction={refreshFunction} commentLists={Comments} />
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
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
