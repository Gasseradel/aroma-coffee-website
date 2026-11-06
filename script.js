
/* ==================================================
   Aroma Café — Main JavaScript
   ================================================== */


/* ==================== 1. Global Variables ==================== */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const toast = document.querySelector(".toast");
const yearElement = document.querySelector("#year");

const productTrack = document.getElementById("productTrack");
const productDots = document.getElementById("productDots");
const productPrev = document.querySelector(".carousel-prev");
const productNext = document.querySelector(".carousel-next");


/* ==================== 2. Mobile Navigation ==================== */

if (menuToggle && mainNav) {
  // Toggle the mobile navigation menu.
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu" : "Abrir menu"
    );
  });

  // Close the menu after selecting a navigation link.
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    });
  });
}


/* ==================== 3. Order Notification ==================== */

let toastTimer;

document.querySelectorAll(".order-link").forEach((button) => {
  // Display a notification when a product order button is clicked.
  button.addEventListener("click", () => {
    if (!toast) return;

    toast.textContent =
      `${button.dataset.product} : Contact us to place your order..`;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    // Hide the notification after 2.8 seconds.
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  });
});


/* ==================== 4. Automatic Copyright Year ==================== */

// Update the copyright year automatically.
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* ==================== 5. Coffee Products Carousel ==================== */

if (productTrack && productDots && productPrev && productNext) {
  const productCards = Array.from(
    productTrack.querySelectorAll(".product-card")
  );

  let currentProductIndex = 0;
  let resizeTimer;

  // Return the number of visible products for each screen size.
  function getVisibleProducts() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;

    return 4;
  }

  // Calculate the last available carousel position.
  function getMaxIndex() {
    return Math.max(
      0,
      productCards.length - getVisibleProducts()
    );
  }

  // Calculate the horizontal distance between product cards.
  function getProductStep() {
    if (!productCards.length) return 0;

    const cardWidth =
      productCards[0].getBoundingClientRect().width;

    const trackStyle = window.getComputedStyle(productTrack);
    const gap = parseFloat(trackStyle.columnGap) || 0;

    return cardWidth + gap;
  }

  // Generate navigation dots for all available positions.
  function createDots() {
    productDots.innerHTML = "";

    const maxIndex = getMaxIndex();

    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute(
        "aria-label",
        `Go to product position ${i + 1}`
      );

      dot.addEventListener("click", () => {
        currentProductIndex = i;
        updateCarousel();
      });

      productDots.appendChild(dot);
    }
  }

  // Update the carousel position and active navigation dot.
  function updateCarousel() {
    const maxIndex = getMaxIndex();

    // Wrap around when the first or last position is reached.
    if (currentProductIndex > maxIndex) {
      currentProductIndex = 0;
    }

    if (currentProductIndex < 0) {
      currentProductIndex = maxIndex;
    }

    const offset = currentProductIndex * getProductStep();

    productTrack.style.transform =
      `translateX(-${offset}px)`;

    const dots = productDots.querySelectorAll(".carousel-dot");

    dots.forEach((dot, index) => {
      const isActive = index === currentProductIndex;

      dot.classList.toggle("active", isActive);

      dot.setAttribute(
        "aria-current",
        isActive ? "true" : "false"
      );
    });

    // Keep both arrows enabled for circular navigation.
    productPrev.disabled = false;
    productNext.disabled = false;
  }

  // Navigate to the previous position.
  productPrev.addEventListener("click", () => {
    const maxIndex = getMaxIndex();

    currentProductIndex =
      currentProductIndex <= 0
        ? maxIndex
        : currentProductIndex - 1;

    updateCarousel();
  });

  // Navigate to the next position.
  productNext.addEventListener("click", () => {
    const maxIndex = getMaxIndex();

    currentProductIndex =
      currentProductIndex >= maxIndex
        ? 0
        : currentProductIndex + 1;

    updateCarousel();
  });

  // Rebuild the navigation dots after resizing the screen.
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      createDots();
      updateCarousel();
    }, 150);
  });

  // Initialize the carousel.
  createDots();
  updateCarousel();
}
