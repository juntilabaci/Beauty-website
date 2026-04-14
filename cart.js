let products = [];
let cart = [];

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("http://localhost:3000/products");
  products = await res.json();

  loadCart();
});

function loadCart() {
  const ids = JSON.parse(localStorage.getItem("cart")) || [];

  cart = products.filter(p => ids.includes(p.id));

  render();
}

function render() {
  const grid = document.getElementById("cartGrid");

  let total = 0;
  let html = "";

  cart.forEach(p => {
    total += Number(p.price);

    html += `
      <div class="card">
        <img src="${p.image}">
        <h4>${p.name}</h4>
        <span>€${p.price}</span>
      </div>
    `;
  });

  grid.innerHTML = html;
  document.getElementById("total").innerText = "Total: €" + total.toFixed(2);
}