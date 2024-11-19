import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import commonAPI from "../../CommonAPI/commonAPI";
import ConvertTimestampToDate from "../ConvertTimestampToDate/ConvertTimestampToDate";
import Header from "../../VanDe/homePage/header/header";
import Footer from "../../VanDe/homePage/footer/footer";
import { ToastContainer } from "react-bootstrap";
import style from "./PostDetail.module.css";
export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const getPostDetailAPI = async (postId) => {
    try {
      console.log("POST DETAIL ID", Number(postId));
      const response = await commonAPI.get(`/tintuc/${postId}`);
      //   response.data.map((post, index) => {
      //     if (response.data[index].id === Number(postId)) {
      //       console.log(
      //         "SUCCESS GET POST DETAIL ID",
      //         postId,
      //         response.data[index]
      //       );
      //       setPost(response.data[index]);
      //     }
      //   });
      setPost(response.data);
      //   setPost(response.data[]);
    } catch (error) {
      console.log("ERROR MESSAGE GET POST DETAIL API:", error);
    }
  };

  useEffect(() => {
    getPostDetailAPI(id);
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="vw-100%">
      <div>
        <Header />
      </div>
      <div className="d-flex justify-content-center">
        <img
          src={post.hinh_anh}
          alt={post.tieu_de}
          style={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
            objectPosition: "0 50%",
          }}
        />
      </div>
      <div className="col-8 mx-auto mb-5">
        <p
          className=" fw-bolder text-danger my-2 mx-auto"
          style={{
            width: "fit-content",
            padding: "1px 4px 0",
          }}
        >
          Tin Tức
        </p>
        <h1 className="mx-auto">{post.tieu_de}</h1>
        <p className="text-secondary mx-auto">
          {ConvertTimestampToDate(post.ngay_dang)}
        </p>
        <div
          className={`${style.noiDungImage}`}
          // style={{ width: "100%", height: "auto" }}
          dangerouslySetInnerHTML={{ __html: post.noi_dung }}
        ></div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}
