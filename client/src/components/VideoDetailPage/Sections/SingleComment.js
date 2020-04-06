import React, { useState } from 'react';
import { Comment, Avatar, Button, Input, Form } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';

const SingleComment = (props) => {

  const [OpenReply, setOpenReply] = useState(false);
  const user = useSelector(state => state.user);

  const actions = [
    <span onClick={() => setOpenReply(!OpenReply)} key="commnet-basic-reply-to">Reply to</span>
  ]

  const onSubmit = (formData) => {

    const variables = {
        content: formData.content,
        writer: user.userData._id ? user.userData._id : '5e8a8b2a9f97db0114ac2e1c', // 로컬스토리지 말고 리덕스에서 가져옴
        postId: props.videoId,
        responseTo: props.comment._id
    };

    axios.post('/api/comment/saveComment', variables)
    .then(response => {
        if(response.data.success) {
          props.refreshFunction(response.data.result);
          setOpenReply(false);
        } else {
            alert("커멘트를 저장하지 못했습니다.")
        };
    });
  };

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt="writer" />}
        content={<p>{props.comment.content}</p>}
      />

      {OpenReply &&
        <Form style={{ display: 'flex' }} onFinish={onSubmit}>
          <Form.Item name="content" style={{ width: '100%', boerderRadius: '5px' }}>
            <Input.TextArea
              placeholder="코멘트를 작성해 주세요"
            />
          </Form.Item>
          <br />
          <Button style={{ width: '20%', height: '52px' }} htmlType="submit">Submit</Button>
        </Form>
      }
    </div>
  );
}

export default SingleComment;
