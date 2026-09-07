import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const fallbackProducts = [
  {
    id: 1,
    name: "Where the Sea Meets Sky",
    category: "Photography",
    price: 32,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=85",
    size: "A3 / unframed",
    description: "A quiet study of the north coast in its softest light.",
  },
  {
    id: 2,
    name: "Mussenden at Dusk",
    category: "Photography",
    price: 38,
    stock: 4,
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=85",
    size: "A2 / unframed",
    description:
      "The last blue hour over one of the north coast’s most loved landmarks.",
  },
  {
    id: 3,
    name: "Wild Atlantic",
    category: "Canvas",
    price: 85,
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1000&q=85",
    size: "60 × 40 cm",
    description: "Textured canvas, hand-stretched and ready to hang.",
  },
  {
    id: 4,
    name: "Green Fields, Home",
    category: "Photography",
    price: 28,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85",
    size: "A3 / unframed",
    description: "A little reminder that home is never very far away.",
  },
  {
    id: 5,
    name: "Tide Lines",
    category: "Limited edition",
    price: 55,
    stock: 3,
    image:
      "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=1000&q=85",
    size: "A2 / signed",
    description: "A numbered edition of 50, signed and printed locally.",
  },
  {
    id: 6,
    name: "The North Coast",
    category: "Canvas",
    price: 105,
    stock: 2,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1000&q=85",
    size: "80 × 50 cm",
    description:
      "A warm, expansive canvas for walls that need a little horizon.",
  },
];

const money = (value) => `£${Number(value).toFixed(2)}`;

