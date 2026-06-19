(function () {
  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("q") || "").trim();
  }

  function normalize(text) {
    return (text || "").toString().toLowerCase();
  }

  function escapeHtml(text) {
    return (text || "").toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function cardTemplate(movie) {
    var tags = movie.tags.slice(0, 4).map(function (tag) {
      return '<span class="card-tag">' + escapeHtml(tag) + '</span>';
    }).join("");

    return [
      '<article class="movie-card">',
      '  <a class="poster-wrap" href="' + movie.url + '">',
      '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="poster-badge">' + escapeHtml(movie.year) + '</span>',
      '    <span class="poster-play">▶</span>',
      '  </a>',
      '  <div class="card-body">',
      '    <h2 class="card-title"><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>',
      '    <div class="card-meta">',
      '      <span class="meta-pill">' + escapeHtml(movie.region) + '</span>',
      '      <span>' + escapeHtml(movie.genre) + '</span>',
      '    </div>',
      '    <p class="card-desc">' + escapeHtml(movie.desc) + '</p>',
      '    <div class="card-tags">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join("\n");
  }

  function render() {
    var formInput = document.querySelector("[data-search-page-input]");
    var resultGrid = document.querySelector("[data-search-results]");
    var resultNote = document.querySelector("[data-search-note]");
    var query = getQuery();

    if (formInput) {
      formInput.value = query;
    }

    if (!resultGrid || !window.MOVIE_SEARCH_INDEX) {
      return;
    }

    var results = window.MOVIE_SEARCH_INDEX;

    if (query) {
      var keyword = normalize(query);
      results = results.filter(function (movie) {
        return normalize([
          movie.title,
          movie.region,
          movie.year,
          movie.genre,
          movie.tags.join(" "),
          movie.desc
        ].join(" ")).indexOf(keyword) >= 0;
      });
    }

    results = results.slice(0, 240);

    if (resultNote) {
      resultNote.textContent = query
        ? '“' + query + '” 找到 ' + results.length + ' 条可展示结果。'
        : '输入片名、年份、地区、类型或标签，可从全站片库中检索。当前展示推荐结果 ' + results.length + ' 条。';
    }

    resultGrid.innerHTML = results.map(cardTemplate).join("\n");
  }

  document.addEventListener("DOMContentLoaded", render);
})();
