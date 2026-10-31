/* ==========================================================
   IMak - script.js
   A Story You Can Wear.
   Vanilla JavaScript - no frameworks, no backend, no paid services.
   Works with index.html + style.css in the same folder.
   ========================================================== */

(function () {
  'use strict';

  /* ==========================================================
     1. SETTINGS  (easy to edit)
     ========================================================== */

  // WhatsApp number in international format, digits only (no + or spaces)
  var WHATSAPP_NUMBER = '9779767258429';

  // Key used to save the cart in the browser
  var CART_STORAGE_KEY = 'imak_cart_v1';

  // Maximum quantity allowed for one product + size
  var MAX_QTY = 10;

  // Currency symbol shown before prices
  var CURRENCY = 'रु';


  /* ==========================================================
     2. PRODUCT DATA  (EDIT THIS SECTION)
     ----------------------------------------------------------
     To change a product, edit its name, price, image,
     description, sizes or details below.

     IMPORTANT - PLACEHOLDERS:
     - Every "price" below is a PLACEHOLDER (1000). Replace it
       with your real price in NPR before publishing.
     - "collections" decides which filter shows the product:
         'anime'  = Anime Collection
         'shelby' = The Shelby Era
         'new'    = New Arrivals
         'best'   = Best Sellers
       The first value is the main collection shown on the card.
       Add or remove 'new' / 'best' to match your real products.
     - "badge" is optional small text on the image, e.g. "New".
       Leave it as '' to show no badge.
     - Each "id" must be unique. Do not use spaces in an id.
     ========================================================== */
  var PRODUCTS = [
    {
      id: 'anime-01',
      name: 'Anime Tee 01',                       // EDIT: product name
      price: 1000,                                // EDIT: price in NPR (placeholder)
      image: 'https://i.ibb.co/N8k4CXZ/Your-favorite-anime-is-here-Manga-inspired-artwork-Premium-Cotton-Round-Neck-Made-f-heic.jpg',
      description: 'Manga-inspired artwork on a premium cotton round neck tee.', // EDIT
      sizes: ['S', 'M', 'L', 'XL'],               // EDIT: available sizes
      collections: ['anime', 'new'],              // EDIT: collections / filters
      badge: '',                                  // EDIT: optional badge text
      details: [
        'Premium cotton round neck',
        'Manga-inspired artwork',
        'Cash on Delivery',
        'Delivery all over Nepal'
      ]
    },
    {
      id: 'anime-02',
      name: 'Anime Tee 02',
      price: 1000,
      image: 'https://i.ibb.co/jvy7YhG2/Your-favorite-anime-is-here-Manga-inspired-artwork-Premium-Cotton-Round-Neck-Made-f-heic.jpg',
      description: 'Manga-inspired artwork on a premium cotton round neck tee.',
      sizes: ['S', 'M', 'L', 'XL'],
      collections: ['anime', 'best'],
      badge: '',
      details: [
        'Premium cotton round neck',
        'Manga-inspired artwork',
        'Cash on Delivery',
        'Delivery all over Nepal'
      ]
    },
    {
      id: 'anime-03',
      name: 'Anime Tee 03',
      price: 1000,
      image: 'https://i.ibb.co/Z1JsDdRz/Your-favorite-anime-is-here-Manga-inspired-artwork-Premium-Cotton-Round-Neck-Made-f-heic.jpg',
      description: 'Manga-inspired artwork on a premium cotton round neck tee.',
      sizes: ['S', 'M', 'L', 'XL'],
      collections: ['anime'],
      badge: '',
      details: [
        'Premium cotton round neck',
        'Manga-inspired artwork',
        'Cash on Delivery',
        'Delivery all over Nepal'
      ]
    },
    {
      id: 'shelby-01',
      name: 'The Shelby Era Tee 01',
      price: 1000,
      image: 'https://i.ibb.co/0yYrj6yv/THE-SHELBY-ERA-Classic-gangster-era-aesthetic-reimagined-for-everyday-streetwear-Premium-heic.jpg',
      description: 'Classic gangster-era aesthetic reimagined for everyday streetwear.',
      sizes: ['S', 'M', 'L', 'XL'],
      collections: ['shelby', 'new'],
      badge: '',
      details: [
        'Collection: The Shelby Era',
        'Classic gangster-era aesthetic',
        'Cash on Delivery',
        'Delivery all over Nepal'
      ]
    },
    {
      id: 'shelby-02',
      name: 'The Shelby Era Tee 02',
      price: 1000,
      image: 'https://i.ibb.co/fV42TqY3/THE-SHELBY-ERA-Classic-gangster-era-aesthetic-reimagined-for-everyday-streetwear-Premium-heic.jpg',
      description: 'Classic gangster-era aesthetic reimagined for everyday streetwear.',
      sizes: ['S', 'M', 'L', 'XL'],
      collections: ['shelby', 'best'],
      badge: '',
      details: [
        'Collection: The Shelby Era',
        'Classic gangster-era aesthetic',
        'Cash on Delivery',
        'Delivery all over Nepal'
      ]
    }
  ];

  // Filter buttons shown above the products (keys match "collections" above)
  var FILTERS = [
    { key: 'all',    label: 'All' },
    { key: 'anime',  label: 'Anime Collection' },
    { key: 'shelby', label: 'The Shelby Era' },
    { key: 'new',    label: 'New Arrivals' },
    { key: 'best',   label: 'Best Sellers' }
  ];


  /* ==========================================================
     3. SMALL HELPERS
     ========================================================== */

  // Find one element (returns null if it does not exist)
  function $(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  // Find many elements (always returns a real array)
  function $all(selector, parent) {
    return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
  }

  // Add an event listener only if the element exists
  function on(element, eventName, handler) {
    if (element) {
      element.addEventListener(eventName, handler);
    }
  }

  // Make text safe to place inside HTML
  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Format a number as NPR, e.g. रु 1,200
  function formatPrice(amount) {
    var text;
    try {
      text = Number(amount).toLocaleString('en-IN');
    } catch (error) {
      text = String(amount);
    }
    return CURRENCY + ' ' + text;
  }

  // Find a product by its id
  function getProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) {
        return PRODUCTS[i];
      }
    }
    return null;
  }

  // Human-readable name of a filter / collection key
  function getFilterLabel(key) {
    for (var i = 0; i < FILTERS.length; i++) {
      if (FILTERS[i].key === key) {
        return FILTERS[i].label;
      }
    }
    return '';
  }


  /* ==========================================================
     4. ELEMENT REFERENCES (IDs come from index.html)
     ========================================================== */
  var header          = $('#site-header');
  var menuToggle      = $('#menu-toggle');
  var mainNav         = $('#main-nav');
  var cartToggle      = $('#cart-toggle');
  var cartCount       = $('#cart-count');
  var cartDrawer      = $('#cart-drawer');
  var cartClose       = $('#cart-close');
  var cartItemsBox    = $('#cart-items');
  var cartFooter      = $('#cart-footer');
  var cartSubtotal    = $('#cart-subtotal');
  var cartTotal       = $('#cart-total');
  var checkoutBtn     = $('#checkout-btn');
  var clearCartBtn    = $('#clear-cart-btn');
  var overlay         = $('#overlay');
  var filterBar       = $('#filter-bar');
  var productGrid     = $('#product-grid');
  var quickviewModal  = $('#quickview-modal');
  var quickviewBody   = $('#quickview-content');
  var quickviewClose  = $('#quickview-close');
  var checkoutModal   = $('#checkout-modal');
  var checkoutClose   = $('#checkout-close');
  var checkoutForm    = $('#checkout-form');
  var checkoutSummary = $('#checkout-summary');
  var checkoutTotal   = $('#checkout-total');
  var toastBox        = $('#toast');
  var yearSpan        = $('#year');


  /* ==========================================================
     5. STATE
     ========================================================== */
  var cart = [];                 // [{ id, size, qty }]
  var selectedSizes = {};        // { productId: 'M' }
  var currentFilter = 'all';     // active filter key
  var toastTimer = null;         // timer for toast notifications
  var lastFocus = {};            // remembers focus for each popup


  /* ==========================================================
     6. TOAST NOTIFICATIONS
     ========================================================== */
  function showToast(message) {
    if (!toastBox) { return; }
    toastBox.textContent = message;
    toastBox.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastBox.classList.remove('show');
    }, 2600);
  }


  /* ==========================================================
     7. PAGE SCROLL LOCK (while cart, menu or a modal is open)
     ========================================================== */
  function updateBodyScroll() {
    var anyOpen =
      (cartDrawer && cartDrawer.classList.contains('open')) ||
      (quickviewModal && quickviewModal.classList.contains('open')) ||
      (checkoutModal && checkoutModal.classList.contains('open')) ||
      (mainNav && mainNav.classList.contains('open') && window.innerWidth < 992);

    document.body.classList.toggle('no-scroll', !!anyOpen);
  }


  /* ==========================================================
     8. MOBILE HAMBURGER MENU
     ========================================================== */
  function openMenu() {
    if (!mainNav || !menuToggle) { return; }
    mainNav.classList.add('open');
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    updateBodyScroll();
  }

  function closeMenu() {
    if (!mainNav || !menuToggle) { return; }
    mainNav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    updateBodyScroll();
  }

  function toggleMenu() {
    if (mainNav && mainNav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  on(menuToggle, 'click', toggleMenu);

  // Close the menu after tapping any link inside it
  $all('.nav-link', mainNav).forEach(function (link) {
    on(link, 'click', closeMenu);
  });


  /* ==========================================================
     9. OPEN / CLOSE HELPERS FOR CART, OVERLAY AND MODALS
     ========================================================== */

  // Returns the elements inside a container that can receive keyboard focus
  function getFocusable(container) {
    if (!container) { return []; }
    var selector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return $all(selector, container).filter(function (el) {
      return el.getClientRects().length > 0;
    });
  }

  function showOverlay() {
    if (!overlay) { return; }
    overlay.removeAttribute('hidden');
    overlay.classList.add('active');
  }

  function hideOverlay() {
    if (!overlay) { return; }
    overlay.classList.remove('active');
  }

  /* ---------- Cart drawer ---------- */
  function openCart() {
    if (!cartDrawer) { return; }
    closeMenu();
    renderCart();
    lastFocus.cart = document.activeElement;
    cartDrawer.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    if (cartToggle) { cartToggle.setAttribute('aria-expanded', 'true'); }
    showOverlay();
    updateBodyScroll();
    setTimeout(function () { cartDrawer.focus(); }, 60);
  }

  function closeCart() {
    if (!cartDrawer || !cartDrawer.classList.contains('open')) { return; }
    cartDrawer.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    if (cartToggle) { cartToggle.setAttribute('aria-expanded', 'false'); }
    hideOverlay();
    updateBodyScroll();
    if (lastFocus.cart && lastFocus.cart.focus) { lastFocus.cart.focus(); }
  }

  /* ---------- Modals (quick view + checkout) ---------- */
  function openModal(modal, key) {
    if (!modal) { return; }
    lastFocus[key] = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    updateBodyScroll();
    setTimeout(function () {
      var items = getFocusable(modal);
      if (items.length) { items[0].focus(); }
    }, 60);
  }

  function closeModal(modal, key) {
    if (!modal || !modal.classList.contains('open')) { return; }
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    updateBodyScroll();
    if (lastFocus[key] && lastFocus[key].focus) { lastFocus[key].focus(); }
  }

  function closeQuickview() { closeModal(quickviewModal, 'quickview'); }
  function closeCheckout()  { closeModal(checkoutModal, 'checkout'); }

  // Cart buttons
  on(cartToggle, 'click', function () {
    if (cartDrawer && cartDrawer.classList.contains('open')) {
      closeCart();
    } else {
      openCart();
    }
  });
  on(cartClose, 'click', closeCart);

  // Clicking the dark overlay closes the cart
  on(overlay, 'click', closeCart);

  // Close buttons on modals
  on(quickviewClose, 'click', closeQuickview);
  on(checkoutClose, 'click', closeCheckout);

  // Clicking the dark area outside a modal box closes it
  on(quickviewModal, 'click', function (event) {
    if (event.target === quickviewModal) { closeQuickview(); }
  });
  on(checkoutModal, 'click', function (event) {
    if (event.target === checkoutModal) { closeCheckout(); }
  });

  // Keyboard: Escape closes the top-most popup, Tab stays inside popups
  document.addEventListener('keydown', function (event) {
    var key = event.key;

    if (key === 'Escape' || key === 'Esc') {
      if (quickviewModal && quickviewModal.classList.contains('open')) {
        closeQuickview();
      } else if (checkoutModal && checkoutModal.classList.contains('open')) {
        closeCheckout();
      } else if (cartDrawer && cartDrawer.classList.contains('open')) {
        closeCart();
      } else if (mainNav && mainNav.classList.contains('open')) {
        closeMenu();
      }
      return;
    }

    if (key === 'Tab') {
      var container = null;
      if (quickviewModal && quickviewModal.classList.contains('open')) {
        container = quickviewModal;
      } else if (checkoutModal && checkoutModal.classList.contains('open')) {
        container = checkoutModal;
      } else if (cartDrawer && cartDrawer.classList.contains('open')) {
        container = cartDrawer;
      }
      if (!container) { return; }

      var items = getFocusable(container);
      if (!items.length) { return; }
      var first = items[0];
      var last = items[items.length - 1];

      if (event.shiftKey && (document.activeElement === first || document.activeElement === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });


  /* ==========================================================
     10. PRODUCT FILTERS
     ========================================================== */
  function renderFilters() {
    if (!filterBar) { return; }
    var html = '';
    FILTERS.forEach(function (filter) {
      var active = filter.key === currentFilter;
      html += '<button type="button" class="filter-btn' + (active ? ' active' : '') +
              '" data-filter="' + escapeHTML(filter.key) +
              '" aria-pressed="' + (active ? 'true' : 'false') + '">' +
              escapeHTML(filter.label) + '</button>';
    });
    filterBar.innerHTML = html;
  }

  function setFilter(key) {
    currentFilter = key;
    renderFilters();
    renderProducts();
  }

  on(filterBar, 'click', function (event) {
    var button = event.target.closest('.filter-btn');
    if (!button) { return; }
    setFilter(button.getAttribute('data-filter'));
  });

  // Collection cards: set the matching filter, then the link scrolls to #shop
  $all('.collection-card').forEach(function (card) {
    on(card, 'click', function () {
      var key = card.getAttribute('data-collection');
      if (key) { setFilter(key); }
    });
  });


  /* ==========================================================
     11. PRODUCT CARDS
     ========================================================== */

  // Builds the size buttons for a product
  function buildSizeButtons(product) {
    var chosen = selectedSizes[product.id];
    var html = '';
    product.sizes.forEach(function (size) {
      var isSelected = chosen === size;
      html += '<button type="button" class="size-btn' + (isSelected ? ' selected' : '') +
              '" data-size="' + escapeHTML(size) +
              '" aria-pressed="' + (isSelected ? 'true' : 'false') +
              '" aria-label="Size ' + escapeHTML(size) + '">' + escapeHTML(size) + '</button>';
    });
    return html;
  }

  function buildProductCard(product) {
    var mainCollection = getFilterLabel(product.collections[0]);
    var badge = product.badge
      ? '<span class="product-badge">' + escapeHTML(product.badge) + '</span>'
      : '';

    return '' +
      '<article class="product-card reveal" data-product-id="' + escapeHTML(product.id) + '">' +
        '<div class="product-img-wrap" data-action="quickview" role="button" tabindex="0" ' +
             'aria-label="View details for ' + escapeHTML(product.name) + '">' +
          badge +
          '<img src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(product.name) + '" loading="lazy">' +
        '</div>' +
        '<div class="product-info">' +
          '<p class="product-collection">' + escapeHTML(mainCollection) + '</p>' +
          '<h3 class="product-name">' + escapeHTML(product.name) + '</h3>' +
          '<p class="product-price">' + formatPrice(product.price) + '</p>' +
          '<p class="product-desc">' + escapeHTML(product.description) + '</p>' +
          '<p class="size-label">Select size</p>' +
          '<div class="size-options" role="group" aria-label="Select size for ' + escapeHTML(product.name) + '" ' +
               'data-product-id="' + escapeHTML(product.id) + '">' +
            buildSizeButtons(product) +
          '</div>' +
          '<div class="product-actions">' +
            '<button type="button" class="btn btn-outline" data-action="quickview">Details</button>' +
            '<button type="button" class="btn btn-primary" data-action="add">Add to Cart</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderProducts() {
    if (!productGrid) { return; }

    var list = PRODUCTS.filter(function (product) {
      return currentFilter === 'all' || product.collections.indexOf(currentFilter) !== -1;
    });

    if (!list.length) {
      productGrid.innerHTML = '<p class="empty-state">No products in this collection yet. Please check back soon.</p>';
      return;
    }

    productGrid.innerHTML = list.map(buildProductCard).join('');
    observeReveals();
  }

  // Select a size (updates every size button for that product on screen)
  function setSize(productId, size) {
    selectedSizes[productId] = size;
    $all('.size-options[data-product-id="' + productId + '"]').forEach(function (group) {
      $all('.size-btn', group).forEach(function (btn) {
        var isSelected = btn.getAttribute('data-size') === size;
        btn.classList.toggle('selected', isSelected);
        btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      });
    });
  }

  // Clicks inside the product grid (size, details, add to cart)
  on(productGrid, 'click', function (event) {
    var card = event.target.closest('.product-card');
    if (!card) { return; }
    var productId = card.getAttribute('data-product-id');

    var sizeBtn = event.target.closest('.size-btn');
    if (sizeBtn) {
      setSize(productId, sizeBtn.getAttribute('data-size'));
      return;
    }

    var actionEl = event.target.closest('[data-action]');
    if (!actionEl) { return; }
    var action = actionEl.getAttribute('data-action');

    if (action === 'quickview') {
      openQuickview(productId);
    } else if (action === 'add') {
      addToCart(productId, selectedSizes[productId], card);
    }
  });

  // Keyboard support for the clickable image (Enter / Space)
  on(productGrid, 'keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') { return; }
    var wrap = event.target.closest('.product-img-wrap');
    if (!wrap) { return; }
    event.preventDefault();
    var card = wrap.closest('.product-card');
    if (card) { openQuickview(card.getAttribute('data-product-id')); }
  });


  /* ==========================================================
     12. QUICK VIEW MODAL
     ========================================================== */
  function openQuickview(productId) {
    var product = getProduct(productId);
    if (!product || !quickviewBody) { return; }

    var detailsHTML = product.details.map(function (line) {
      return '<li>' + escapeHTML(line) + '</li>';
    }).join('');

    quickviewBody.innerHTML = '' +
      '<img class="quickview-img" src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(product.name) + '">' +
      '<div class="quickview-info" data-product-id="' + escapeHTML(product.id) + '">' +
        '<p class="product-collection">' + escapeHTML(getFilterLabel(product.collections[0])) + '</p>' +
        '<h2 id="quickview-title">' + escapeHTML(product.name) + '</h2>' +
        '<p class="product-price">' + formatPrice(product.price) + '</p>' +
        '<p class="product-desc">' + escapeHTML(product.description) + '</p>' +
        '<ul class="quickview-details">' + detailsHTML + '</ul>' +
        '<p class="size-label">Select size</p>' +
        '<div class="size-options" role="group" aria-label="Select size for ' + escapeHTML(product.name) + '" ' +
             'data-product-id="' + escapeHTML(product.id) + '">' +
          buildSizeButtons(product) +
        '</div>' +
        '<button type="button" class="btn btn-primary btn-block" data-action="add">Add to Cart</button>' +
      '</div>';

    openModal(quickviewModal, 'quickview');
  }

  // Clicks inside the quick view (size + add to cart)
  on(quickviewBody, 'click', function (event) {
    var info = event.target.closest('.quickview-info');
    if (!info) { return; }
    var productId = info.getAttribute('data-product-id');

    var sizeBtn = event.target.closest('.size-btn');
    if (sizeBtn) {
      setSize(productId, sizeBtn.getAttribute('data-size'));
      return;
    }

    var addBtn = event.target.closest('[data-action="add"]');
    if (addBtn) {
      var added = addToCart(productId, selectedSizes[productId], info);
      if (added) { closeQuickview(); }
    }
  });


  /* ==========================================================
     13. SHOPPING CART LOGIC
     ========================================================== */

  // Save cart in the browser (safe if storage is blocked)
  function saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      /* storage not available - the cart still works for this visit */
    }
  }

  // Load cart from the browser and clean up any invalid items
  function loadCart() {
    var saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    } catch (error) {
      saved = null;
    }

    cart = [];
    if (!Array.isArray(saved)) { return; }

    saved.forEach(function (item) {
      if (!item || typeof item.id !== 'string' || typeof item.size !== 'string') { return; }
      if (!getProduct(item.id)) { return; }          // product no longer exists
      var qty = parseInt(item.qty, 10);
      if (!qty || qty < 1) { return; }
      cart.push({ id: item.id, size: item.size, qty: Math.min(qty, MAX_QTY) });
    });
  }

  // Unique key for a product + size combination
  function lineKey(id, size) {
    return id + '|' + size;
  }

  function findCartLine(id, size) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id && cart[i].size === size) {
        return cart[i];
      }
    }
    return null;
  }

  // Add one item. Returns true if it was added.
  function addToCart(productId, size, sourceElement) {
    var product = getProduct(productId);
    if (!product) { return false; }

    // A size must be chosen first
    if (!size) {
      showToast('Please select a size first');
      if (sourceElement) {
        var group = $('.size-options', sourceElement);
        if (group) {
          var firstBtn = $('.size-btn', group);
          if (firstBtn) { firstBtn.focus(); }
        }
      }
      return false;
    }

    var line = findCartLine(productId, size);
    if (line) {
      if (line.qty >= MAX_QTY) {
        showToast('Maximum ' + MAX_QTY + ' per size');
        return false;
      }
      line.qty += 1;
    } else {
      cart.push({ id: productId, size: size, qty: 1 });
    }

    saveCart();
    renderCart();
    bumpCartCount();
    showToast(product.name + ' (' + size + ') added to cart');
    return true;
  }

  function changeQty(key, change) {
    for (var i = 0; i < cart.length; i++) {
      if (lineKey(cart[i].id, cart[i].size) === key) {
        var newQty = cart[i].qty + change;
        if (newQty < 1) {
          cart.splice(i, 1);                    // quantity 0 removes the item
        } else if (newQty > MAX_QTY) {
          showToast('Maximum ' + MAX_QTY + ' per size');
          return;
        } else {
          cart[i].qty = newQty;
        }
        break;
      }
    }
    saveCart();
    renderCart();
  }

  function removeFromCart(key) {
    cart = cart.filter(function (item) {
      return lineKey(item.id, item.size) !== key;
    });
    saveCart();
    renderCart();
    showToast('Item removed');
  }

  function clearCart() {
    cart = [];
    saveCart();
    renderCart();
  }

  // Totals
  function getItemCount() {
    return cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  function getSubtotal() {
    return cart.reduce(function (sum, item) {
      var product = getProduct(item.id);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
  }

  // Small animation on the cart count bubble
  function bumpCartCount() {
    if (!cartCount) { return; }
    cartCount.classList.add('bump');
    setTimeout(function () { cartCount.classList.remove('bump'); }, 300);
  }

  // Draw the cart drawer, count and totals
  function renderCart() {
    var total = getSubtotal();

    // Header count
    if (cartCount) { cartCount.textContent = String(getItemCount()); }

    // Totals
    if (cartSubtotal) { cartSubtotal.textContent = formatPrice(total); }
    if (cartTotal) { cartTotal.textContent = formatPrice(total); }

    if (!cartItemsBox) { return; }

    // Empty cart
    if (!cart.length) {
      cartItemsBox.innerHTML = '<p class="cart-empty">Your cart is empty.<br>Choose your favourites from the shop.</p>';
      if (cartFooter) { cartFooter.hidden = true; }
      return;
    }

    if (cartFooter) { cartFooter.hidden = false; }

    cartItemsBox.innerHTML = cart.map(function (item) {
      var product = getProduct(item.id);
      var key = lineKey(item.id, item.size);
      var lineTotal = product.price * item.qty;

      return '' +
        '<div class="cart-item">' +
          '<img class="cart-item-img" src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(product.name) + '">' +
          '<div class="cart-item-info">' +
            '<p class="cart-item-name">' + escapeHTML(product.name) + '</p>' +
            '<p class="cart-item-meta">Size: ' + escapeHTML(item.size) + ' &bull; ' + formatPrice(product.price) + ' each</p>' +
            '<p class="cart-item-price">' + formatPrice(lineTotal) + '</p>' +
            '<div class="cart-item-bottom">' +
              '<div class="qty-controls">' +
                '<button type="button" class="qty-btn" data-action="dec" data-key="' + escapeHTML(key) + '" aria-label="Decrease quantity of ' + escapeHTML(product.name) + '">&minus;</button>' +
                '<span class="qty-value" aria-live="polite">' + item.qty + '</span>' +
                '<button type="button" class="qty-btn" data-action="inc" data-key="' + escapeHTML(key) + '" aria-label="Increase quantity of ' + escapeHTML(product.name) + '">+</button>' +
              '</div>' +
              '<button type="button" class="cart-item-remove" data-action="remove" data-key="' + escapeHTML(key) + '" aria-label="Remove ' + escapeHTML(product.name) + ' from cart">Remove</button>' +
            '</div>' +
          '</div>' +
        '</div>';
    }).join('');
  }

  // Quantity / remove buttons inside the cart
  on(cartItemsBox, 'click', function (event) {
    var button = event.target.closest('[data-action]');
    if (!button) { return; }
    var key = button.getAttribute('data-key');
    var action = button.getAttribute('data-action');

    if (action === 'inc') {
      changeQty(key, 1);
    } else if (action === 'dec') {
      changeQty(key, -1);
    } else if (action === 'remove') {
      removeFromCart(key);
    }
  });

  on(clearCartBtn, 'click', function () {
    if (!cart.length) { return; }
    clearCart();
    showToast('Cart cleared');
  });


  /* ==========================================================
     14. CHECKOUT
     ========================================================== */

  // Fill the order summary inside the checkout modal
  function renderCheckoutSummary() {
    if (checkoutSummary) {
      checkoutSummary.innerHTML = cart.map(function (item) {
        var product = getProduct(item.id);
        return '' +
          '<div class="summary-item">' +
            '<span>' + escapeHTML(product.name) + ' (' + escapeHTML(item.size) + ') &times; ' + item.qty + '</span>' +
            '<span>' + formatPrice(product.price * item.qty) + '</span>' +
          '</div>';
      }).join('');
    }
    if (checkoutTotal) { checkoutTotal.textContent = formatPrice(getSubtotal()); }
  }

  // "Proceed to Checkout" button in the cart
  on(checkoutBtn, 'click', function () {
    if (!cart.length) {
      showToast('Your cart is empty');
      return;
    }
    closeCart();
    renderCheckoutSummary();
    clearAllErrors();
    // Small delay so the cart finishes closing before the modal opens
    setTimeout(function () { openModal(checkoutModal, 'checkout'); }, 150);
  });

  /* ---------- Form validation ---------- */
  var fields = {
    name:    { input: $('#customer-name'),    error: $('#name-error') },
    phone:   { input: $('#customer-phone'),   error: $('#phone-error') },
    address: { input: $('#customer-address'), error: $('#address-error') }
  };

  function setError(fieldKey, message) {
    var field = fields[fieldKey];
    if (!field) { return; }
    if (field.error) { field.error.textContent = message; }
    if (field.input) {
      field.input.classList.add('invalid');
      field.input.setAttribute('aria-invalid', 'true');
    }
  }

  function clearError(fieldKey) {
    var field = fields[fieldKey];
    if (!field) { return; }
    if (field.error) { field.error.textContent = ''; }
    if (field.input) {
      field.input.classList.remove('invalid');
      field.input.removeAttribute('aria-invalid');
    }
  }

  function clearAllErrors() {
    Object.keys(fields).forEach(clearError);
  }

  // Remove an error as soon as the customer starts fixing it
  Object.keys(fields).forEach(function (fieldKey) {
    if (fields[fieldKey].input) {
      on(fields[fieldKey].input, 'input', function () { clearError(fieldKey); });
    }
  });

  // Cleans a phone number: removes spaces, dashes, brackets and +977 / 977
  function cleanPhone(value) {
    var digits = value.replace(/[\s\-().]/g, '');
    digits = digits.replace(/^\+/, '');
    if (digits.indexOf('977') === 0 && digits.length > 10) {
      digits = digits.slice(3);
    }
    return digits;
  }

  function isValidPhone(value) {
    var digits = cleanPhone(value);
    if (!/^\d+$/.test(digits)) { return false; }
    if (digits.length === 10) { return digits.charAt(0) === '9'; }  // Nepal mobile
    return digits.length >= 7 && digits.length <= 9;                // landline
  }

  // Returns true if the form is valid; shows messages and focuses the first problem
  function validateForm() {
    var valid = true;
    var firstInvalid = null;
    clearAllErrors();

    var name = fields.name.input ? fields.name.input.value.trim() : '';
    var phone = fields.phone.input ? fields.phone.input.value.trim() : '';
    var address = fields.address.input ? fields.address.input.value.trim() : '';

    if (name.length < 2) {
      setError('name', 'Please enter your full name.');
      valid = false;
      firstInvalid = firstInvalid || fields.name.input;
    }

    if (!phone) {
      setError('phone', 'Please enter your phone number.');
      valid = false;
      firstInvalid = firstInvalid || fields.phone.input;
    } else if (!isValidPhone(phone)) {
      setError('phone', 'Please enter a valid phone number, e.g. 98XXXXXXXX.');
      valid = false;
      firstInvalid = firstInvalid || fields.phone.input;
    }

    if (address.length < 10) {
      setError('address', 'Please enter your full delivery address (area, street, landmark, city).');
      valid = false;
      firstInvalid = firstInvalid || fields.address.input;
    }

    if (firstInvalid) { firstInvalid.focus(); }
    return valid;
  }


  /* ==========================================================
     15. WHATSAPP ORDER MESSAGE
     ========================================================== */
  function buildOrderMessage(name, phone, address) {
    var lines = [];

    lines.push('*New Order - IMak*');
    lines.push('A Story You Can Wear');
    lines.push('');
    lines.push('*Customer Details*');
    lines.push('Name: ' + name);
    lines.push('Phone: ' + phone);
    lines.push('Address: ' + address);
    lines.push('');
    lines.push('*Order Items*');

    cart.forEach(function (item, index) {
      var product = getProduct(item.id);
      lines.push(
        (index + 1) + '. ' + product.name +
        ' | Size: ' + item.size +
        ' | Qty: ' + item.qty +
        ' | ' + formatPrice(product.price * item.qty)
      );
    });

    lines.push('');
    lines.push('*Total: ' + formatPrice(getSubtotal()) + '*');
    lines.push('Payment: Cash on Delivery');
    lines.push('');
    lines.push('Please confirm my order. Thank you!');

    return lines.join('\n');
  }

  // Form submit = "Place Order on WhatsApp"
  on(checkoutForm, 'submit', function (event) {
    event.preventDefault();

    if (!cart.length) {
      showToast('Your cart is empty');
      closeCheckout();
      return;
    }

    if (!validateForm()) {
      showToast('Please check the highlighted fields');
      return;
    }

    var name = fields.name.input.value.trim();
    var phone = fields.phone.input.value.trim();
    var address = fields.address.input.value.trim();

    var message = buildOrderMessage(name, phone, address);
    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

    // Open WhatsApp. The customer must press Send there.
    var opened = window.open(url, '_blank');
    if (opened) {
      opened.opener = null;
    } else {
      // Popup was blocked (some mobile browsers) - open in the same tab instead
      window.location.href = url;
    }

    closeCheckout();
    showToast('WhatsApp opened. Press Send to place your order.');
    // The cart is kept until you clear it, in case the message was not sent.
  });


  /* ==========================================================
     16. HEADER SCROLL EFFECT + ACTIVE NAV LINK
     ========================================================== */
  var sectionIds = ['home', 'collections', 'shop', 'about', 'contact'];
  var ticking = false;

  function handleScroll() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Darker header after scrolling a little
    if (header) { header.classList.toggle('scrolled', scrollY > 30); }

    // Highlight the nav link of the section currently on screen
    var current = sectionIds[0];
    var offset = (header ? header.offsetHeight : 70) + 120;
    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top <= offset) {
        current = id;
      }
    });

    $all('.nav-link').forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + current;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(handleScroll);
    }
  }, { passive: true });

  // Close the mobile menu if the screen becomes wide (rotate / resize)
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 992) { closeMenu(); }
    updateBodyScroll();
  });


  /* ==========================================================
     17. SCROLL REVEAL ANIMATIONS
     ========================================================== */
  var revealObserver = null;

  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }

  // Watch every .reveal element that is not visible yet
  function observeReveals() {
    $all('.reveal').forEach(function (el) {
      if (el.classList.contains('visible')) { return; }
      if (revealObserver) {
        revealObserver.observe(el);
      } else {
        el.classList.add('visible');          // old browsers: just show it
      }
    });
  }


  /* ==========================================================
     18. START EVERYTHING
     ========================================================== */
  function init() {
    // Footer year
    if (yearSpan) { yearSpan.textContent = String(new Date().getFullYear()); }

    // Overlay is controlled with a class, so remove the "hidden" attribute
    if (overlay) { overlay.removeAttribute('hidden'); }

    loadCart();
    renderFilters();
    renderProducts();
    renderCart();
    observeReveals();
    handleScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