function Icon({ name }) {
  const paths = {
    bag: (
      <>
        <path d="M5 8h14l-1 13H6L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    box: (
      <>
        <path d="m4 7 8-4 8 4-8 4-8-4Z" />
        <path d="M4 7v10l8 4 8-4V7M12 11v10" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function App() {
  const [products, setProducts] = useState(fallbackProducts);
  const [filter, setFilter] = useState("All work");
  const [cart, setCart] = useState([]);
  const [addedId, setAddedId] = useState(null);
  const [panel, setPanel] = useState(null);
  const [query, setQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Photography",
    price: "",
    stock: "",
    image: "",
    size: "",
    description: "",
  });

  useEffect(() => {
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setProducts)
      .catch(() => {});
  }, []);
  const categories = ["All work", "Photography", "Canvas", "Limited edition"];
  const visible = products.filter(
    (p) =>
      (filter === "All work" || p.category === filter) &&
      p.name.toLowerCase().includes(query.toLowerCase()),
  );
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const addToCart = (product) => {
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1800);
    setCart((items) => {
      const found = items.find((i) => i.id === product.id);
      return found
        ? items.map((i) =>
            i.id === product.id
              ? { ...i, qty: Math.min(i.qty + 1, product.stock) }
              : i,
          )
        : [...items, { ...product, qty: 1 }];
    });
  };
  const updateStock = async (id, stock) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((ps) => ps.map((p) => (p.id === id ? updated : p)));
    }
  };
  const addProduct = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const product = await res.json();
      setProducts((ps) => [...ps, product]);
      setForm({
        name: "",
        category: "Photography",
        price: "",
        stock: "",
        image: "",
        size: "",
        description: "",
      });
      setPanel("inventory");
    }
  };

  return (
    <>
      <div className="announcement">
        Free delivery across the UK on orders over £75 <span>·</span> Printed
        with care in Derry
      </div>
      <header>
        <a className="wordmark" href="#top">
          Ymmiji<span>nation</span>
          <i>®</i>
        </a>
        <nav>
          <a href="#shop">Shop prints</a>
          <a href="#story">Our story</a>
          <a href="#journal">Journal</a>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button search-toggle"
            onClick={() => setPanel("search")}
            aria-label="Search"
          >
            <Icon name="search" />
          </button>
          <button
            className="inventory-link"
            onClick={() => setPanel("inventory")}
          >
            <Icon name="box" /> Inventory
          </button>
          <button className="bag-button" onClick={() => setPanel("cart")}>
            <Icon name="bag" />
            <b>{cartCount}</b>
          </button>
          <button className="menu-toggle" onClick={() => setPanel("menu")} aria-label="Menu">
            <Icon name="menu" />
          </button>
        </div>
      </header>
      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Art from the edge of the island</p>
            <h1>
              Make room
              <br />
              <em>for wonder.</em>
            </h1>
            <p className="hero-text">
              Photographic prints and considered canvases inspired by the
              coastlines, roads and small moments of home.
            </p>
            <a className="button dark" href="#shop">
              Explore the collection <Icon name="arrow" />
            </a>
          </div>
          <div className="hero-art">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=90"
              alt="Misty mountain landscape"
            />
            <div className="art-note">
              <span>01 / 03</span>
              <strong>
                Light finds
                <br />a way in.
              </strong>
              <small>Original photograph · County Donegal</small>
            </div>
            <div className="scribble">
              from the
              <br />
              north coast
            </div>
          </div>
        </section>
        <section className="ticker">
          <span>
            New work / <strong>Places with feeling</strong>
          </span>
          <span>
            New work / <strong>Places with feeling</strong>
          </span>
          <span>
            New work / <strong>Places with feeling</strong>
          </span>
        </section>
        <section className="collection" id="shop">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The collection</p>
              <h2>
                Keep a little
                <br />
                <em>somewhere</em> close.
              </h2>
            </div>
            <p className="section-intro">
              A growing collection of photographic prints and canvases, made to
              bring the outside in.
            </p>
          </div>
          <div className="shop-toolbar">
            <div className="filters">
              {categories.map((c) => (
                <button
                  key={c}
                  className={filter === c ? "active" : ""}
                  onClick={() => setFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="results">
              {visible.length} pieces <span>·</span>{" "}
              <button onClick={() => setPanel("search")}>
                Search <Icon name="search" />
              </button>
            </div>
          </div>
          <div className="product-grid">
            {visible.map((product, index) => (
              <article
                className={`product-card card-${index % 3}`}
                key={product.id}
              >
                <button
                  className="product-image"
                  onClick={() => addToCart(product)}
                >
                  <img src={product.image} alt={product.name} />
                  <span className={`quick-add ${addedId === product.id ? "added" : ""}`}>
                    {addedId === product.id
                      ? `Added to bag · ${cart.find((item) => item.id === product.id)?.qty ?? 1}`
                      : "Add to bag"} <Icon name="plus" />
                  </span>
                </button>
                <div className="product-info">
                  <div>
                    <span className="category">{product.category}</span>
                    <h3>{product.name}</h3>
                  </div>
                  <strong>{money(product.price)}</strong>
                </div>
                <p className="product-size">
                  {product.size} <span>·</span>{" "}
                  {product.stock ? `${product.stock} available` : "Sold out"}
                </p>
              </article>
            ))}
          </div>
        </section>
        <section className="story" id="story">
          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1000&q=85"
              alt="Rocky coast in sunlight"
            />
            <span>
              Ymmijination
              <br />
              studio notes / 001
            </span>
          </div>
          <div className="story-copy">
            <p className="eyebrow">A note from Jimmy</p>
            <h2>
              Made for the
              <br />
              <em>places we know.</em>
            </h2>
            <p>
              Ymmijination is a small print studio in Derry, Northern Ireland.
              The name is a little bit image, a little bit imagination and my
              own name, Jimmy, turned around.
            </p>
            <p>
              Every piece starts with a place that made me pause. Printed in
              small runs, packed by hand, and sent out into the world with a
              hope it makes your space feel more like yours.
            </p>
            <button className="text-link" onClick={() => setPanel("story")}>
              Read our story <Icon name="arrow" />
            </button>
          </div>
        </section>
        <section className="newsletter" id="journal">
          <p className="eyebrow">The field notes</p>
          <h2>Good things, occasionally.</h2>
          <p>New work, studio stories and places worth putting on your list.</p>
          <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}>
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Your email address"
            />
            <button className="button dark">{subscribed ? "You're on the list" : <>Sign me up <Icon name="arrow" /></>}</button>
          </form>
        </section>
      </main>
      <footer>
        <a className="wordmark" href="#top">
          Ymmiji<span>nation</span>
          <i>®</i>
        </a>
        <p>Photographic prints from Derry, Northern Ireland.</p>
        <span>© 2024 Ymmijination</span>
        <div className="site-credit">
          Mockup Website by JPJ Solutions (2026)
        </div>
      </footer>
      {panel && (
        <div
          className="overlay"
          onMouseDown={(e) => e.target === e.currentTarget && setPanel(null)}
        >
          <aside className={`side-panel ${panel}`}>
            <button className="close" onClick={() => setPanel(null)}>
              <Icon name="close" />
            </button>
            {panel === "cart" && (
              <>
                <p className="eyebrow">Your selection</p>
                <h2>
                  Your bag <small>{cartCount} items</small>
                </h2>
                {cart.length ? (
                  <>
                    {cart.map((item) => (
                      <div className="cart-item" key={item.id}>
                        <img src={item.image} alt="" />
                        <div>
                          <strong>{item.name}</strong>
                          <span>{item.size}</span>
                          <b>{money(item.price * item.qty)}</b>
                        </div>
                      </div>
                    ))}
                    <div className="cart-total">
                      <span>Total</span>
                      <strong>
                        {money(cart.reduce((s, i) => s + i.price * i.qty, 0))}
                      </strong>
                    </div>
                    <button className="button dark full" onClick={() => setPanel("checkout")}>
                      Checkout <Icon name="arrow" />
                    </button>
                  </>
                ) : (
                  <div className="empty">
                    <p>Your bag is waiting for something special.</p>
                    <a href="#shop" onClick={() => setPanel(null)}>
                      Browse the collection <Icon name="arrow" />
                    </a>
                  </div>
                )}
              </>
            )}
            {panel === "search" && (
              <>
                <p className="eyebrow">Find a piece</p>
                <h2>Search</h2>
                <input
                  className="panel-search"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try “coast” or “canvas”"
                />
                <div className="search-results">
                  {query &&
                    visible.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          addToCart(p);
                          setPanel("cart");
                        }}
                      >
                        <img src={p.image} alt="" />
                        <span>
                          {p.name}
                          <small>{money(p.price)}</small>
                        </span>
                        <Icon name="arrow" />
                      </button>
                    ))}
                </div>
              </>
            )}
            {panel === "menu" && (
              <>
                <p className="eyebrow">Explore Ymmijination</p>
                <h2>Find your<br /><em>place.</em></h2>
                <div className="mobile-links">
                  <a href="#shop" onClick={() => setPanel(null)}>Shop prints <Icon name="arrow" /></a>
                  <a href="#story" onClick={() => setPanel(null)}>Our story <Icon name="arrow" /></a>
                  <a href="#journal" onClick={() => setPanel(null)}>Journal <Icon name="arrow" /></a>
                </div>
              </>
            )}
            {panel === "checkout" && (
              <>
                <p className="eyebrow">Checkout</p>
                <h2>Almost<br /><em>yours.</em></h2>
                <p className="panel-lede">This portfolio storefront is a working mockup. Connect your preferred payment provider here to take live orders.</p>
                <button className="button dark full" onClick={() => setPanel(null)}>Continue browsing <Icon name="arrow" /></button>
              </>
            )}
            {panel === "story" && (
              <>
                <p className="eyebrow">The Ymmijination story</p>
                <h2>
                  Made for the <em>places we know.</em>
                </h2>
                <img
                  className="story-panel-image"
                  src="https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1000&q=85"
                  alt="Rocky coast in sunlight"
                />
                <p className="panel-lede">
                  Ymmijination is a small print studio in Derry, Northern
                  Ireland. The name is a little bit image, a little bit
                  imagination and my own name, Jimmy, turned around.
                </p>
                <p className="panel-lede">
                  Every piece starts with a place that made me pause. Printed
                  in small runs, packed by hand, and sent out into the world
                  with a hope it makes your space feel more like yours.
                </p>
                <p className="panel-lede">
                  From the north coast to your wall, thanks for making room for
                  a little wonder.
                </p>
              </>
            )}
            {panel === "inventory" && (
              <>
                <p className="eyebrow">Studio console</p>
                <h2>
                  Inventory <small>{products.length} products</small>
                </h2>
                <p className="panel-lede">
                  Update available quantities or add a new piece to the
                  collection. Changes are saved to SQLite.
                </p>
                <div className="stock-list">
                  {products.map((p) => (
                    <div className="stock-row" key={p.id}>
                      <img src={p.image} alt="" />
                      <span>
                        {p.name}
                        <small>{p.category}</small>
                      </span>
                      <input
                        aria-label={`${p.name} stock`}
                        type="number"
                        min="0"
                        value={p.stock}
                        onChange={(e) => updateStock(p.id, e.target.value)}
                      />
                      <em>in stock</em>
                    </div>
                  ))}
                </div>
                <button
                  className="button outline full"
                  onClick={() => setPanel("add")}
                >
                  <Icon name="plus" /> Add product
                </button>
              </>
            )}
            {panel === "add" && (
              <>
                <p className="eyebrow">Studio console</p>
                <h2>Add a product</h2>
                <form className="product-form" onSubmit={addProduct}>
                  {[
                    ["name", "Product name"],
                    ["price", "Price (£)"],
                    ["stock", "Stock"],
                    ["image", "Image URL"],
                    ["size", "Size / format"],
                  ].map(([key, label]) => (
                    <input
                      key={key}
                      required
                      type={
                        key === "price" || key === "stock" ? "number" : "text"
                      }
                      placeholder={label}
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                    />
                  ))}
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    {categories.slice(1).map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Short description (optional)"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                  <button className="button dark full">
                    Save product <Icon name="arrow" />
                  </button>
                </form>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
