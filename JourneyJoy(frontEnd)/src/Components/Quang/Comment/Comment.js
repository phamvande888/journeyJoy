import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import SortSelector from "../SortSelector/SortSelector";
import Sidebar from "../../DiepThanh/SideBar/Sidebar";
import commonAPI from "../../CommonAPI/commonAPI";
import { Rating } from "react-simple-star-rating";
import { ConvertTimestampToHourDate } from "../ConvertTimestampToDate/ConvertTimestampToDate";

export default function Comment() {
  const [comments, setComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminReply, setAdminReply] = useState("");

  const getCommentAPI = async () => {
    try {
      const response = await commonAPI.get("/api/admin/feedback/allFeedback");
      console.log("MESSAGE GET COMMENT API", response);
      setComments(response);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    getCommentAPI();
  }, []);

  const handleShowModal = (comment) => {
    setSelectedComment(comment);
    setAdminReply(comment.adminReply || "");
    setShowModal(true);
  };

  const handleSaveReply = async () => {
    try {
      if (selectedComment.adminReply === null) {
        console.log("BEFORE HANDLE SAVE REPLY", adminReply);
        const response = await commonAPI.post(
          `/api/admin/feedback/${selectedComment.id}/reply`,
          {
            adminReply,
          }
        );
        console.log("SUCCESS POST REPLY", response);
      } else {
        // Use PUT method if adminReply is not null
        console.log("Use POST method if adminReply is NOT null", adminReply);
        const response = await commonAPI.put(
          `/api/admin/feedback/${selectedComment.id}/editReply`,
          {
            adminReply,
          }
        );
        console.log("SUCCESS PUT EDIT REPLY", response);
      }
      // console.log("MESSAGE HANDLE SAVE REPLY", response);
      // Update the comment in the state with the new admin reply
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === selectedComment.id
            ? { ...comment, adminReply }
            : comment
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error saving admin reply:", error);
    }
  };

  return (
    <div style={{ background: "rgb(15 30 45)" }} className="row mx-0">
      <div className="col-2">
        <Sidebar />
      </div>
      <div className="col-10 my-1">
        {/* <div className="d-flex justify-content-center">
          <SortSelector setSortedComments={setComments} />
        </div> */}
        <div>
          <div className="container">
            <div className="row justify-content-md-center mt-5">
              <h2 className="text-white">Manage Comment</h2>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="d-flex justify-content-center"
                  onClick={() => handleShowModal(comment)}
                >
                  <div className="bg-white text-black rounded-2 p-3 w-75 mb-1 cursor-pointer">
                    <div className="userNameAndTime d-flex justify-content-between">
                      <h5>
                        <strong>User: </strong>
                        {comment.hoTen}
                      </h5>
                      <h6 className="text-secondary" style={{ margin: 4 }}>
                        {ConvertTimestampToHourDate(comment.createdAt)}
                      </h6>
                    </div>
                    <div className="mainContent">
                      <p className="text-start">
                        <strong>Nội dung: </strong>
                        {comment.comment}
                      </p>
                      <p>
                        <strong>Tour:</strong> {comment.tenTour}
                      </p>
                      <div className="d-flex">
                        <p className="m-0" style={{ padding: "2px 0 0 0 " }}>
                          <strong>Rating:</strong>
                        </p>
                        <Rating
                          size={20}
                          initialValue={comment.rating}
                          readonly={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedComment && (
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Comment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                <strong>Name:</strong> {selectedComment.hoTen}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {ConvertTimestampToHourDate(selectedComment.createdAt)}
              </p>
              <p>
                <strong>Comment:</strong> {selectedComment.comment}
              </p>
              <p>
                <strong>Tour:</strong> {selectedComment.tenTour}
              </p>
              <div className="d-flex" style={{ marginBottom: "16px" }}>
                <p className="m-0" style={{ padding: "2px 0 0 0 " }}>
                  <strong>Rating:</strong>
                </p>
                <Rating
                  size={20}
                  initialValue={selectedComment.rating}
                  readonly={true}
                />
              </div>

              <p>
                <strong>Admin Reply at: </strong>
                {ConvertTimestampToHourDate(
                  selectedComment.adminReplyCreatedAt
                )}
              </p>

              <textarea
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                className="form-control"
                rows="3"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSaveReply}>
                Save Reply
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
}
