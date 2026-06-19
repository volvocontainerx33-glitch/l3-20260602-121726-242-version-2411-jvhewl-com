(function () {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            var opened = mobileNav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
            toggle.textContent = opened ? '×' : '☰';
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var active = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === active);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });

        window.setInterval(function () {
            showSlide(active + 1);
        }, 5200);
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    var searchInput = document.querySelector('[data-search-input]');

    if (query && searchInput) {
        searchInput.value = query;
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

    panels.forEach(function (panel) {
        var scope = panel.parentElement || document;
        var input = panel.querySelector('[data-search-input]');
        var selects = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-select]'));
        var list = scope.querySelector('[data-card-list]');
        var cards = list ? Array.prototype.slice.call(list.children) : [];

        function matches(card, term, filters) {
            var haystack = [
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-tags')
            ].join(' ').toLowerCase();

            if (term && haystack.indexOf(term) === -1) {
                return false;
            }

            return filters.every(function (filter) {
                if (!filter.value) {
                    return true;
                }

                var raw = card.getAttribute('data-' + filter.name) || '';
                return raw.indexOf(filter.value) !== -1;
            });
        }

        function applyFilters() {
            var term = input ? input.value.trim().toLowerCase() : '';
            var filters = selects.map(function (select) {
                return {
                    name: select.getAttribute('data-filter-select'),
                    value: select.value
                };
            });

            cards.forEach(function (card) {
                card.classList.toggle('is-hidden', !matches(card, term, filters));
            });
        }

        if (input) {
            input.addEventListener('input', applyFilters);
        }

        selects.forEach(function (select) {
            select.addEventListener('change', applyFilters);
        });

        applyFilters();
    });

    function startPlayer(box) {
        if (!box || box.classList.contains('is-started')) {
            return;
        }

        var video = box.querySelector('video');
        var source = box.getAttribute('data-play');

        if (!video || !source) {
            return;
        }

        function playVideo() {
            var result = video.play();

            if (result && typeof result.catch === 'function') {
                result.catch(function () {});
            }
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            box.classList.add('is-started');
            playVideo();
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 60
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                box.classList.add('is-started');
                playVideo();
            });
            hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        hls.destroy();
                    }
                }
            });
            return;
        }

        video.src = source;
        box.classList.add('is-started');
        playVideo();
    }

    Array.prototype.slice.call(document.querySelectorAll('.player-box')).forEach(function (box) {
        var button = box.querySelector('.player-button');

        if (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                startPlayer(box);
            });
        }

        box.addEventListener('click', function (event) {
            if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'video') {
                return;
            }

            startPlayer(box);
        });
    });
})();
