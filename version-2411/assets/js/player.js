async function attachHls(video) {
    var hlsUrl = video.getAttribute('data-hls');
    var mp4Url = video.getAttribute('data-mp4');
    if (!hlsUrl) {
        if (mp4Url) {
            video.src = mp4Url;
        }
        return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl;
        return;
    }

    try {
        var module = await import('./hls.esm.js');
        var Hls = module.H;
        if (Hls && Hls.isSupported()) {
            var hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(hlsUrl);
            hls.attachMedia(video);
            video._hlsInstance = hls;
            return;
        }
    } catch (error) {
        console.warn('HLS module could not be loaded, using mp4 fallback.', error);
    }

    if (mp4Url) {
        video.src = mp4Url;
    }
}

function initStaticPlayers() {
    document.querySelectorAll('video[data-hls], video[data-mp4]').forEach(function (video) {
        attachHls(video);
        var wrap = video.closest('.video-wrap');
        var button = wrap ? wrap.querySelector('[data-player-start]') : null;
        if (button) {
            button.addEventListener('click', function () {
                button.classList.add('is-hidden');
                video.play().catch(function () {
                    button.classList.remove('is-hidden');
                });
            });
            video.addEventListener('play', function () {
                button.classList.add('is-hidden');
            });
            video.addEventListener('pause', function () {
                if (video.currentTime === 0 || video.ended) {
                    button.classList.remove('is-hidden');
                }
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', initStaticPlayers);
