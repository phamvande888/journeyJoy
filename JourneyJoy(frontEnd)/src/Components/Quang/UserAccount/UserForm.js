// UserForm.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import commonAPI from "../../CommonAPI/commonAPI";

const UserForm = ({ show, handleClose, user, onUpdate }) => {
  const [formValues, setFormValues] = useState({
    dia_chi: "",
    email: "",
    gioi_tinh: "",
    ho_ten: "",
    sdt: "",
    username: "",
    password: "",
    otp: "",
    otp_expiry_date: "",
  });

  useEffect(() => {
    if (user) {
      setFormValues({
        dia_chi: user.dia_chi,
        email: user.email,
        gioi_tinh: user.gioi_tinh,
        ho_ten: user.ho_ten,
        sdt: user.sdt,
        username: user.username,
        password: user.password,
        otp: user.otp,
        otp_expiry_date: user.otp_expiry_date,
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = { ...formValues, id: user.id };
      const data = await commonAPI.put(`/users/${user.id}`, updatedUser);
      onUpdate(data);
      handleClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>User Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdate}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              className="border border-success-subtle"
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Họ Tên</Form.Label>
            <Form.Control
              className="border border-success-subtle"
              type="text"
              name="ho_ten"
              value={formValues.ho_ten}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Địa Chỉ</Form.Label>
            <Form.Control
              className="border border-success-subtle"
              type="text"
              name="dia_chi"
              value={formValues.dia_chi}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="d-flex justify-content-around row">
            <Form.Group className="col-4 px-0">
              <Form.Label>Liên Hệ</Form.Label>
              <Form.Control
                className="border border-success-subtle"
                type="text"
                name="sdt"
                value={formValues.sdt}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="col-3 px-2">
              <Form.Label>Giới Tính</Form.Label>
              <Form.Control
                className="border border-success-subtle"
                type="text"
                name="gioi_tinh"
                value={formValues.gioi_tinh}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="col-3 px-0">
              <Form.Label>Vai trò</Form.Label>
              <Form.Control
                className="border border-success-subtle"
                type="text"
                name="role"
                value={formValues.role}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Form.Group>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              className="border border-success-subtle"
              type="text"
              name="username"
              value={formValues.username}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              className="border border-success-subtle"
              type="text"
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end my-2">
            <Button className="mx-2" variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserForm;
