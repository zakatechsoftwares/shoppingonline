import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
//import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "./redux/store";
import {
  //   AllocatedArrayType,
  // allocate,
  deleteItem,
  increaseQuantity,
  decreaseQuantity,
  // clearCart,
} from "./redux/allocatedSlice";
import {
  //budgetedChanged,
  moneyCalc,
  currencyUnitChanged,
} from "./redux/moneySlice";
//import { nanoid } from "nanoid";
//import { itemForSale, countriesCurrency } from "./data/commodity";
import { IoIosAdd } from "react-icons/io";
import { IoIosRemove } from "react-icons/io";
// import {
//   useFlutterwave,
//   // closePaymentModal,
//   FlutterwaveConfig,
// } from "flutterwave-react-v3";
import Modal from "react-bootstrap/Modal";

function App() {
  const allocatedBudget = useSelector(
    (state: StoreType) => state.allocatedBudget
  );
  const money = useSelector((state: StoreType) => state.moneyCalc);
  const dispatch = useDispatch();

  // const [items, setItems] = useState<{ item: string; unitPrice: number }>();
  // const [quantity, setQuantity] = useState<number>();

  useEffect(() => {
    // console.log(allocatedBudget.length);
    const array: number[] = [];
    allocatedBudget?.forEach((element) => {
      array.push(Number(element.quantity) * Number(element.unitPrice));
    });

    const totalSpent =
      array.length > 0
        ? array.reduce((sum, element) => Number(sum) + Number(element))
        : 0;

    const remainingAmount: number = Number(money.budgeted) - Number(totalSpent);

    dispatch(
      moneyCalc({
        currencyUnit: money.currencyUnit,
        budgeted: money.budgeted,
        allocated: totalSpent,
        remaining: remainingAmount,
      })
    );
  }, [
    allocatedBudget,
    money.budgeted,
    dispatch,
    money.allocated,
    money.remaining,
    money.currencyUnit,
  ]);

  // interface Config { public_key: string; tx_ref: number; amount: number; currency: string; payment_options: string; customer: { email: string; phone_number: string; name: string; }; customizations: { title: string; description: string; logo: string; }; }

  //   const config: Config = {
  //     public_key: "FLWPUBK_TEST-e4bb46908aa02f101fc0420306b1bc17-X", //process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
  //     tx_ref: Date.now(),
  //     amount: money.allocated,
  //     currency: money.currencyUnit,
  //     payment_options: "card,mobilemoney,ussd",
  //     customer: {
  //       email: "user@gmail.com",
  //       phone_number: "08065410021",
  //       name: "john doe",
  //     },
  //     customizations: {
  //       title: "My store",
  //       description: "Payment for items in cart",
  //       logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
  //     },
  //   };
  // const navigate = useNavigate();

  // const handleFlutterPayment = useFlutterwave(config);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  return (
    <Container fluid>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Use this card details to test pay</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          Card number: 5531 8866 5214 2950
          <br />
          cvv: 564 <br />
          Expiry: 09/32
          <br />
          Pin: 3310
          <br />
          OTP: 12345
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        <p className="display-5 fw-normal">Shopping cart</p>

        <Col lg={6}>
          <Form.Control
            plaintext
            readOnly
            placeholder={`Cart value : ${money.currencyUnit + money.allocated}`}
            className="border border-1 rounded-2 ps-2 bg-info-subtle"
          />
        </Col>
        <Col
          lg={6}
          className="d-flex justify-content-start align-items-center bg-info-subtle ps-2 rounded-2"
        >
          <Form.Label className="mb-0 me-1">Currency unit</Form.Label>
          <Form.Select
            aria-label="Default select example"
            className="rounded-2 "
            style={{ width: "25%", height: "90%" }}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              dispatch(currencyUnitChanged(e.target.value));
              setShow(true);
            }}
            id="currencyUnit"
          >
            <option>Currency Unit</option>

            <option value="USD">$</option>

            <option value="NGN">₦</option>
          </Form.Select>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <p className="h3 fw-normal ">Items in cart</p>
          <Table>
            <thead>
              <tr>
                <th>Items</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Item Price</th>
                <th>Increase Quantity</th>
                <th>Decrease Quantity</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {allocatedBudget.map(({ id, items, quantity, unitPrice }) => {
                return (
                  <tr key={id}>
                    <td>{items}</td>
                    <td>{money.currencyUnit + quantity}</td>
                    <td>{money.currencyUnit + unitPrice}</td>
                    <td>
                      {money.currencyUnit +
                        Number(quantity) * Number(unitPrice)}
                    </td>
                    <td>
                      <Button
                        className="p-0 bg-transparent border-0 text-dark"
                        onClick={() => dispatch(increaseQuantity(id))}
                      >
                        <IoIosAdd />
                      </Button>
                    </td>
                    <td>
                      <Button
                        className="p-0 bg-transparent border-0 text-dark"
                        onClick={() => dispatch(decreaseQuantity(id))}
                      >
                        <IoIosRemove />
                      </Button>
                    </td>
                    <td>
                      <Button
                        className="p-0 bg-transparent border-0 text-dark"
                        onClick={() => dispatch(deleteItem(id))}
                      >
                        <i className="bi bi-x-lg p-1 fw-bold rounded-5 bg-danger text-white"></i>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col lg={3} className="d-flex flex-row"></Col>
        <Col lg={3} className="d-flex flex-row "></Col>

        <Col lg={3} className="d-flex flex-row"></Col>
        <Col lg={1}></Col>
        <Col lg={1}>
          <Button
            className="rounded-start-0 py-2 px-5"
            onClick={() => {
              // if (money.currencyUnit) {
              //   handleFlutterPayment({
              //     callback: () => {
              //       // dispatch(clearCart());
              //       dispatch(clearCart());
              //       //  closePaymentModal(); // this will close the modal programmatically
              //     },
              //     onClose: () => {
              //       navigate("/");
              //     },
              //   });
              // } else {
              //   alert("Kindly select the currency unit");
              // }
            }}
          >
            Checkout
          </Button>
        </Col>
        <Col lg={1}></Col>
      </Row>
    </Container>
  );
}

export default App;
