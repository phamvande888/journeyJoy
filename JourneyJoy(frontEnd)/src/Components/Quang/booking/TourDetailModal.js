import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ConvertTimestampToDate from "../ConvertTimestampToDate/ConvertTimestampToDate";
export default function TourDetailModal({
  tour,
  show,
  onHide,
  bookingState,
  handleStateChange,
}) {
  if (!tour) return null;

  const isStatusDisabled = tour.trang_thai === 3 || tour.trang_thai === 4;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{tour.ten_tour}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Số Lượng Hành Khách:</strong> {tour.so_luong_nguoi}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Tổng Tiền:</strong> {tour.tong_tien.toLocaleString()} VND
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Ngày Khởi Hành:</strong>{" "}
            {ConvertTimestampToDate(tour.ngay_khoi_hanh)}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Phương Thức Thanh Toán:</strong> {tour.pt_thanh_toan}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Ghi Chú:</strong> {tour.ghi_chu}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Booking At:</strong>{" "}
            {ConvertTimestampToDate(tour.booking_at)}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Trạng Thái Tour:</strong>
            <select
              className="bg bg-white rounded-1 mx-1"
              name="selectTourState"
              value={bookingState || tour.trang_thai}
              onChange={(e) =>
                handleStateChange(
                  tour.id,
                  Number(e.target.value),
                  console.log("STAGE TOUR:", Number(e.target.value))
                )
              }
              disabled={isStatusDisabled}
            >
              <option className="rounded-1" value={0}>
                Đã xác nhận
              </option>
              <option className="rounded-1" value={1}>
                Đã thanh toán
              </option>
              <option value={2}>Đang đi</option>
              <option value={3}>Hoàn thành</option>
              <option value={4}>Đã hủy</option>
            </select>
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
