(function () {
    function qs(selector, parent) {
        return (parent || document).querySelector(selector);
    }

    function qsa(selector, parent) {
        return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
    }

    var navToggle = qs('[data-nav-toggle]');
    var nav = qs('.main-nav');
    if (navToggle && nav) {
        navToggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    var backTop = qs('[data-back-top]');
    if (backTop) {
        window.addEventListener('scroll', function () {
            backTop.classList.toggle('is-visible', window.scrollY > 420);
        });
        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    qsa('[data-hero-carousel]').forEach(function (hero) {
        var slides = qsa('.hero-slide', hero);
        var dots = qsa('.hero-dot', hero);
        var prev = qs('[data-hero-prev]', hero);
        var next = qs('[data-hero-next]', hero);
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    qsa('[data-grid-filter]').forEach(function (panel) {
        var input = qs('[data-grid-search]', panel);
        var targetSelector = panel.getAttribute('data-grid-filter');
        var grid = qs(targetSelector);
        var count = qs('[data-grid-count]', panel);
        if (!grid) {
            return;
        }

        function cards() {
            return qsa('.movie-card', grid);
        }

        function applyFilter() {
            var value = input ? input.value.trim().toLowerCase() : '';
            var visible = 0;
            cards().forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-category'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-genre')
                ].join(' ').toLowerCase();
                var matched = !value || haystack.indexOf(value) !== -1;
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });
            if (count) {
                count.textContent = String(visible);
            }
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        qsa('[data-sort]', panel).forEach(function (button) {
            button.addEventListener('click', function () {
                var mode = button.getAttribute('data-sort');
                qsa('[data-sort]', panel).forEach(function (item) {
                    item.classList.toggle('is-active', item === button);
                });
                var sorted = cards().sort(function (a, b) {
                    if (mode === 'title') {
                        return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
                    }
                    if (mode === 'hot') {
                        return Number(b.getAttribute('data-hot') || 0) - Number(a.getAttribute('data-hot') || 0);
                    }
                    return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
                });
                sorted.forEach(function (card) {
                    grid.appendChild(card);
                });
                applyFilter();
            });
        });

        applyFilter();
    });
})();
