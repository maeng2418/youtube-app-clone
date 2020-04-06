import React, { useState, useEffect } from 'react';
import SingleComment from './SingleComment';

const ReplyComment = (props) => {

    const [ChildcommentNumber, setChildcommentNumber] = useState(0);
    const [OpenReplyComments, setOpenReplyComments] = useState(false);

    useEffect(() => {
        let commentNumber = 0;
        props.commentLists.map((comment) => {
            if (comment.responseTo === props.parentCommentId) {
                commentNumber += 1;
            }
        })

        setChildcommentNumber(commentNumber);

    }, [props.commentLists]); // 비어있으면 DOM이 로드될 때, 한번 실행 -> componentNumber를 새로고침 해야 늘어남. -> commentLists가 바뀔때 마다 실행

    const renderReplyComment = (parentCommentId) =>
        props.commentLists.map((comment, index) => (
            <React.Fragment key={index}>
                {comment.responseTo === parentCommentId &&
                    <div style={{width: '80%', marginLeft:'40px'}}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} videoId={props.videoId} />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} commentLists={props.commentLists} videoId={props.videoId} />
                    </div>
                }
            </React.Fragment>
        ))

    return (
        <div>
            {ChildcommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: '0', color: 'gray' }} onClick={() => setOpenReplyComments(!OpenReplyComments)}>
                    View {ChildcommentNumber} more comment(s)
            </p>
            }


            {/* renderReplyComment */}
            {OpenReplyComments && renderReplyComment(props.parentCommentId)}
        </div>
    );
}

export default ReplyComment;
