let products = [];
let wishlist = [];

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("http://localhost:3000/products");
  products = await res.json();

  loadWishlist();
});

function loadWishlist() {
  const ids = JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlist = products.filter(p => ids.includes(p.id));

  render();
}

function render() {
  const grid = document.getElementById("wishlistGrid");

  let html = "";

  wishlist.forEach(p => {
    html += `
      <div class="card">
        <img src="${p.image}">
        <h4>${p.name}</h4>
        <p>${p.desc}</p>
        <span>€${p.price}</span>
      </div>
    `;
  });

  grid.innerHTML = html;
}