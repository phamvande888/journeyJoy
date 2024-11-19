// import React, { useEffect, useState } from "react";
// import { Modal, Button, Form, ListGroup } from "react-bootstrap";
// import commonAPI from "../../CommonAPI/commonAPI";
// import { URL_SERVER } from "../../VanDe/server";
// const UpdateImagesModal = ({ show, onHide, tour, onSave }) => {
//   const [newImages, setNewImages] = useState([]);

//   const addImage = (event) => {
//     setNewImages([...newImages, event.target.files[0]]);
//   };

//   const removeImage = async (id) => {
//     try {
//       const data = await commonAPI.delete(`/api/tour/TourImage/delete/${id}`);
//       console.log("DELETE TOUR IMAGE", data);
//       alert("Đã xóa ảnh thành công");
//       setNewImages((prevImages) =>
//         prevImages.filter((image) => image.id !== id)
//       );
//     } catch (error) {
//       console.log("ERROR DELETE TOUR IMAGE", error);
//     }
//   };

//   const handleSave = () => {
//     onSave(tour.id, newImages);
//   };
//   const GetImageCarousel = async () => {
//     try {
//       const data = await commonAPI.get(
//         `/api/tour/getAllImageOfTour/${tour.id}`
//       );
//       console.log("GET IMAGE CAROUSEL", data.data);
//       setNewImages(data.data);
//     } catch (error) {
//       console.log("ERROR GET IMAGE CAROUSEL", error);
//     }
//   };
//   useEffect(() => {
//     GetImageCarousel();
//   }, [tour]);
//   const displayImageUpload = (image, index) => {

//   };

//   return (
//     <Modal show={show} onHide={onHide}>
//       <Modal.Header closeButton>
//         <Modal.Title>Update Tour Images</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form>
//           <ListGroup>
//             {newImages.map((image, index) => (
//               <ListGroup.Item key={index}>
//                 <img
//                   style={{ height: 50, width: 50 }}
//                   // src={`${URL_SERVER}/public/img/${image.url} ? ${URL_SERVER}/public/img/${image.url}: ${URL.createObjectURL()}`}
//                   src={displayImageUpload(image, index)}
//                 />
//                 <Button
//                   className="ms-2"
//                   variant="danger"
//                   onClick={() => removeImage(image.id, index)}
//                 >
//                   Remove
//                 </Button>
//               </ListGroup.Item>
//             ))}
//           </ListGroup>
//           <Form.Control type="file" onChange={addImage} />
//         </Form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide}>
//           Close
//         </Button>
//         <Button variant="primary" onClick={handleSave}>
//           Save Changes
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default UpdateImagesModal;
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import commonAPI from "../../CommonAPI/commonAPI";
import { URL_SERVER } from "../../VanDe/server";

const UpdateImagesModal = ({ show, onHide, tour, onSave }) => {
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const addImage = (event) => {
    setNewImages([...newImages, event.target.files[0]]);
  };

  const removeImage = async (id) => {
    try {
      const data = await commonAPI.delete(`/api/tour/TourImage/delete/${id}`);
      console.log("DELETE TOUR IMAGE", data);
      // alert("Đã xóa ảnh thành công");
      alert("DELETE IMAGE SUCCESS");
      setExistingImages((prevImages) =>
        prevImages.filter((image) => image.id !== id)
      );
    } catch (error) {
      console.log("ERROR DELETE TOUR IMAGE", error);
    }
  };

  const handleSave = () => {
    onSave(tour.id, newImages);
  };

  const getImageCarousel = async () => {
    try {
      const data = await commonAPI.get(
        `/api/tour/getAllImageOfTour/${tour.id}`
      );
      console.log("GET IMAGE CAROUSEL", data.data);
      setExistingImages(data.data);
    } catch (error) {
      console.log("ERROR GET IMAGE CAROUSEL", error);
    }
  };

  useEffect(() => {
    getImageCarousel();
  }, [tour]);

  const displayImageUpload = (image) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    } else {
      return `${URL_SERVER}/public/img/${image.url}`;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>Update Tour Images</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <ListGroup>
            {existingImages.map((image, index) => (
              <ListGroup.Item key={index} className="d-flex pe-2">
                <img
                  className="rounded-2"
                  style={{ height: "100px", width: "132px" }}
                  src={displayImageUpload(image)}
                  alt={`tour-img-${index}`}
                />
                <Button
                  style={{
                    height: "fit-content",
                    width: "83.5px",
                    margin: "auto 0",
                  }}
                  className="ms-3"
                  variant="danger"
                  onClick={() => removeImage(image.id)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
            {newImages.map((image, index) => (
              <ListGroup.Item key={`new-${index}`} className="pe-2">
                <img
                  className="rounded-2"
                  style={{ height: "100px", width: "132px" }}
                  src={displayImageUpload(image)}
                  alt={`new-tour-img-${index}`}
                />
                <Button
                  style={{
                    height: "fit-content",
                    width: "83.5px",
                    margin: "auto 0",
                  }}
                  className="ms-3"
                  variant="danger"
                  onClick={() => {
                    setNewImages(newImages.filter((_, i) => i !== index));
                  }}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
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

export default UpdateImagesModal;
