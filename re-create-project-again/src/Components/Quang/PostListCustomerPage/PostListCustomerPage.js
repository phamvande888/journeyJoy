import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, ListGroup, Card } from "react-bootstrap";
import commonAPI from "../../CommonAPI/commonAPI";
import ConvertTimestampToDate from "../ConvertTimestampToDate/ConvertTimestampToDate";
import Header from "../../VanDe/homePage/header/header";
import Footer from "../../VanDe/homePage/footer/footer";
import EllipsisText from "react-ellipsis-text/lib/components/EllipsisText";

export default function PostListCustomerPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const navigate = useNavigate();

  const GetPostListAPI = async () => {
    try {
      const data = await commonAPI.get("/getAllTintuc");
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

  const handledetailPost = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <div>
      <div className="">
        <Header />
      </div>
      <div style={{ marginTop: "100px" }} className="container mb-4">
        <div className="row justify-content-md-center">
          {filteredPosts.map((post) => (
            <Card
              onClick={() => handledetailPost(post.id)}
              key={post.id}
              className="col-4 p-1 m-1 w-25 border-0"
            >
              <div style={{ position: "relative" }}>
                <Card.Img
                  className="rounded-2"
                  variant="top"
                  src={post.hinh_anh}
                  style={{
                    width: "-webkit-fill-available",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <p
                  className="bg-danger rounded-2 fw-bolder text-white"
                  style={{
                    width: "fit-content",
                    padding: "1px 4px 0",
                    position: "absolute",
                    top: "4px",
                    left: "4px",
                  }}
                >
                  Tin Tức
                </p>
              </div>
              <Card.Body className="text-start p-0">
                <Card.Title className="fw-bolder pt-1">
                  <EllipsisText text={post.tieu_de} length={"60"} />
                </Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item
                    className="text-secondary"
                    style={{ paddingLeft: 0 }}
                  >
                    Ngày đăng: {ConvertTimestampToDate(post.ngay_dang)}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
