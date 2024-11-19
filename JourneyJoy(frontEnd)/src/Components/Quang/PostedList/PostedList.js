import React, { useEffect, useState } from "react";
import EllipsisText from "react-ellipsis-text";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import postData from "../../../DemoData/postData.json";
import SearchBar from "../SearchBar/SearchBar";
import PostForm from "./PostForm";
import commonAPI from "../../CommonAPI/commonAPI";
import Sidebar from "../../DiepThanh/SideBar/Sidebar";
import ConvertTimestampToDate from "../ConvertTimestampToDate/ConvertTimestampToDate";
import { Button } from "react-bootstrap";

export default function PostedList() {
  const [posts, setPosts] = useState(postData);
  const [filteredPosts, setFilteredPosts] = useState(postData);
  const [editingPost, setEditingPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleSearch = (query) => {
    const filtered = posts.filter(
      (post) =>
        post.tieu_de.toLowerCase().includes(query.toLowerCase()) ||
        post.noi_dung.toLowerCase().includes(query.toLowerCase()) ||
        post.tom_tat.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  const GetPostListAPI = async () => {
    try {
      const data = await commonAPI.get("/api/tintuc/getAllPage");
      setFilteredPosts(data.data);
      setPosts(data.data);
      console.log("DATA POST LIST API METHOD GET: ", data.data);
    } catch (error) {
      console.log("ERROR MESSAGE GET POST LIST API:", error);
    }
  };

  useEffect(() => {
    GetPostListAPI();
  }, []);

  const handleEdit = (post) => {
    setEditingPost(post);
    setIsCreating(false);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingPost(null);
    setIsCreating(true);
    setShowModal(true);
  };

  const handleSave = async (post) => {
    if (isCreating) {
      // Handle creating a new post
      try {
        const response = await commonAPI.post("/api/tintuc/add", post);
        console.log("MESSAGE SUCCESS CREATE POST", response);
        setPosts([...posts, response.data]);
        setFilteredPosts([...posts, response.data]);
      } catch (error) {
        console.error("Error creating post:", error);
      }
    } else {
      // Handle updating an existing post
      try {
        const response = await commonAPI.put(
          `/api/tintuc/update/${post.id}`,
          post
        );
        const updatedPosts = posts.map((p) =>
          p.id === post.id ? response.data : p
        );
        setPosts(updatedPosts);
        setFilteredPosts(updatedPosts);
      } catch (error) {
        console.error("Error updating post:", error);
      }
    }
  };

  const handleDelete = async (postId) => {
    try {
      await commonAPI.delete(`/api/tintuc/delete/${postId}`);
      const updatedPosts = posts.filter((p) => p.id !== postId);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div style={{ background: "rgb(15 30 45)" }} className="row mx-0">
      {/* {console.log("start ")} */}
      <div className="col-2">
        <Sidebar />
      </div>
      <div className="col-10" style={{ position: "relative" }}>
        <div className="d-flex justify-content-center">
          <SearchBar onSearch={handleSearch} />
          <div className="my-auto">
            <Button
              // className="mb-3"
              onClick={handleCreate}
              // style={{ margin: "au" }}
            >
              Create Post
            </Button>
          </div>
        </div>
        <div>
          <div className="container">
            <div className="row justify-content-md-center ">
              {filteredPosts.map((post) => {
                return (
                  <Card key={post.id} className="col-4 p-1 m-1 w-25">
                    <Card.Img
                      variant="top"
                      src={post.hinh_anh}
                      style={{
                        width: "auto",
                        height: "168px",
                        objectFit: "cover",
                      }}
                    />
                    <Card.Body className="text-start">
                      <Card.Title>
                        <EllipsisText text={post.tieu_de} length={"60"} />
                      </Card.Title>
                      <ListGroup variant="flush">
                        <ListGroup.Item style={{ paddingLeft: 0 }}>
                          Ngày đăng: {ConvertTimestampToDate(post.ngay_dang)}
                        </ListGroup.Item>
                        <div
                          dangerouslySetInnerHTML={{ __html: post.noi_dung }}
                          style={{ maxHeight: "100px", overflow: "hidden" }}
                        />
                        <div className="pt-2">
                          <ListGroup.Item className="border-0 px-0">
                            {post.tom_tat}
                          </ListGroup.Item>
                        </div>
                      </ListGroup>
                    </Card.Body>
                    <div className="d-flex justify-content-end">
                      <Button
                        className="btn btn-primary mx-1"
                        onClick={() => handleEdit(post)}
                      >
                        Update
                      </Button>
                      <Button
                        className="btn btn-danger mx-1"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
        <PostForm
          show={showModal}
          handleClose={() => setShowModal(false)}
          post={editingPost}
          onSave={handleSave}
        />
      </div>
      {console.log("END OF POSTED LIST")}
    </div>
  );
}
