(function () {
    function setupPlayer(root) {
        var video = root.querySelector('video');
        var cover = root.querySelector('.player-cover');
        var button = root.querySelector('.player-start');
        if (!video) {
            return;
        }
        var streamUrl = video.getAttribute('data-stream');
        var loaded = false;
        var hlsInstance = null;

        function loadStream() {
            if (loaded || !streamUrl) {
                return;
            }
            loaded = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
                return;
            }
            video.src = streamUrl;
        }

        function playVideo() {
            loadStream();
            if (cover) {
                cover.classList.add('is-hidden');
            }
            video.controls = true;
            var attempt = video.play();
            if (attempt && typeof attempt.catch === 'function') {
                attempt.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener('click', playVideo);
        }
        if (button) {
            button.addEventListener('click', function (event) {
                event.stopPropagation();
                playVideo();
            });
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
    });
})();
