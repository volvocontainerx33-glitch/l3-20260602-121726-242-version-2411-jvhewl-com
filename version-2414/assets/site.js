
(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-main-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  if (slides.length) {
    var current = 0;
    var showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });
    showSlide(0);
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
  panels.forEach(function (panel) {
    var container = panel.parentElement;
    var input = panel.querySelector('[data-search-input]');
    var year = panel.querySelector('[data-year-filter]');
    var genre = panel.querySelector('[data-genre-filter]');
    var cards = Array.prototype.slice.call(container.querySelectorAll('.movie-card'));
    var empty = container.querySelector('[data-empty-state]');
    var apply = function () {
      var kw = input ? input.value.trim().toLowerCase() : '';
      var yr = year ? year.value : '';
      var ge = genre ? genre.value.toLowerCase() : '';
      var visible = 0;
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var cy = card.getAttribute('data-year') || '';
        var cg = (card.getAttribute('data-genre') || '').toLowerCase();
        var ok = (!kw || text.indexOf(kw) !== -1) && (!yr || cy === yr) && (!ge || cg.indexOf(ge) !== -1);
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    };
    [input, year, genre].forEach(function (el) {
      if (el) {
        el.addEventListener('input', apply);
        el.addEventListener('change', apply);
      }
    });
  });
})();

function initMoviePlayer(videoId, coverId, buttonId, streamUrl) {
  var video = document.getElementById(videoId);
  var cover = document.getElementById(coverId);
  var button = document.getElementById(buttonId);
  if (!video || !cover || !button || !streamUrl) {
    return;
  }
  var prepared = false;
  var prepare = function () {
    if (prepared) {
      return;
    }
    prepared = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else {
      video.src = streamUrl;
    }
  };
  var play = function () {
    prepare();
    cover.classList.add('is-hidden');
    var started = video.play();
    if (started && typeof started.catch === 'function') {
      started.catch(function () {});
    }
  };
  cover.addEventListener('click', play);
  button.addEventListener('click', function (event) {
    event.stopPropagation();
    play();
  });
  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });
}
