import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { StoreType } from "./redux/store";
import {
  //   AllocatedArrayType,
  // allocate,
  deleteItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
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

import { PaystackConsumer } from "react-paystack";

// you can call this function anything

function App() {
  const allocatedBudget = useSelector(
    (state: StoreType) => state.allocatedBudget
  );
  const money = useSelector((state: StoreType) => state.moneyCalc);
  const dispatch = useDispatch();
  //const navigate = useNavigate();

  // const [items, setItems] = useState<{ item: string; unitPrice: number }>();
  // const [quantity, setQuantity] = useState<number>();

  const config = {
    reference: new Date().getTime().toString(),
    email: "user@example.com",
    amount: Math.ceil(money.allocated) * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: "pk_test_69288cf7afda457f7a807e7c1f353c066b1ea7a5",
  };

  const componentProps = {
    ...config,
    text: "Paystack Button Implementation",
    //@ts-expect-error: this is a workaround for paystack not supporting typescript
    onSuccess: (reference) => {
      dispatch(clearCart());
      navigate("/");
      console.log(reference);
    },
    onClose: () => navigate("/"),
  };

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

  const navigate = useNavigate();

  return (
    <Container fluid>
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
                    <td>{quantity}</td>
                    <td>{money.currencyUnit + unitPrice}</td>
                    <td>
                      {money.currencyUnit +
                        " " +
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
          {/* @ts-expect-error: workaround Paystack not supporting typescript */}
          <PaystackConsumer {...componentProps}>
            {({ initializePayment }) => (
              <Button
                className="rounded-start-0 py-2 px-5"
                onClick={() => {
                  if (money.currencyUnit) {
                    initializePayment(
                      () => {
                        dispatch(clearCart());

                        navigate("/");
                        alert("Thanks for shopping with us");
                      },
                      () => {
                        navigate("/");
                      }
                    );
                  } else {
                    alert("Kindly select the currency unit");
                  }
                }}
              >
                Checkout
              </Button>
            )}
          </PaystackConsumer>
        </Col>
        <Col lg={1}></Col>
      </Row>
    </Container>
  );
}

export default App;
