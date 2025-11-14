document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const list = document.getElementById("cartItems");
  const totalDisplay = document.getElementById("totalPrice");
  const checkoutBtn = document.getElementById("checkoutBtn");

  function renderCart() {
    list.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      list.innerHTML = "<p>Keranjang kosong. Silakan tambahkan buku dari etalase.</p>";
      checkoutBtn.style.display = "none";
      totalDisplay.textContent = "Rp0";
      return;
    }

    cart.forEach((item, index) => {
      const li = document.createElement("li");
      li.style.marginBottom = "1rem";
      li.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <label style="flex:1;">
            <input type="checkbox" class="item-check" data-index="${index}" checked />
            ${item.title} - Rp${item.price.toLocaleString()}
          </label>
          <button class="remove-btn" data-index="${index}">❌</button>
        </div>
      `;
      list.appendChild(li);
    });

    updateTotal();
  }

  function updateTotal() {
    const checkboxes = document.querySelectorAll(".item-check");
    let total = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) {
        const i = parseInt(cb.dataset.index);
        total += cart[i].price;
      }
    });
    totalDisplay.textContent = `Rp${total.toLocaleString()}`;
  }

  list.addEventListener("change", e => {
    if (e.target.classList.contains("item-check")) {
      updateTotal();
    }
  });

  list.addEventListener("click", e => {
    if (e.target.classList.contains("remove-btn")) {
      const index = parseInt(e.target.dataset.index);
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  });

  checkoutBtn.addEventListener("click", () => {
    const selected = [];
    const checkboxes = document.querySelectorAll(".item-check");
    checkboxes.forEach(cb => {
      if (cb.checked) {
        const i = parseInt(cb.dataset.index);
        selected.push(cart[i]);
      }
    });

    if (selected.length === 0) {
      alert("Pilih minimal satu buku untuk dibayar.");
      return;
    }

    const total = selected.reduce((sum, item) => sum + item.price, 0);
    localStorage.setItem("cart", JSON.stringify(selected));
    localStorage.setItem("totalPrice", total);
    window.location.href = "checkout.html";
  });

  renderCart();
});