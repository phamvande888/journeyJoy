import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const PostForm = ({ show, handleClose, post, onSave }) => {
  const [postData, setPostData] = useState({
    tieu_de: "",
    noi_dung: "",
    tom_tat: "",
    hinh_anh: "",
    ngay_dang: new Date().getTime(),
  });

  useEffect(() => {
    if (post) {
      setPostData({
        ...post,
        ngay_dang: post.ngay_dang
          ? new Date(post.ngay_dang).getTime()
          : new Date().getTime(), // Use post date or current date
      });
    } else {
      setPostData({
        tieu_de: "",
        noi_dung: "",
        tom_tat: "",
        hinh_anh: "",
        ngay_dang: new Date().getTime(),
      });
    }
  }, [post]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleQuillChange = (value) => {
    setPostData((prevState) => ({
      ...prevState,
      noi_dung: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(postData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{post ? "Edit Post" : "Create Post"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {postData.hinh_anh && (
            <div className="mb-3 text-center">
              <img
                src={postData.hinh_anh}
                alt="Post"
                style={{
                  width: "auto",
                  maxHeight: "300px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
          <Form.Group controlId="tieu_de">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="tieu_de"
              value={postData.tieu_de}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="noi_dung">
            <Form.Label>Content</Form.Label>
            <ReactQuill
              value={postData.noi_dung}
              onChange={handleQuillChange}
            />
          </Form.Group>
          <Form.Group controlId="hinh_anh">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="hinh_anh"
              value={postData.hinh_anh}
              onChange={handleInputChange}
            />
          </Form.Group>
          {/* <Form.Group controlId="tom_tat">
            <Form.Label>Summary</Form.Label>
            <Form.Control
              type="text"
              name="tom_tat"
              value={postData.tom_tat}
              onChange={handleInputChange}
            />
          </Form.Group> */}
          <Button className="mt-2 float-end" variant="primary" type="submit">
            {post ? "Save Changes" : "Create Post"}
          </Button>
          <Button
            className="bg-danger me-2 mt-2 float-end"
            onClick={handleClose}
          >
            Close
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PostForm;
