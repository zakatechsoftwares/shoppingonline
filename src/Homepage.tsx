import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { allocate, deleteItem } from "./redux/allocatedSlice";
import { StoreType } from "./redux/store";

type Product = {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number;
};

const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function Homepage() {
  const cart = useSelector((state: StoreType) => state.allocatedBudget);
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products?limit=12", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Catalogue request failed");
        const data: Product[] = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid catalogue");
        if (controller.signal.aborted) return;
        setProducts(data);
        setStatus("ready");
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    }
    void loadProducts();
    return () => controller.abort();
  }, [attempt]);

  const categories = [...new Set(products.map((product) => product.category))].sort();
  const query = search.trim().toLowerCase();
  const visibleProducts = products.filter((product) =>
    (!category || product.category === category) && product.title.toLowerCase().includes(query)
  );
  const quantity = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <main className="shop-shell">
      <header className="shop-header">
        <Link to="/" className="shop-brand">Online Shop</Link>
        <Link to="/cart" className="shop-button">
          <i className="bi bi-bag" aria-hidden="true" /> Cart <span className="shop-count">{quantity}</span>
        </Link>
      </header>

      <section className="shop-hero">
        <h1>Shop the collection</h1>
        <p>Browse the catalogue and add your favourites to your cart.</p>
      </section>

      <section aria-label="Product catalogue">
        <div className="shop-filters">
          <label>Search products
            <input type="search" placeholder="Search by product name" value={search}
              onChange={(event) => setSearch(event.target.value)} />
          </label>
          <label>Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">All categories</option>
              {categories.map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
        </div>

        {status === "loading" && <p className="shop-message" role="status">Loading products…</p>}
        {status === "error" && (
          <div className="shop-message">
            <p role="alert">The catalogue couldn’t load.</p>
            <button className="shop-button" onClick={() => { setStatus("loading"); setAttempt(attempt + 1); }}>
              Try again
            </button>
          </div>
        )}
        {status === "ready" && (
          <>
            <p className="shop-results" role="status">
              {visibleProducts.length} {visibleProducts.length === 1 ? "product" : "products"}
            </p>
            {visibleProducts.length === 0 && (
              <div className="shop-message">
                <p>No products match your filters.</p>
                <button className="shop-button" onClick={() => { setSearch(""); setCategory(""); }}>
                  Clear filters
                </button>
              </div>
            )}
            <div className="shop-grid">
              {visibleProducts.map((product) => {
                const id = String(product.id);
                const inCart = cart.some((item) => item.id === id);
                return (
                  <article className="shop-product" key={id}>
                    <div className="shop-product-image">
                      <img src={product.image} alt="" loading="lazy" />
                    </div>
                    <div className="shop-product-body">
                      <p className="shop-category">{product.category}</p>
                      <h2>{product.title}</h2>
                      <details>
                        <summary>Product details</summary>
                        <p>{product.description}</p>
                      </details>
                      <strong>{price.format(product.price)}</strong>
                      <button className={inCart ? "shop-button" : "shop-button shop-primary"}
                        aria-label={inCart ? `Remove ${product.title} from cart` : `Add ${product.title} to cart`}
                        onClick={() => {
                          if (inCart) {
                            dispatch(deleteItem(id));
                          } else {
                            dispatch(allocate({ id, items: product.title, quantity: 1, unitPrice: product.price }));
                          }
                        }}
                      >
                        {inCart ? "Remove from cart" : "Add to cart"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
