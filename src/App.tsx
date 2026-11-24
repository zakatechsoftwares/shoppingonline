import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { usePaystackPayment } from "react-paystack";
import { StoreType } from "./redux/store";
import { clearCart, decreaseQuantity, deleteItem, increaseQuantity } from "./redux/allocatedSlice";
import { currencyUnitChanged } from "./redux/moneySlice";

export default function App() {
  const cart = useSelector((state: StoreType) => state.allocatedBudget);
  const currency = useSelector((state: StoreType) => state.moneyCalc.currencyUnit);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const price = new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD" });
  const initializePayment = usePaystackPayment({
    reference: Date.now().toString(),
    email: "user@example.com",
    amount: Math.ceil(total) * 100,
    publicKey: "pk_test_69288cf7afda457f7a807e7c1f353c066b1ea7a5",
  });

  return (
    <main className="shop-shell">
      <header className="shop-header">
        <Link to="/" className="shop-brand">Online Shop</Link>
        <Link to="/" className="shop-button">Continue shopping</Link>
      </header>
      <h1 className="shop-cart-title">Your cart</h1>
      {cart.length === 0 ? (
        <section className="shop-message">
          <p>Your cart is empty.</p>
          <Link to="/" className="shop-button shop-primary">Browse products</Link>
        </section>
      ) : (
        <div className="shop-cart-layout">
          <ul className="shop-cart-list" aria-label="Cart items">
            {cart.map(({ id, items, quantity, unitPrice }) => (
              <li className="shop-cart-item" key={id}>
                <div>
                  <h2>{items}</h2>
                  <p>{price.format(unitPrice)} each</p>
                </div>
                <div className="shop-quantity">
                  <button className="shop-button" aria-label={`Decrease quantity of ${items}`}
                    disabled={quantity <= 1} onClick={() => dispatch(decreaseQuantity(id))}>−</button>
                  <span aria-live="polite">{quantity}</span>
                  <button className="shop-button" aria-label={`Increase quantity of ${items}`}
                    onClick={() => dispatch(increaseQuantity(id))}>+</button>
                </div>
                <div className="shop-line-total">
                  <strong>{price.format(quantity * unitPrice)}</strong>
                  <button className="shop-remove" aria-label={`Remove ${items}`}
                    onClick={() => dispatch(deleteItem(id))}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <section className="shop-summary">
            <h2>Order summary</h2>
            <label htmlFor="currencyUnit">Display currency</label>
            <select id="currencyUnit" value={currency}
              onChange={(event) => dispatch(currencyUnitChanged(event.target.value))}>
              <option value="">Choose a currency</option>
              <option value="USD">US dollar (USD)</option>
              <option value="NGN">Nigerian naira (NGN)</option>
            </select>
            <p className="shop-help">Changes the price label only. No currency conversion is applied.</p>
            <p className="shop-total"><span>Subtotal</span><strong>{price.format(total)}</strong></p>
            <button className="shop-button shop-primary" disabled={!currency || total <= 0}
              onClick={() => initializePayment({
                onSuccess: () => {
                  dispatch(clearCart());
                  navigate("/");
                  alert("Thanks for shopping with us");
                },
                onClose: () => navigate("/"),
              })}>
              Test checkout
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
