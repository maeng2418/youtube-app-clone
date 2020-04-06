var express = require('express');
var router = express.Router();
const { Comment } = require("../models/Comment");

router.post("/saveComment", (req, res) => {
    const comment = new Comment(req.body);
    comment.save((err, comment) => {
        if(err) return res.json({success: false, err});
        
        // save 했을때는 populate 바로 쓸 수 없음.
        Comment.find({'_id': comment._id})
        .populate('writer')
        .exec((err, result) => {
            if(err) return res.json({success: false, err})
            res.status(200).json({success: true, result})
        })
    });
});

router.post("/getComments", (req, res) => {
    Comment.find({ "postId" : req.body.videoId })
    .populate('writer')
    .exec((err, comments) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({success:true, comments});
    })
});

module.exports = router;
