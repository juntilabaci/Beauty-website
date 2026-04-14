const grid = document.getElementById("productGrid");

let products = [];
let cart = [];
let wishlist = [];

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});

/* ================= LOAD PRODUCTS ================= */
async function loadProducts() {
  try {
    const res = await fetch("http://localhost:3000/products");

    if (!res.ok) {
      console.log("Server error:", res.status);
      return;
    }

    const data = await res.json();

    products = Array.isArray(data) ? data : (data.products || []);

    render(products);

  } catch (err) {
    console.log("FETCH ERROR:", err);
  }
}

/* ================= IMAGES BY TYPE ================= */
const typeImages = {
  cleanser: [
    "https://images.unsplash.com/photo-1616683693504-3ea7e9ad7a7e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"
  ],
  serum: [
    "https://images.unsplash.com/photo-1612810436541-336d7c7a1b4b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1616683693504-3ea7e9ad7a7e?auto=format&fit=crop&w=600&q=80"
  ],
  cream: [
    "https://images.unsplash.com/photo-1612810436541-336d7c7a1b4b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=600&q=80"
  ],
  toner: [
    "https://images.unsplash.com/photo-1616683693504-3ea7e9ad7a7e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1612810436541-336d7c7a1b4b?auto=format&fit=crop&w=600&q=80"
  ]
};

/* ================= GET IMAGE ================= */
function getImage(type, id) {
  const images = typeImages[type];

  if (!images) {
    return "https://via.placeholder.com/600x600?text=No+Image";
  }

  return images[id % images.length];
}

/* ================= RENDER ================= */
function render(list) {
  const grid = document.getElementById("productGrid");

  if (!grid) return;

  if (!Array.isArray(list) || list.length === 0) {
    grid.innerHTML = "<p>No products found</p>";
    return;
  }

  let html = "";

  list.forEach(p => {
    html += `
      <div class="card">

        <img
          src="${getImage(p.type, p.id)}"
          onerror="this.src='https://via.placeholder.com/600x600?text=No+Image'"
          onclick="openModal('${p.id}')"
        >

        <h4>${p.name}</h4>
        <p>${p.desc}</p>
        <span>€${Number(p.price).toFixed(2)}</span>

        <div style="display:flex; gap:10px; justify-content:center; margin-top:10px;">
          <button onclick="addToCart('${p.id}')">Add to Cart</button>
          <button onclick="addToWishlist('${p.id}')">❤</button>
        </div>

      </div>
    `;
  });

  grid.innerHTML = html;
}

/* ================= CART ================= */
function addToCart(id) {
  const item = products.find(p => String(p.id) === String(id));
  if (!item) return;

  cart.push(item);

  const counter = document.getElementById("cart-count");
  if (counter) counter.innerText = cart.length;
}

/* ================= WISHLIST ================= */
function addToWishlist(id) {
  const item = products.find(p => String(p.id) === String(id));
  if (!item) return;

  if (!wishlist.some(p => String(p.id) === String(id))) {
    wishlist.push(item);
  }

  alert("Added to wishlist ❤️");
}

/* ================= MODAL ================= */
function openModal(id) {
  const p = products.find(x => String(x.id) === String(id));
  if (!p) return;

  const modal = document.getElementById("modal");
  if (!modal) return;

  document.getElementById("modalImg").src = getImage(p.type, p.id);
  document.getElementById("modalTitle").innerText = p.name;
  document.getElementById("modalDesc").innerText = p.desc;
  document.getElementById("modalPrice").innerText = "€" + Number(p.price).toFixed(2);

  modal.style.display = "flex";
}

/* ================= CLOSE MODAL ================= */
window.onclick = function (e) {
  const modal = document.getElementById("modal");
  if (modal && e.target === modal) {
    modal.style.display = "none";
  }
};