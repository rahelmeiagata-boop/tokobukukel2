document.addEventListener("DOMContentLoaded", () => {
  const receiptBox = document.getElementById("receipt");
  const historyBox = document.getElementById("history");
  const totalDisplay = document.getElementById("totalDisplay");
  const exportBtn = document.getElementById("exportBtn");

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  let total = cart.reduce((sum, item) => sum + item.price, 0);
  let discount = 0;

  if (total >= 500000) discount = 0.25;
  else if (total >= 400000) discount = 0.20;
  else if (total >= 300000) discount = 0.15;

  const discountAmount = Math.floor(total * discount);
  const finalTotal = total - discountAmount;

  totalDisplay.innerHTML = `
    <p>Total Belanja: Rp${total.toLocaleString()}</p>
    <p>Diskon: ${discount * 100}% (-Rp${discountAmount.toLocaleString()})</p>
    <p><strong>Total Bayar: Rp${finalTotal.toLocaleString()}</strong></p>
  `;

  function showLoadingAnimation() {
    receiptBox.innerHTML = `<p style="text-align:center;">⏳ Memproses pembayaran...</p>`;
  }

  function showReceipt(receiptHTML) {
  setTimeout(() => {
    receiptBox.innerHTML = receiptHTML;
    receiptBox.classList.add("fade-in");
    exportBtn.style.display = "inline-block";
    showSuccessToast();
  }, 1000);
}

  function renderHistory() {
    const history = JSON.parse(localStorage.getItem("history") || "[]");
    if (history.length === 0) {
      historyBox.innerHTML = "";
      return;
    }

    const historyHTML = history.map(h => `
      <div class="history-entry">
        <p><strong>${h.time}</strong></p>
        <p>Metode: ${h.method}</p>
        <p>Total: Rp${h.total.toLocaleString()}</p>
        <p>Diskon: Rp${h.discount.toLocaleString()}</p>
        <p>Dibayar: Rp${h.paid.toLocaleString()}</p>
        <p>Kembalian: Rp${h.change.toLocaleString()}</p>
      </div>
    `).join("");

    historyBox.innerHTML = `<h3> Riwayat Pembayaran</h3>${historyHTML}`;
  }
  const paymentMethod = document.getElementById("paymentMethod");
const subMethodContainer = document.getElementById("subMethodContainer");
const subMethod = document.getElementById("subMethod");

paymentMethod.addEventListener("change", () => {
  const method = paymentMethod.value;
  subMethod.innerHTML = "";

  if (method === "ewallet") {
    ["GoPay", "OVO", "DANA"].forEach(opt => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      subMethod.appendChild(o);
    });
    subMethodContainer.style.display = "block";
  } else if (method === "transfer") {
    ["BRI", "BNI", "Mandiri", "BCA"].forEach(opt => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      subMethod.appendChild(o);
    });
    subMethodContainer.style.display = "block";
  } else {
    subMethodContainer.style.display = "none";
  }
});

  document.getElementById("paymentForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const method = document.getElementById("paymentMethod").value;
    const paid = parseInt(document.getElementById("amountPaid").value);

    if (isNaN(paid) || paid <= 0) {
      alert("Masukkan jumlah bayar yang valid!");
      return;
    }

    if (paid < finalTotal) {
      alert("Jumlah bayar kurang dari total yang harus dibayar!");
      return;
    }

    const change = paid - finalTotal;
    showLoadingAnimation();

    const receipt = `
      <h2> Pembayaran Berhasil</h2>
      <p>Metode: ${method}</p>
      <p>Total Belanja: Rp${total.toLocaleString()}</p>
      <p>Diskon: ${discount * 100}% (-Rp${discountAmount.toLocaleString()})</p>
      <p>Total Bayar: Rp${finalTotal.toLocaleString()}</p>
      <p>Dibayar: Rp${paid.toLocaleString()}</p>
      <p>🧾 Terima kasih telah membeli di Toko Buku Logika!</p>
    `;

    const history = JSON.parse(localStorage.getItem("history") || "[]");
    history.push({
      method,
      total,
      discount: discountAmount,
      paid,
      change,
      time: new Date().toLocaleString()
    });
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.removeItem("cart");
    localStorage.removeItem("totalPrice");

    showReceipt(receipt);
    renderHistory();
  });

  exportBtn.addEventListener("click", () => {
    const history = JSON.parse(localStorage.getItem("history") || "[]");
    if (history.length === 0) {
      alert("Belum ada riwayat untuk diekspor.");
      return;
    }

    let content = "Riwayat Pembayaran:\n\n";
    history.forEach(h => {
      content += `Waktu: ${h.time}\nMetode: ${h.method}\nTotal: Rp${h.total.toLocaleString()}\nDiskon: Rp${h.discount.toLocaleString()}\nDibayar: Rp${h.paid.toLocaleString()}\nKembalian: Rp${h.change.toLocaleString()}\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "riwayat_pembayaran.txt";
    link.click();
  });

  function showSuccessToast() {
  const toast = document.getElementById("successToast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

  renderHistory();
});