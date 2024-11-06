import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
function ProductList({ products }) {
  return (
    // <ul>
    //   <h2>hi</h2>
    //   {products.map((product) => (
    //     <li key={product.tour_id}>
    //       <h2>{product.message}</h2>
    //       <p>Destination: {product.destination}</p>
    //       <p>Price per person: ${product.price_per_person}</p>
    //       <p>Number of people: {product.number_of_people}</p>
    //     </li>
    //   ))}
    // </ul>
    <div className="container">
      <div className="row justify-content-md-center">
        {products.map((tour) => (
          <Card key={tour.id} className="col-3 mx-1 my-1 p-2">
            <Card.Img
              variant="top"
              src={`https://wise-flea-accurate.ngrok-free.app/resources/${tour.anh_tour}`}
            />
            <Card.Body>
              <Card.Title>{tour.ten_tour}</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>{tour.loai_tour}</ListGroup.Item>
                <ListGroup.Item>{tour.noi_dung_tour}</ListGroup.Item>
                <div
                  style={{ padding: 0 }}
                  className="container  d-flex justify-content-between"
                >
                  <div className="pt-2">
                    <ListGroup.Item className="border-0">
                      {tour.gia_tour}
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
export default ProductList;
