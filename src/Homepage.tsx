import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import { FaCartPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { allocate, deleteItem } from "./redux/allocatedSlice";
import { useNavigate } from "react-router-dom";
import { StoreType } from "./redux/store";

function Homepage() {
  const addedItems = useSelector((state: StoreType) => state.allocatedBudget);

  type ObjectType = {
    category: string;
    description: string;

    id: string;

    image: string;
    price: number;

    title: string;
  };
  const [data, setData] = useState<ObjectType[]>([]);
  const itemsInCart = useSelector((state: StoreType) => state.allocatedBudget);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    fetch("https://fakestoreapi.com/products?limit=12")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      });
  }, []);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  return (
    <Container fluid>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Empty cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your cart is empty, Add items to cart</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Navbar
        expand="lg"
        className="bg-body-tertiary position-fixed top-0 end-0 start-0 z-3"
      >
        <Container>
          <Navbar.Brand href="#home">
            Welcome to our online shopping application
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Button
                onClick={() => {
                  if (addedItems.length < 1) {
                    setShow(true);
                  } else {
                    navigate("/cart");
                  }
                }}
              >
                Go to cart
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Row xs={1} md={2} lg={4} className="g-4 pt-5 z-0">
        {data.map((item) => {
          const itemExistsInCart = itemsInCart.find(
            (cartItem) => cartItem.id === item.id
          );

          return (
            <Col key={item.id} style={{ height: "60vh" }} className="my-5">
              <Card className="mb-5">
                {" "}
                <Card.Img
                  variant="top"
                  src={item.image}
                  style={{ height: "30vh" }}
                />
                <Card.Body style={{ height: "30vh" }}>
                  <Card.Title style={{ height: "10vh", overflow: "hidden" }}>
                    {item.title}
                  </Card.Title>
                  <Card.Text style={{ height: "20vh", overflow: "hidden" }}>
                    {item.description}
                  </Card.Text>
                </Card.Body>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (itemExistsInCart) {
                      dispatch(deleteItem(item.id));
                    } else {
                      dispatch(
                        allocate({
                          id: item.id,
                          items: item.title,
                          quantity: 1,
                          unitPrice: Number(item.price),
                        })
                      );
                    }
                  }}
                >
                  <FaCartPlus className="me-1" />
                  {itemExistsInCart ? "Remove from cart" : "Add to cart"}
                </Button>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default Homepage;
