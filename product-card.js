(function () {

  /* ================================
     PRODUCT CARD GRID – REUSABLE
  ================================= */

  document.querySelectorAll(".product-card-grid").forEach(grid => {

    const loadMoreBtn = grid.closest(".product-card-section")
      ?.querySelector(".load-more-btn");

    const DESKTOP_LIMIT = parseInt(grid.dataset.desktopLimit, 10) || 36;
    const MOBILE_LIMIT = parseInt(grid.dataset.mobileLimit, 10) || 10;
    const LIMIT = window.innerWidth < 768 ? MOBILE_LIMIT : DESKTOP_LIMIT;

    const cards = Array.from(grid.children);
    let visibleCount = LIMIT;

    grid.innerHTML = "";
    cards.slice(0, visibleCount).forEach(card => grid.appendChild(card));

    if (cards.length <= visibleCount && loadMoreBtn) {
      loadMoreBtn.style.display = "none";
    }

    /* ⭐ FAKE RATINGS */
    function applyFakeRatings(scope = grid) {
      scope.querySelectorAll(".product-rating").forEach(el => {
        if (!el.dataset.value) {
          el.dataset.value = (Math.random() * (5 - 4.5) + 4.5).toFixed(2);
        }
      });
    }

    applyFakeRatings();

    /* LOAD MORE */
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        const nextItems = cards.slice(visibleCount, visibleCount + LIMIT);
        nextItems.forEach(card => grid.appendChild(card));
        visibleCount += LIMIT;

        applyFakeRatings();

        if (visibleCount >= cards.length) {
          loadMoreBtn.style.display = "none";
        }
      });
    }

    /* CARD CLICK → PRODUCT PAGE */
    grid.addEventListener("click", e => {
      if (e.target.closest(".js-add-to-cart")) return;

      const card = e.target.closest(".product-card");
      if (!card) return;

      const url = card.dataset.url;
      if (url) window.location.href = url;
    });

  });

  /* ADD TO CART (GLOBAL) */
  document.addEventListener("click", e => {
    const btn = e.target.closest(".js-add-to-cart");
    if (!btn) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Adding...";

    fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: btn.dataset.variant,
        quantity: 1
      })
    })
    .then(() => {
      btn.textContent = "Added ✓";

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
      }, 700);

      document.dispatchEvent(new Event("cart:open"));
    })
    .catch(() => {
      btn.disabled = false;
      btn.textContent = originalText;
    });
  });

})();
