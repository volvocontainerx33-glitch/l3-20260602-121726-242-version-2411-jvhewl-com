(function () {
  function setupPlayer(player) {
    var video = player.querySelector("video");
    var cover = player.querySelector(".player-cover");
    var button = player.querySelector(".player-button");
    var status = player.querySelector(".player-status");
    var source = player.getAttribute("data-src");
    var hls = null;
    var prepared = false;

    function setStatus(text) {
      if (status) {
        status.textContent = text;
      }
    }

    function prepare() {
      if (prepared || !video || !source) {
        return;
      }

      prepared = true;
      setStatus("正在初始化播放源...");

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hls.loadSource(source);
        hls.attachMedia(video);

        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setStatus("播放源已就绪");
        });

        hls.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (data && data.fatal) {
            setStatus("视频加载失败，请稍后重试");
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.addEventListener("loadedmetadata", function () {
          setStatus("播放源已就绪");
        }, { once: true });
      } else {
        setStatus("当前浏览器不支持 HLS 播放");
      }
    }

    function play() {
      prepare();

      if (cover) {
        cover.classList.add("is-hidden");
      }

      if (video) {
        var promise = video.play();

        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            setStatus("请再次点击播放器开始播放");
          });
        }
      }
    }

    if (button) {
      button.addEventListener("click", play);
    }

    if (cover) {
      cover.addEventListener("click", function (event) {
        if (event.target !== button) {
          play();
        }
      });
    }

    if (video) {
      video.addEventListener("play", function () {
        if (cover) {
          cover.classList.add("is-hidden");
        }
        setStatus("正在播放");
      });

      video.addEventListener("pause", function () {
        setStatus("已暂停");
      });
    }

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".video-player[data-src]").forEach(setupPlayer);
  });
})();
