(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function normalize(text) {
    return (text || "").toString().trim().toLowerCase();
  }

  function setupMobileMenu() {
    var button = qs("[data-mobile-menu-button]");
    var panel = qs("[data-mobile-panel]");

    if (!button || !panel) {
      return;
    }

    button.addEventListener("click", function () {
      var isOpen = panel.classList.toggle("is-open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  function setupSiteSearchForms() {
    qsa("form[data-site-search]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q']");
        var value = input ? input.value.trim() : "";

        if (value) {
          window.location.href = "search.html?q=" + encodeURIComponent(value);
        } else {
          window.location.href = "search.html";
        }
      });
    });
  }

  function setupHeroSlider() {
    var slider = qs("[data-hero-slider]");

    if (!slider) {
      return;
    }

    var slides = qsa(".hero-slide", slider);
    var dots = qsa(".hero-dot", slider);
    var prev = qs("[data-hero-prev]", slider);
    var next = qs("[data-hero-next]", slider);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
        dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);

    show(0);
    start();
  }

  function setupCatalogFilters() {
    var containers = qsa("[data-catalog]");

    containers.forEach(function (container) {
      var searchInput = qs("[data-card-search]", container);
      var regionSelect = qs("[data-region-filter]", container);
      var sortSelect = qs("[data-sort-select]", container);
      var resultNote = qs("[data-result-note]", container);
      var emptyState = qs("[data-empty-state]", container);
      var grid = qs("[data-card-grid]", container);
      var cards = qsa(".movie-card", container);

      function apply() {
        var keyword = normalize(searchInput && searchInput.value);
        var region = regionSelect ? regionSelect.value : "all";
        var visible = [];

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags"),
            card.getAttribute("data-desc")
          ].join(" "));
          var matchesKeyword = !keyword || haystack.indexOf(keyword) >= 0;
          var matchesRegion = region === "all" || card.getAttribute("data-region") === region;
          var isVisible = matchesKeyword && matchesRegion;

          card.style.display = isVisible ? "" : "none";

          if (isVisible) {
            visible.push(card);
          }
        });

        if (sortSelect && grid) {
          var sortValue = sortSelect.value;
          visible.sort(function (a, b) {
            if (sortValue === "year-desc") {
              return Number(b.getAttribute("data-year-number")) - Number(a.getAttribute("data-year-number"));
            }

            if (sortValue === "year-asc") {
              return Number(a.getAttribute("data-year-number")) - Number(b.getAttribute("data-year-number"));
            }

            if (sortValue === "title") {
              return (a.getAttribute("data-title") || "").localeCompare(b.getAttribute("data-title") || "", "zh-Hans-CN");
            }

            return Number(a.getAttribute("data-id")) - Number(b.getAttribute("data-id"));
          });

          visible.forEach(function (card) {
            grid.appendChild(card);
          });
        }

        if (resultNote) {
          resultNote.textContent = "当前显示 " + visible.length + " 部，共 " + cards.length + " 部。";
        }

        if (emptyState) {
          emptyState.classList.toggle("is-visible", visible.length === 0);
        }
      }

      if (searchInput) {
        searchInput.addEventListener("input", apply);
      }

      if (regionSelect) {
        regionSelect.addEventListener("change", apply);
      }

      if (sortSelect) {
        sortSelect.addEventListener("change", apply);
      }

      apply();
    });
  }

  function setupBackTop() {
    var button = qs("[data-back-top]");

    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenu();
    setupSiteSearchForms();
    setupHeroSlider();
    setupCatalogFilters();
    setupBackTop();
  });
})();
