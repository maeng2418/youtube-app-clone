import React, { useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import { LikeOutlined, LikeFilled, DislikeOutlined, DislikeFilled } from '@ant-design/icons';
import axios from 'axios';

const LikeDislike = (props) => {

    const [Likes, setLikes] = useState(0);
    const [Dislikes, setDislikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);
    const [DislikeAction, setDislikeAction] = useState(null);

    let variables = {};

    if (props.video) {
        variables = { videoId: props.videoId, userId: props.userId }
    } else {
        variables = { commentId: props.commentId, userId: props.userId }
    }

    useEffect(() => {

        axios.post('/api/like/getLikes', variables)
            .then(response => {
                if (response.data.success) {
                    // 얼마나 많은 좋아요를 받았는지?
                    setLikes(response.data.likes.length);

                    // 내가 이미 그 좋아요를 눌렀는지?
                    response.data.likes.map((like, index) => {
                        if (like.userId === props.userId) {
                            setLikeAction('liked');
                        }
                    })
                } else {
                    alert("Dislikes에 정보를 가져오지 못했습니다.");
                };
            });

        axios.post('/api/like/getDislikes', variables)
            .then(response => {
                if (response.data.success) {
                    // 얼마나 많은 싫어요를 받았는지?
                    setDislikes(response.data.dislikes.length);

                    // 내가 이미 그 싫어요를 눌렀는지?
                    response.data.dislikes.map((dislike, index) => {
                        if (dislike.userId === props.userId) {
                            setDislikeAction('disliked');
                        }
                    })
                } else {
                    alert("Likes에 정보를 가져오지 못했습니다.");
                };
            });
    }, []);

    const upLike = () => {
        // Like이 클릭이 안되어있을 때
        axios.post('/api/like/upLike', variables)
        .then(response => {
            if (response.data.success) {
                setLikes(Likes + 1);
                setLikeAction('liked');
                if (DislikeAction !== null) {
                    setDislikeAction(null);
                    setDislikes(Dislikes - 1);
                };
            } else {
                alert('Like을 올리지 못하였습니다.');
            };
        });
    };

    const unLike = () => {
        // Like이 클릭 되어있을 경우
        axios.post('/api/like/unLike', variables)
        .then(response => {
            if (response.data.success) {
                setLikes(Likes - 1);
                setLikeAction(null)
            } else {
                alert('Like을 내리지 못하였습니다.');
            };
        });
    };

    const upDislike = () => {
        axios.post('/api/like/upDislike', variables)
        .then(response => {
            if (response.data.success) {
                setDislikes(Dislikes + 1);
                setDislikeAction('disliked');
                if (LikeAction !== null) {
                    setLikeAction(null);
                    setLikes(Likes - 1);
                };
            } else {
                alert('Dislike을 올리지 못하였습니다.');
            };
        });
    };

    const unDislike = () => {
        axios.post('/api/like/unDislike', variables)
        .then(response => {
            if(response.data.success) {
                setDislikes(Dislikes -1);
                setDislikeAction(null);
            } else {
                alert("Dislike을 내리지 못하였습니다.")
            };
        });
    };

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    {LikeAction === 'liked' ? <LikeFilled onClick={unLike}/> : <LikeOutlined onClick={upLike}/>}
                </Tooltip>
                <span style={{ PddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
            </span>

            <span key="comment-basic-like">
                <Tooltip title="Dislike">
                    {DislikeAction === 'disliked' ? <DislikeFilled onClick={unDislike}/> : <DislikeOutlined onClick={upDislike}/>}
                </Tooltip>
                <span style={{ PddingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
            </span>
        </div>
    );
}

export default LikeDislike;
