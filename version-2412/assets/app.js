(function () {
    function qs(selector, scope) {
        return (scope || document).querySelector(selector);
    }

    function qsa(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    function initNavigation() {
        var toggle = qs('.nav-toggle');
        var nav = qs('.mobile-nav');
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener('click', function () {
            var opened = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!opened));
            nav.hidden = opened;
        });
    }

    function initHero() {
        var root = qs('[data-hero]');
        if (!root) {
            return;
        }
        var slides = qsa('[data-hero-slide]', root);
        var dots = qsa('[data-hero-dot]', root);
        var prev = qs('[data-hero-prev]', root);
        var next = qs('[data-hero-next]', root);
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function play() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                play();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                play();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                play();
            });
        });
        show(0);
        play();
    }

    function fillSelect(select, values) {
        if (!select) {
            return;
        }
        values.sort(function (a, b) {
            return String(b).localeCompare(String(a), 'zh-CN');
        });
        values.forEach(function (value) {
            if (!value) {
                return;
            }
            var option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    }

    function initFilters() {
        var cards = qsa('.filter-grid .movie-card');
        if (!cards.length) {
            return;
        }
        var input = qs('[data-filter-input]');
        var region = qs('[data-filter-region]');
        var year = qs('[data-filter-year]');
        var category = qs('[data-filter-category]');
        var empty = qs('[data-empty-state]');
        var regions = [];
        var years = [];

        cards.forEach(function (card) {
            var cardRegion = card.getAttribute('data-region') || '';
            var cardYear = card.getAttribute('data-year') || '';
            if (cardRegion && regions.indexOf(cardRegion) === -1) {
                regions.push(cardRegion);
            }
            if (cardYear && years.indexOf(cardYear) === -1) {
                years.push(cardYear);
            }
        });

        fillSelect(region, regions);
        fillSelect(year, years);

        function apply() {
            var query = input ? input.value.trim().toLowerCase() : '';
            var selectedRegion = region ? region.value : '';
            var selectedYear = year ? year.value : '';
            var selectedCategory = category ? category.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var text = card.getAttribute('data-search') || '';
                var matchesQuery = !query || text.indexOf(query) !== -1;
                var matchesRegion = !selectedRegion || card.getAttribute('data-region') === selectedRegion;
                var matchesYear = !selectedYear || card.getAttribute('data-year') === selectedYear;
                var matchesCategory = !selectedCategory || text.indexOf(selectedCategory.toLowerCase()) !== -1;
                var shouldShow = matchesQuery && matchesRegion && matchesYear && matchesCategory;
                card.hidden = !shouldShow;
                if (shouldShow) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        [input, region, year, category].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });

        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q && input) {
            input.value = q;
        }
        apply();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initNavigation();
        initHero();
        initFilters();
    });
})();
