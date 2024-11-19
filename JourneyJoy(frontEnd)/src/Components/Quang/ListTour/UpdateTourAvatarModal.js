import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const UpdateTourAvatarModal = ({ show, onHide, tour, onSave }) => {
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const addImage = (event) => {
    const file = event.target.files[0];
    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    onSave(tour.id, newImage);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Tour Avatar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {imagePreview && (
            <div className="mb-3">
              <img
                src={imagePreview}
                alt="Tour Avatar Preview"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          )}
          <Form.Control type="file" onChange={addImage} />
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

export default UpdateTourAvatarModal;
