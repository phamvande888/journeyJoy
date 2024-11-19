import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ConvertTimestampToDate from "../ConvertTimestampToDate/ConvertTimestampToDate";
import commonAPI from "../../CommonAPI/commonAPI";
import style from "./listTour.module.css";

const ListTourDetailModal = ({ tour, show, onHide, onSave }) => {
  const [updatedTour, setUpdatedTour] = useState(null);
  const [ProvinceData, setProvinceData] = useState([]);
  const location = useLocation();
  const isTourGuidePath = location.pathname.includes("/tourguide");

  const getTourDetail = async () => {
    try {
      const data = await commonAPI.get(`/admin/tour`);
      data.content.forEach((tourDetail) => {
        if (tourDetail.id === tour.id) {
          setUpdatedTour(tourDetail);
        }
      });
    } catch (error) {
      console.error("Error fetching tour detail:", error);
    }
  };

  const getProvinceData = async () => {
    try {
      const response = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setProvinceData(result.data);
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };

  useEffect(() => {
    if (tour) {
      getTourDetail();
      getProvinceData();
    }
  }, [tour]);

  if (!updatedTour) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("SET MAX GUEST", name, value);
    setUpdatedTour((prevTour) => ({
      ...prevTour,
      [name]: value,
    }));
  };

  const handleQuillChange = (content) => {
    setUpdatedTour((prevTour) => ({
      ...prevTour,
      noi_dung_tour: content,
    }));
  };

  const handleSave = () => {
    const updatedTourWithImages = { ...updatedTour };
    onSave(updatedTourWithImages);
  };

  return (
    <Modal className="modal-xl" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{updatedTour.ten_tour}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-2">
        <Form>
          <fieldset disabled={isTourGuidePath}>
            <div className="d-flex justify-content-between">
              <div
                className="d-flex"
                style={{ width: "580.8px", height: "61.6px" }}
              >
                <Form.Group className="mb-0 me-2" controlId="formTrangThai">
                  <Form.Label className="mb-0">
                    <strong>Trạng Thái </strong>
                  </Form.Label>
                  <Form.Control
                    style={{ width: "180px" }}
                    className={`${style.classFormControlTrangThaiGiaTour} border border-success-subtle`}
                    as="select"
                    name="trang_thai"
                    value={updatedTour.trang_thai}
                    onChange={handleChange}
                    disabled={isTourGuidePath}
                  >
                    <option value="1">Available</option>
                    <option value="2">Unavailable</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-0 mx-3 " controlId="formLoaiTour">
                  <Form.Label className="mb-0">
                    <strong>Loại Tour </strong>
                  </Form.Label>
                  <Form.Control
                    style={{ width: "200px" }}
                    className={`${style.classFormControlLoaiTourSoNgay} border border-success-subtle`}
                    as="select"
                    name="loai_tour"
                    value={updatedTour.loai_tour}
                    onChange={handleChange}
                    disabled={isTourGuidePath}
                  >
                    <option value="1">Tour Trong Nước</option>
                    <option value="2">Tour Quốc Tế</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-0 mx-2" controlId="formSoNgay">
                  <Form.Label className="mb-0">
                    <strong>Số Ngày </strong>
                  </Form.Label>
                  <Form.Control
                    style={{ width: "140px" }}
                    className={`${style.classFormControlLoaiTourSoNgay} border border-success-subtle`}
                    type="number"
                    name="so_ngay"
                    value={updatedTour.so_ngay}
                    onChange={handleChange}
                    readOnly={isTourGuidePath}
                  />
                </Form.Group>
                <Form.Group className="mb-0 mx-3" controlId="formSoNgay">
                  <Form.Label className="mb-0">
                    <strong>Số Khách Tối Đa </strong>
                  </Form.Label>
                  <Form.Control
                    style={{ width: "151px" }}
                    className={`${style.classFormControlLoaiTourSoNgay} border border-success-subtle`}
                    type="number"
                    name="maxGuests"
                    value={Number(updatedTour.maxGuests)}
                    onChange={handleChange}
                    readOnly={isTourGuidePath}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-2 ms-2 me-2"
                  controlId="formCurrentGuests"
                >
                  <Form.Label className="mb-0">
                    <strong>Tổng Lượng Khách </strong>
                  </Form.Label>
                  <Form.Control
                    style={{ width: "151px" }}
                    className={`${style.classFormControlLoaiTourSoNgay} border border-success-subtle`}
                    type="number"
                    name="currentGuests"
                    value={updatedTour.currentGuests}
                    // onChange={handleChange}
                    readOnly={true}
                  />
                </Form.Group>
              </div>
              <Form.Group className="mb-0 ms-2" controlId="formGiaTour">
                <Form.Label className="mb-0">
                  <strong>Giá Tour </strong>
                </Form.Label>
                <Form.Control
                  style={{ width: "164.4px" }}
                  className={`${style.classFormControlTrangThaiGiaTour} border border-success-subtle`}
                  type="text"
                  name="gia_tour"
                  value={updatedTour.gia_tour.toLocaleString()}
                  onChange={handleChange}
                  readOnly={isTourGuidePath}
                />
              </Form.Group>
            </div>
            <div className="row">
              <div className="col-10">
                <Form.Group className="mb-0" controlId="formTenTour">
                  <Form.Label className="mb-0">
                    <strong>Tên Tour </strong>
                  </Form.Label>
                  <Form.Control
                    className="border border-success-subtle"
                    type="text"
                    name="ten_tour"
                    value={updatedTour.ten_tour}
                    onChange={handleChange}
                    readOnly={isTourGuidePath}
                  />
                </Form.Group>
                <Form.Group className="mb-0" controlId="formGioiThieuTour">
                  <Form.Label className="mb-0">
                    <strong>Giới Thiệu Tour </strong>
                  </Form.Label>
                  <Form.Control
                    className="border border-success-subtle"
                    type="text"
                    name="gioi_thieu_tour"
                    value={updatedTour.gioi_thieu_tour}
                    onChange={handleChange}
                    readOnly={isTourGuidePath}
                  />
                </Form.Group>
                <Form.Group className="mb-0" controlId="formNoiDungTour">
                  <Form.Label className="mb-0">
                    <strong>Nội Dung Tour</strong>
                  </Form.Label>
                  <ReactQuill
                    style={{ height: "320px", marginBottom: "40px" }}
                    readOnly={isTourGuidePath}
                    value={updatedTour.noi_dung_tour}
                    onChange={handleQuillChange}
                  />
                </Form.Group>
              </div>
              <div className="col-2">
                <Form.Group className="mb-0 " controlId="formDiemKhoiHanh">
                  <Form.Label className="mb-0">
                    <strong>Điểm Khởi Hành </strong>
                  </Form.Label>
                  <Form.Control
                    className={`${style.classFormControl} border border-success-subtle`}
                    as="select"
                    name="diem_khoi_hanh"
                    value={updatedTour.diem_khoi_hanh}
                    onChange={handleChange}
                    readOnly={isTourGuidePath}
                  >
                    {ProvinceData.map((province, index) => (
                      <option key={index} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-0 " controlId="formDiemDen">
                  <Form.Label className="mb-0">
                    <strong>Điểm Đến </strong>
                  </Form.Label>
                  <Form.Control
                    className={`${style.classFormControl} border border-success-subtle`}
                    as="select"
                    name="diem_den"
                    value={updatedTour.diem_den}
                    onChange={handleChange}
                    readOnly={isTourGuidePath}
                  >
                    {ProvinceData.map((province, index) => (
                      <option key={index} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-0 " controlId="formNgayKhoiHanh">
                  <Form.Label className="mb-0">
                    <strong>Ngày Khởi Hành </strong>
                  </Form.Label>
                  <Form.Control
                    className={`${style.classFormControl} border border-success-subtle`}
                    type="date"
                    name="ngay_khoi_hanh"
                    value={ConvertTimestampToDate(updatedTour.ngay_khoi_hanh)}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-0 " controlId="formNgayKetThuc">
                  <Form.Label className="mb-0">
                    <strong>Ngày Kết Thúc </strong>
                  </Form.Label>
                  <Form.Control
                    className={`${style.classFormControl} border border-success-subtle`}
                    type="date"
                    name="ngay_ket_thuc"
                    value={ConvertTimestampToDate(updatedTour.ngay_ket_thuc)}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>
          </fieldset>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {!isTourGuidePath && (
          <Button variant="primary" onClick={handleSave}>
            Save changes
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ListTourDetailModal;
