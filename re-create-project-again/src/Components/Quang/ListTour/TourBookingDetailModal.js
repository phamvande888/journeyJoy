import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ConvertTimestampToDate from "../ConvertTimestampToDate/ConvertTimestampToDate";
export default function TourDetailBookingModal({
  tour,
  show,
  onHide,
  bookingState,
}) {
  if (!tour) return null;
  const getStateLabel = (state) => {
    switch (state) {
      case 1:
        return "Getting start";
      case 2:
        return "On going";
      case 3:
        return "Done";
      case 4:
        return "Canceled";
      default:
        return "Unknown";
    }
  };
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{tour.ten_tour}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Số Lượng Hành Khách: </strong> {tour.so_luong_nguoi}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Tổng Tiền: </strong> {tour.tong_tien.toLocaleString()} VND
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Ngày Khởi Hành: </strong>{" "}
            {ConvertTimestampToDate(tour.ngay_khoi_hanh)}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Phương Thức Thanh Toán: </strong> {tour.pt_thanh_toan}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Ghi Chú: </strong> {tour.ghi_chu}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Booking At: </strong>{" "}
            {ConvertTimestampToDate(tour.booking_at)}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Trạng Thái Tour: </strong>
            {getStateLabel(bookingState || tour.trang_thai)}
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
