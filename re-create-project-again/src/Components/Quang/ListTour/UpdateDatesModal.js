import React, { useEffect, useState } from "react";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import commonAPI from "../../CommonAPI/commonAPI";
import ConvertTimestampToDate from "../ConvertTimestampToDate/ConvertTimestampToDate";
// api = api/tour/StartDate/{id}
const UpdateDatesModal = ({ show, onHide, tour, onSave }) => {
  const [newDates, setNewDates] = useState([]);

  const addDate = () => {
    setNewDates([...newDates, ""]);
  };

  const updateDate = (index, value) => {
    const updatedDates = [...newDates];
    updatedDates[index] = value;
    setNewDates(updatedDates);
  };
  const getDataDate = async () => {
    try {
      console.log("LOG TOUR ID WHEN CLICK UPDATE DATE", tour.id);
      const response = await commonAPI.get(`/api/tour/StartDate/${tour.id}`);
      console.log("DATA RESPONSE WHEN GET DATE SUCCESS", response);
      const dataArray = response.data;
      console.log("DATA ARRAY", dataArray);
      // Nếu bạn muốn cập nhật state với dữ liệu mới
      setNewDates(dataArray);
    } catch (error) {
      console.log("ERROR GET DATA DATE", error);
    }
  };

  useEffect(() => {
    if (tour && tour.id) {
      getDataDate();
    }
  }, [tour]);
  const removeDate = async (id, index) => {
    try {
      if (!id) {
        console.log("ID NOT EXIST FOR DATE", id);
        const updatedDates = newDates.filter((_, i) => i !== index);
        setNewDates(updatedDates);
        return;
      }
      const data = await commonAPI.delete(`/api/tour/StartDate/delete/${id}`);
      console.log("MESSAGE DELETE DATE", data);
      const updatedDates = newDates.filter((_, i) => i !== index);
      alert("DELETE DATE SUCCESS");
      setNewDates(updatedDates);
    } catch (error) {
      console.log("ERROR MESSAGE DELETE DATE");
    }
  };

  const handleSave = () => {
    onSave(tour.id, newDates);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Start Dates</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <ListGroup>
            {newDates.map((date, index) => (
              <ListGroup.Item key={index} className="d-flex">
                <Form.Control
                  {...console.log(
                    "DATE BEFORE CONVERT",
                    date.ngay_khoi_hanh,
                    date
                  )}
                  type="date"
                  value={
                    date.ngay_khoi_hanh
                      ? ConvertTimestampToDate(date.ngay_khoi_hanh)
                      : ConvertTimestampToDate(date)
                  }
                  onChange={(e) => updateDate(index, e.target.value)}
                />
                <Button
                  className="ms-3"
                  variant="danger"
                  onClick={() => removeDate(date.id, index)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button className="mt-3" variant="secondary" onClick={addDate}>
            Add Date
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateDatesModal;
