const grid = document.getElementById("productGrid");

let products = [];
let filtered = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  updateWishlistCount();

  document.getElementById("brandFilter")?.addEventListener("change", applyFilters);
  document.getElementById("typeFilter")?.addEventListener("change", applyFilters);
  document.getElementById("concernFilter")?.addEventListener("change", applyFilters);
});


async function loadProducts() {
  try {
    const res = await fetch("http://localhost:3000/products");

    if (!res.ok) {
      console.log("Server error:", res.status);
      return;
    }

    const data = await res.json();

    products = Array.isArray(data) ? data : (data.products || []);
    filtered = products;

    render(filtered);

  } catch (err) {
    console.log("FETCH ERROR:", err);
  }
}


function applyFilters() {
  const brand = document.getElementById("brandFilter").value.toLowerCase();
  const type = document.getElementById("typeFilter").value.toLowerCase();
  const concern = document.getElementById("concernFilter").value.toLowerCase();

  filtered = products.filter(p => {
    const matchBrand =
      brand === "all" || (p.brand || "").toLowerCase() === brand;

    const matchType =
      type === "all" || (p.type || "").toLowerCase() === type;

    const matchConcern =
      concern === "all" || (p.concern || "").toLowerCase().includes(concern);

    return matchBrand && matchType && matchConcern;
  });

  render(filtered);
}


const typeImages = {
  cleanser: [
    "https://images.unsplash.com/photo-1616683693504-3ea7e9ad7a7e?auto=format&fit=crop&w=600&q=80"
  ],
  serum: [
    "https://images.unsplash.com/photo-1612810436541-336d7c7a1b4b?auto=format&fit=crop&w=600&q=80"
  ],
  cream: [
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=600&q=80"
  ],
  toner: [
    "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=600&q=80"
  ]
};

function getImage(type, id) {
  const images = typeImages[type];
  if (!images) return "https://via.placeholder.com/600x600?text=No+Image";
  return images[0];
}


function render(list) {
  if (!grid) return;

  if (!Array.isArray(list) || list.length === 0) {
    grid.innerHTML = "<p>No products found</p>";
    return;
  }

  const wishlist = getWishlist();

  grid.innerHTML = list.map(p => {
    const isFav = wishlist.some(w => String(w.id) === String(p.id));

    return `
      <div class="card">

        <img
          src="${getImage(p.type, p.id)}"
          onclick="openModal('${p.id}')"
        >

        <h4>${p.name}</h4>
        <p>${p.desc || ""}</p>
        <span>€${Number(p.price).toFixed(2)}</span>

        <div style="display:flex; gap:10px; justify-content:center; margin-top:10px;">
          <button onclick="addToCart('${p.id}')">Add to Cart</button>
          <button onclick="addToWishlist('${p.id}', this)">
            ${isFav ? "❤️" : "♡"}
          </button>
        </div>

      </div>
    `;
  }).join("");
}


function addToCart(id) {
  const item = products.find(p => String(p.id) === String(id));
  if (!item) return;

  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));

  document.getElementById("cart-count").innerText = cart.length;
}


function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function addToWishlist(id, btn) {
  const item = products.find(p => String(p.id) === String(id));
  if (!item) return;

  let wishlist = getWishlist();

  const exists = wishlist.some(p => String(p.id) === String(id));

  if (!exists) {
    wishlist.push(item);
    if (btn) btn.innerText = "❤️";
  } else {
    wishlist = wishlist.filter(p => String(p.id) !== String(id));
    if (btn) btn.innerText = "♡";
  }

  saveWishlist(wishlist);
  updateWishlistCount();
}


function updateWishlistCount() {
  const el = document.getElementById("wishlist-count");
  if (el) el.innerText = getWishlist().length;
}


function openModal(id) {
  const p = products.find(x => String(x.id) === String(id));
  if (!p) return;

  document.getElementById("modalImg").src = getImage(p.type, p.id);
  document.getElementById("modalTitle").innerText = p.name;
  document.getElementById("modalDesc").innerText = p.desc || "";
  document.getElementById("modalPrice").innerText = "€" + Number(p.price).toFixed(2);

  document.getElementById("modal").style.display = "flex";
}


window.onclick = function (e) {
  const modal = document.getElementById("modal");
  if (modal && e.target === modal) {
    modal.style.display = "none";
  }
};


window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.openModal = openModal;
window.applyFilters = applyFilters;