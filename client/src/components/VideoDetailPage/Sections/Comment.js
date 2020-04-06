import React, { useEffect } from 'react';
import { Form, Button, Input } from 'antd';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

const Comment = (props) => {

    const user = useSelector(state => state.user);
    const videoId = props.match.params.videoId; // url에서 가져옴.

    const onSubmit = (formData) => {
        const variables = {
            content: formData.content,
            writer: user.userData._id ? user.userData._id : '5e8a8b2a9f97db0114ac2e1c', // 로컬스토리지 말고 리덕스에서 가져옴
            postId: videoId,
        };

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success) {
                props.refreshFunction(response.data.result);
            } else {
                alert("커멘트를 저장하지 못했습니다.")
            };
        });
    };

    return (
        <div>
            <br />
            <p> Replies</p>
            <hr />

            {/* Comment Lists */}

            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo && // 메인 댓글만!
                    <React.Fragment key={index}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} videoId={videoId}/>
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} commentLists={props.commentLists} videoId={videoId}/>
                    </React.Fragment>
                )
            ))}

            {/* Root comment Form */}

            <Form style={{ display: 'flex' }} onFinish={onSubmit}>
                <Form.Item name="content" style={{ width: '100%', boerderRadius: '5px' }}>
                    <Input.TextArea
                        placeholder="코멘트를 작성해 주세요"
                    />
                </Form.Item>
                <br />
                <Button style={{ width: '20%', height: '52px' }} htmlType="submit">Submit</Button>
            </Form>
        </div>
    );
}

export default withRouter(Comment);
