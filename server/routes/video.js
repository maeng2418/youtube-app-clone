const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../config/key'); // mongoURI 가져오기
//const { Video } = require('../models/Video'); // 비디오 모델 가져오기
const { auth } = require('../middleware/auth'); // auth 미들웨어 가져오기
const multer = require('multer'); // 노드 서버에 파일을 저장하기 위함.
const ffmpeg = require('fluent-ffmpeg');

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') // uploads라는 폴더 생성하고 저장
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`) // ex) 1220001309139_hello
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

const upload = multer({ storage: storage }).single("file"); // 파일 하나만


router.post("/uploadfiles", (req, res) => {

    //비디오를 서버에 저장
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })

});

router.post('/thumbnail', (req, res) => {

    // 썸네일 생성하고 비디오 러닝타임도 가져오기

    let thumbsFilePath = "";
    let fileDuration = "";

    console.log(req.body.filePath);

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
        console.dir(metadata); // all metadata
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    // 썸네일 생성
    ffmpeg(req.body.filePath)
        // 썸네일 파일이름 생성
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '));
            console.log(filenames);

            thumbsFilePath = "uploads/thumbnails/" + filenames[0]
        })
        // 썸네일 생성하고 무엇을 할 것인지
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration })
        })
        // 에러가 났을 경우
        .on('error', function (err) {
            console.error(err);
            return res.json({ success: false, err })
        })
        // 옵션설정
        .screenshots({
            // Will take screenshots at 20%, 40%, 60%, and 80% of the video
            count: 3, // 썸네일 갯수
            folder: 'uploads/thumbnails',
            size: '320x240',
            // '%b' : input basename (filename w/o extension)
            filename: 'thumbnail-%b.png'
        })
})

module.exports = router;