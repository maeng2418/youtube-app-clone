import React, { useState } from 'react';
import { Typography, Button, Form, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Dropzone from 'react-dropzone';
import axios from 'axios';

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" }
];

const CategoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" }
];

const VideoUploadPage = () => {

    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [ThumbnailPath, setThumbnailPath] = useState("");

    const onDrop = (files) => {

        let formData = new FormData;

        // 파일 전송시 오류 안나게 헤더 추가
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0]);

        axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {

                if (response.data.success) {

                    let variable = {
                        filePath: response.data.filePath,
                        fileName: response.data.fileName
                    }

                    setFilePath(response.data.filePath);

                    axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {

                                setDuration(response.data.fileDuration);
                                setThumbnailPath(response.data.thumbsFilePath);

                            } else {
                                alert('썸네일 생성에 실패 했습니다.')
                            }
                        })
                } else {
                    alert("비디오 업로드를 실패했습니다.");
                }

            })
    }

    return (
        <div style={{ minWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>
            <Form onFinish>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                    {/* Drop zone */}

                    <Dropzone
                        onDrop={onDrop} // 파일 올릴때 일어나는 이벤트
                        multiple={false} // 한번에 파일을 많이 올릴 것인가?
                        maxSize={800000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <PlusOutlined style={{ fontSize: '3rem' }} />

                            </div>
                        )}
                    </Dropzone>

                    {/* Thumbnail */}
                    {
                        ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:4000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }


                </div>
                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={(e) => setVideoTitle(e.target.value)}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={(e) => setDescription(e.target.value)}
                    value={Description}
                />
                <br />
                <br />

                <select onChange={(e) => setPrivate(e.target.value)}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <select onChange={(e) => setCategory(e.target.value)}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <Button type="primary" size="large" onClick>Submit</Button>
            </Form>
        </div>
    );
}

export default VideoUploadPage;
