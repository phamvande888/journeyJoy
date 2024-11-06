import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ConvertTimestampToDate from "../ConvertTimestampToDate/ConvertTimestampToDate";

const CreateTour = ({ show, onHide, onSave }) => {
  const [newTour, setNewTour] = useState({
    ten_tour: "",
    diem_khoi_hanh: "",
    diem_den: "",
    gioi_thieu_tour: "",
    noi_dung_tour: "",
    loai_tour: "1",
    so_ngay: 0,
    ngay_khoi_hanh: "",
    ngay_ket_thuc: "",
    gia_tour: 0,
    trang_thai: "1",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTour((prevTour) => ({
      ...prevTour,
      [name]: name.includes("ngay_") ? Date.parse(value) : value,
    }));
  };

  const handleQuillChange = (content) => {
    setNewTour((prevTour) => ({
      ...prevTour,
      noi_dung_tour: content,
    }));
  };

  const handleSave = () => {
    onSave(newTour);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tạo Tour</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTenTour">
            <Form.Label>
              <strong>Tên Tour </strong>
            </Form.Label>
            <Form.Control
              className="border border-success-subtle"
              type="text"
              name="ten_tour"
              value={newTour.ten_tour}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formDiemKhoiHanh">
            <Form.Label>
              <strong>Điểm Khởi Hành </strong>
            </Form.Label>
            <Form.Control
              className="border border-success-subtle"
              type="text"
              name="diem_khoi_hanh"
              value={newTour.diem_khoi_hanh}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formDiemDen">
            <Form.Label>
              <strong>Điểm Đến </strong>
            </Form.Label>
            <Form.Control
              className="border border-success-subtle"
              type="text"
              name="diem_den"
              value={newTour.diem_den}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formGioiThieuTour">
            <Form.Label>
              <strong>Giới Thiệu Tour </strong>
            </Form.Label>
            <Form.Control
              className="border border-success-subtle"
              type="text"
              name="gioi_thieu_tour"
              value={newTour.gioi_thieu_tour}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formNoiDungTour">
            <Form.Label>
              <strong>Nội Dung Tour</strong>
            </Form.Label>
            <ReactQuill
              value={newTour.noi_dung_tour}
              onChange={handleQuillChange}
            />
          </Form.Group>
          <Form.Group controlId="formLoaiTour">
            <Form.Label>
              <strong>Loại Tour </strong>
            </Form.Label>
            <Form.Control
              className="border border-success-subtle"
              as="select"
              name="loai_tour"
              value={newTour.loai_tour}
              onChange={handleChange}
            >
              <option value="1">Tour Trong Nước</option>
              <option value="2">Tour Quốc Tế</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formSoNgay">
            <Form.Label>
              <strong>Số Ngày </strong>
            </Form.Label>
            <Form.Control
              className="border border-success-subtle"
              type="number"
              name="so_ngay"
              value={newTour.so_ngay}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formNgayKhoiHanh">
            <Form.Label>
              <strong>Ngày Khởi Hành </strong>
            </Form.Label>
            <Form.Control
              className="border border-success-subtle"
              type="date"
              name="ngay_khoi_hanh"
              value={ConvertTimestampToDate(newTour.ngay_khoi_hanh)}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formNgayKetThuc">
            <Form.Label>
              <strong>Ngày Kết Thúc </strong>
            </Form.Label>
            <Form.Control
              className="border border-success-subtle"
              type="date"
              name="ngay_ket_thuc"
              value={ConvertTimestampToDate(newTour.ngay_ket_thuc)}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formGiaTour">
            <Form.Label>
              <strong>Giá Tour </strong>
            </Form.Label>
            <Form.Control
              className="border border-success-subtle"
              type="number"
              name="gia_tour"
              value={newTour.gia_tour}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formTrangThai">
            <Form.Label>
              <strong>Trạng Thái </strong>
            </Form.Label>
            <Form.Control
              className="border border-success-subtle"
              as="select"
              name="trang_thai"
              value={newTour.trang_thai}
              onChange={handleChange}
            >
              <option value="1">Available</option>
              <option value="2">Unavailable</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateTour;
