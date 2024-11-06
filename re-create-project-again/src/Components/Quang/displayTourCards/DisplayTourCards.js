import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

export default function DisplayTourCards(tours) {
  if (!Array.isArray(tours)) {
    return <div>No tours available</div>;
  }
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        {tours.map((tour) => (
          <Card key={tour.tourID} className="col-3 mx-1 my-1 p-2">
            <Card.Img variant="top" src={tour.tourIMG} />
            <Card.Body>
              <Card.Title>{tour.tourName}</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>{tour.loaiTour}</ListGroup.Item>
                <ListGroup.Item>{tour.noiDungTour}</ListGroup.Item>
                <div
                  style={{ padding: 0 }}
                  className="container  d-flex justify-content-between"
                >
                  <div className="pt-2">
                    <ListGroup.Item className="border-0">
                      {tour.giaTour}
                    </ListGroup.Item>
                  </div>
                  <div className="pt-2">
                    <button type="button" className="btn btn-primary">
                      Primary
                    </button>
                  </div>
                </div>
              </ListGroup>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}
