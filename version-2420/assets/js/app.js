(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var activeIndex = 0;

    function showSlide(nextIndex) {
        if (!slides.length) {
            return;
        }
        activeIndex = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, index) {
            slide.classList.toggle('active', index === activeIndex);
        });
        dots.forEach(function (dot, index) {
            dot.classList.toggle('active', index === activeIndex);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5600);
    }

    var siteSearch = document.querySelector('[data-site-search]');
    var searchResults = document.querySelector('[data-search-results]');

    function resultTemplate(item) {
        return '<a class="search-result" href="./' + item.url + '">' +
            '<img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '">' +
            '<span>' +
                '<h3>' + item.title + '</h3>' +
                '<p>' + item.year + ' · ' + item.category + ' · ' + item.oneLine + '</p>' +
            '</span>' +
        '</a>';
    }

    if (siteSearch && searchResults && window.SITE_SEARCH_INDEX) {
        siteSearch.addEventListener('input', function () {
            var keyword = siteSearch.value.trim().toLowerCase();
            if (!keyword) {
                searchResults.classList.remove('is-open');
                searchResults.innerHTML = '';
                return;
            }
            var matches = window.SITE_SEARCH_INDEX.filter(function (item) {
                var text = [item.title, item.year, item.category, item.tags, item.oneLine].join(' ').toLowerCase();
                return text.indexOf(keyword) !== -1;
            }).slice(0, 12);
            searchResults.innerHTML = matches.map(resultTemplate).join('');
            searchResults.classList.toggle('is-open', matches.length > 0);
        });
    }

    var categorySearch = document.querySelector('[data-category-search]');
    var movieCards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

    if (categorySearch && movieCards.length) {
        categorySearch.addEventListener('input', function () {
            var value = categorySearch.value.trim().toLowerCase();
            movieCards.forEach(function (card) {
                var text = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-tags')
                ].join(' ').toLowerCase();
                card.style.display = text.indexOf(value) !== -1 ? '' : 'none';
            });
        });
    }
}());
