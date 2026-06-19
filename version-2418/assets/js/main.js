function normalizeValue(value) {
    return (value || "").toString().trim().toLowerCase();
}

function bindMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!button || !panel) {
        return;
    }
    button.addEventListener("click", function () {
        panel.classList.toggle("open");
    });
}

function bindHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
        return;
    }
    var index = 0;
    function show(next) {
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === index);
        });
    }
    dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
            show(i);
        });
    });
    setInterval(function () {
        show(index + 1);
    }, 6500);
}

function bindFilters() {
    var list = document.querySelector("[data-card-list]");
    if (!list) {
        return;
    }
    var cards = Array.prototype.slice.call(list.querySelectorAll("[data-card]"));
    var keyword = document.querySelector("[data-filter-keyword]");
    var region = document.querySelector("[data-filter-region]");
    var year = document.querySelector("[data-filter-year]");
    var empty = document.querySelector("[data-empty-state]");
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q");
    if (keyword && initialQuery) {
        keyword.value = initialQuery;
    }
    function apply() {
        var q = normalizeValue(keyword ? keyword.value : "");
        var r = normalizeValue(region ? region.value : "");
        var y = normalizeValue(year ? year.value : "");
        var visible = 0;
        cards.forEach(function (card) {
            var search = normalizeValue(card.getAttribute("data-search"));
            var cardRegion = normalizeValue(card.getAttribute("data-region"));
            var cardYear = normalizeValue(card.getAttribute("data-year"));
            var matched = true;
            if (q && search.indexOf(q) === -1) {
                matched = false;
            }
            if (r && cardRegion !== r) {
                matched = false;
            }
            if (y && cardYear !== y) {
                matched = false;
            }
            card.style.display = matched ? "" : "none";
            if (matched) {
                visible += 1;
            }
        });
        if (empty) {
            empty.classList.toggle("show", visible === 0);
        }
    }
    [keyword, region, year].forEach(function (element) {
        if (element) {
            element.addEventListener("input", apply);
            element.addEventListener("change", apply);
        }
    });
    apply();
}

function bindSiteSearch() {
    var forms = Array.prototype.slice.call(document.querySelectorAll("[data-site-search]"));
    forms.forEach(function (form) {
        form.addEventListener("submit", function (event) {
            var input = form.querySelector("input[name='q']");
            if (!input || input.value.trim()) {
                return;
            }
            event.preventDefault();
            window.location.href = form.getAttribute("action") || "./movies.html";
        });
    });
}

function initSitePlayer(source) {
    function run() {
        var shell = document.querySelector("[data-player-shell]");
        if (!shell) {
            return;
        }
        var video = shell.querySelector("video");
        var cover = shell.querySelector(".player-cover");
        var started = false;
        var hlsInstance = null;
        function prepare() {
            if (started || !video) {
                return;
            }
            started = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
            video.setAttribute("controls", "controls");
        }
        function play() {
            prepare();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            var request = video.play();
            if (request && typeof request.catch === "function") {
                request.catch(function () {});
            }
        }
        if (cover) {
            cover.addEventListener("click", play);
        }
        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    play();
                } else {
                    video.pause();
                }
            });
        }
        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    bindMenu();
    bindHero();
    bindFilters();
    bindSiteSearch();
});
