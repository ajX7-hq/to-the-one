
        // Set Countdown Target (June 3rd)
        const targetDate = new Date("June 3, 2027 00:00:00").getTime();
        const instagramUsername = "_.ajmaleeeyyy";
        document.getElementById("replyButton").href = `https://ig.me/m/${instagramUsername}`;

        setInterval(function() {
            const now = new Date().getTime();
            const distance = targetDate - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById("countdown").innerHTML = days + "d " + hours + "h " + minutes + "m left";
        }, 1000);

        function checkPassword() {
            const val = document.getElementById("passwordInput").value.trim().toLowerCase();
            if(val === 'dairymilk') {
                const lockScreen = document.getElementById("lockScreen");
                const smileScreen = document.getElementById("smileScreen");
                const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                lockScreen.classList.add('is-leaving');
                smileScreen.hidden = false;
                smileScreen.classList.add('is-arriving');
                window.setTimeout(() => {
                    lockScreen.style.display = "none";
                    lockScreen.classList.remove('is-leaving');
                    smileScreen.classList.remove('is-arriving');
                }, reduceMotion ? 0 : 660);
                window.scrollTo(0, 0);
            } else {
                document.getElementById("errorMsg").style.display = "block";
            }
        }

        let cameraStream = null;
        let capturedPhoto = "";

        function showCameraStep() {
            document.getElementById('welcomeActions').hidden = true;
            document.getElementById('cameraStep').hidden = false;
        }

        async function startCamera() {
            const message = document.getElementById('cameraMessage');
            const video = document.getElementById('cameraPreview');
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                message.innerText = 'Camera access needs a secure page (HTTPS or localhost). You can choose a photo instead.';
                return;
            }
            try {
                cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
                video.srcObject = cameraStream;
                video.hidden = false;
                await video.play();
                document.getElementById('cameraStart').hidden = true;
                document.getElementById('capturePhoto').hidden = false;
                message.innerText = 'Your camera is ready. Capture a smile when you\'re ready.';
            } catch (error) {
                stopCamera();
                message.innerText = 'Camera permission was unavailable. You can allow camera access or choose a photo instead.';
            }
        }

        function stopCamera() {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
                cameraStream = null;
            }
            document.getElementById('cameraPreview').srcObject = null;
        }

        function showPhotoReveal(photoData) {
            capturedPhoto = photoData;
            stopCamera();
            document.getElementById('smileScreen').hidden = true;
            const mainContent = document.getElementById('mainContent');
            mainContent.classList.remove('hidden-content');
            mainContent.classList.add('is-entering');
            document.body.classList.add('page-unlocked');
            window.setTimeout(() => mainContent.classList.remove('is-entering'), 1500);
            document.getElementById('capturedPortrait').src = capturedPhoto;
            document.getElementById('photoReveal').hidden = false;
            window.scrollTo(0, 0);
        }

        function capturePhoto() {
            const video = document.getElementById('cameraPreview');
            if (!video.videoWidth || !video.videoHeight) return;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            showPhotoReveal(canvas.toDataURL('image/jpeg', 0.9));
        }

        function handlePhotoSelection(event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.addEventListener('load', () => showPhotoReveal(reader.result));
            reader.addEventListener('error', () => {
                document.getElementById('cameraMessage').innerText = 'That photo could not be opened. Please try another one.';
            });
            reader.readAsDataURL(file);
            event.target.value = '';
        }

        function placePhotoInLogo() {
            const reveal = document.getElementById('photoReveal');
            const portrait = document.getElementById('capturedPortrait');
            const logo = document.getElementById('brandMark');
            const portraitBounds = portrait.getBoundingClientRect();
            const logoBounds = logo.getBoundingClientRect();
            portrait.style.setProperty('--fly-x', `${logoBounds.left + logoBounds.width / 2 - (portraitBounds.left + portraitBounds.width / 2)}px`);
            portrait.style.setProperty('--fly-y', `${logoBounds.top + logoBounds.height / 2 - (portraitBounds.top + portraitBounds.height / 2)}px`);
            const logoPhoto = document.createElement('img');
            logoPhoto.src = capturedPhoto;
            logoPhoto.alt = '';
            logo.replaceChildren(logoPhoto);
            logo.classList.add('has-photo');
            const replyPhoto = document.createElement('img');
            replyPhoto.src = capturedPhoto;
            replyPhoto.alt = '';
            document.getElementById('replyOrnament').replaceChildren(replyPhoto);
            document.getElementById('replyOrnament').classList.add('has-photo');
            reveal.classList.add('is-leaving');
            let revealFinished = false;
            const finishReveal = () => {
                if (revealFinished) return;
                revealFinished = true;
                reveal.hidden = true;
                reveal.classList.remove('is-leaving');
                portrait.style.removeProperty('--fly-x');
                portrait.style.removeProperty('--fly-y');
            };
            portrait.addEventListener('animationend', finishReveal, { once: true });
            window.setTimeout(finishReveal, prefersReducedMotion.matches ? 50 : 1200);
        }

        // Clean streaming fallbacks that bypass standard browser blocks
        const playlist = {
            cinnamonGirl: "Music/Cinnamon Girl - Lana Del Rey (8d Audio) - jonny boy.mp3",
            doinTime: "Music/Lana Del Rey - Doin’ Time (16D AUDIO_NOT 9D_8D AUDIO)🎧 - shawty 16d.mp3",
            youngAndBeautiful: "Music/Lana Del Rey - Young and Beautiful [16D AUDIO  NOT 8D] 🎧 - Music Revolution.mp3"
        };
const songButtons = document.querySelectorAll('.jukebox-btn');
let currentTrackButton = null;
function setTrackButtonProgress(button, progress) {
const bounds = button.getBoundingClientRect();
if (bounds.width > 0 && bounds.height > 0) {
const svg = button.querySelector('.track-progress-path');
const svgBounds = svg.getBoundingClientRect();
const buttonStyle = getComputedStyle(button);
const left = bounds.left + parseFloat(buttonStyle.borderLeftWidth) / 2 - svgBounds.left;
const top = bounds.top + parseFloat(buttonStyle.borderTopWidth) / 2 - svgBounds.top;
const right = bounds.right - parseFloat(buttonStyle.borderRightWidth) / 2 - svgBounds.left;
const bottom = bounds.bottom - parseFloat(buttonStyle.borderBottomWidth) / 2 - svgBounds.top;
const middle = (top + bottom) / 2;
const radius = Math.min(5, (bottom - top) / 2);
const path = `M ${left} ${middle} L ${left} ${top + radius} Q ${left} ${top} ${left + radius} ${top} L ${right - radius} ${top} Q ${right} ${top} ${right} ${top + radius} L ${right} ${bottom - radius} Q ${right} ${bottom} ${right - radius} ${bottom} L ${left + radius} ${bottom} Q ${left} ${bottom} ${left} ${bottom - radius} L ${left} ${middle}`;
svg.setAttribute('viewBox', `0 0 ${svgBounds.width} ${svgBounds.height}`);
const lines = svg.querySelectorAll('path');
const dot = svg.querySelector('.track-progress-dot');
lines.forEach(line => {
    line.setAttribute('d', path);
    line.style.strokeDasharray = `${progress} 100`;
});
const point = lines[0].getPointAtLength(lines[0].getTotalLength() * progress / 100);
dot.setAttribute('cx', String(point.x));
dot.setAttribute('cy', String(point.y));
}
button.style.setProperty('--track-progress', `${progress}%`);
}
        function playSong(trackKey, trackName) {
const player = document.getElementById('audioPlayer');
const indicator = document.getElementById('nowPlayingText');
    const songConsole = document.getElementById('songConsole');
currentTrackButton = Array.from(songButtons).find(button => button.dataset.track === trackKey) || null;
songButtons.forEach(button => {
    button.classList.remove('is-current-track', 'is-playing');
    setTrackButtonProgress(button, 0);
});
if (currentTrackButton) {
    currentTrackButton.classList.add('is-current-track');
}
indicator.innerText = "🎵 Now Playing: Lana Del Rey - " + trackName;
indicator.style.display = 'block';
    document.getElementById('songTitle').innerText = trackName;
    songConsole.hidden = false;
    songConsole.classList.remove('is-active');
    void songConsole.offsetWidth;
    songConsole.classList.add('is-active');
// Fully force browser to release memory and stream audio instantly
player.pause();
player.setAttribute('src', playlist[trackKey]);
player.load();
    player.volume = Number(document.getElementById('songVolume').value);
var playPromise = player.play();
if (playPromise !== undefined) {
playPromise.catch(function(error) {
console.log("Browser playback interaction allowed successfully.");
});
}
}
function formatSongTime(seconds) {
const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
const minutes = Math.floor(safeSeconds / 60);
const remainingSeconds = String(safeSeconds % 60).padStart(2, '0');
return minutes + ':' + remainingSeconds;
}
function updateSongProgress() {
const player = document.getElementById('audioPlayer');
const seek = document.getElementById('songSeek');
const duration = Number.isFinite(player.duration) ? player.duration : 0;
const currentTime = Number.isFinite(player.currentTime) ? player.currentTime : 0;
if (currentTrackButton) {
const progress = duration > 0 ? Math.max(0, Math.min(100, currentTime / duration * 100)) : 0;
setTrackButtonProgress(currentTrackButton, progress);
}
seek.max = String(duration);
seek.value = String(Math.min(currentTime, duration));
seek.disabled = duration <= 0;
document.getElementById('songElapsed').innerText = formatSongTime(currentTime);
document.getElementById('songDuration').innerText = formatSongTime(duration);
seek.style.setProperty('--seek-progress', duration > 0 ? `${currentTime / duration * 100}%` : '0%');
}
function updateSongVolume() {
const volume = document.getElementById('songVolume');
const percentage = Math.round(Number(volume.value) * 100);
document.getElementById('audioPlayer').volume = Number(volume.value);
document.getElementById('volumeValue').innerText = percentage + '%';
volume.style.setProperty('--volume-level', percentage + '%');
}
        function revealBetStatus() {
const res = document.getElementById('betResult');
res.innerText = "🚨 Bet Update: Honestly, I think I'm going to lose this Dairy Milk... because my heart is already completely spoken for by the person reading this screen. 🍫❤️";
res.style.display = 'block';
}
        let wishLetterTimer = 0;
        function showWishMessage(wish, message) {
        window.clearTimeout(wishLetterTimer);
        const nameLetters = ['a', 'n', 'i', 'k', 'h', 'a'];
        const lowerMessage = message.toLowerCase();
        const matchIndexes = [];
        let searchFrom = 0;
        nameLetters.forEach(letter => {
            const matchIndex = lowerMessage.indexOf(letter, searchFrom);
            if (matchIndex !== -1) {
                matchIndexes.push(matchIndex);
                searchFrom = matchIndex + 1;
            }
        });
        const matchIndexSet = new Set(matchIndexes);
        const fragment = document.createDocumentFragment();
        const characterElements = [];
        Array.from(message).forEach((character, index) => {
            const characterElement = document.createElement('span');
            characterElement.className = 'wish-message-char';
            if (matchIndexSet.has(index)) characterElement.classList.add('wish-name-letter');
            characterElement.textContent = character;
            characterElements.push(characterElement);
            fragment.appendChild(characterElement);
        });
        wish.replaceChildren(fragment);
        let cursorElement = null;
        function moveWishCursor(characterIndex) {
            if (cursorElement) cursorElement.classList.remove('is-cursor');
            cursorElement = characterElements[characterIndex] || null;
            if (cursorElement) cursorElement.classList.add('is-cursor');
        }
        if (prefersReducedMotion.matches || matchIndexes.length === 0) {
            characterElements.forEach(character => character.classList.add('is-revealed'));
            moveWishCursor(characterElements.length - 1);
            return;
        }
        let nameLetterIndex = 0;
        function revealNameLetter() {
            if (nameLetterIndex >= matchIndexes.length) {
                let characterIndex = 0;
                function typeRemainingMessage() {
                    while (characterIndex < characterElements.length && matchIndexSet.has(characterIndex)) {
                        characterIndex += 1;
                    }
                    if (characterIndex >= characterElements.length) {
                        wishLetterTimer = 0;
                        return;
                    }
                    characterElements[characterIndex].classList.add('is-revealed');
                    moveWishCursor(characterIndex);
                    characterIndex += 1;
                    wishLetterTimer = window.setTimeout(typeRemainingMessage, 24);
                }
                wishLetterTimer = window.setTimeout(typeRemainingMessage, 900);
                return;
            }
            characterElements[matchIndexes[nameLetterIndex]].classList.add('is-revealed');
            moveWishCursor(matchIndexes[nameLetterIndex]);
            nameLetterIndex += 1;
            wishLetterTimer = window.setTimeout(revealNameLetter, 420);
        }
        revealNameLetter();
        }
        function blowCandle() {
        const cake = document.getElementById('cake');
        const wish = document.getElementById('cakeStatus');
const isBlown = cake.classList.toggle('is-blown');
cake.setAttribute('aria-pressed', String(isBlown));
cake.setAttribute('aria-label', isBlown ? 'Relight the birthday candles' : 'Blow out the birthday candles');
document.getElementById('cakePrompt').innerText = isBlown ? 'TAP TO LIGHT THE CANDLES AGAIN' : 'TAP THE CAKE TO MAKE A WISH';
if (isBlown) {
showWishMessage(wish, 'May this year bring you the same warmth and happiness you give to everyone around you. Keep dreaming, keep shining, and never forget how deeply you are cherished. I hope I get to be part of many more of your happiest moments. Happy birthday, Anikha. ❤️');
wish.classList.add('is-visible');
document.getElementById('audioPlayer').volume = 0.3;
} else {
window.clearTimeout(wishLetterTimer);
wishLetterTimer = 0;
wish.replaceChildren();
wish.classList.remove('is-visible');
document.getElementById('audioPlayer').volume = 1;
}
}
function updatePlaybackButton() {
const player = document.getElementById('audioPlayer');
const button = document.getElementById('playbackToggle');
const icon = document.getElementById('playbackIcon');
const label = document.getElementById('playbackLabel');
const hasSong = Boolean(player.getAttribute('src'));
const isPlaying = !player.paused && !player.ended;
if (currentTrackButton) currentTrackButton.classList.toggle('is-playing', isPlaying);
button.disabled = !hasSong;
icon.innerText = isPlaying ? 'Ⅱ' : '▶';
label.innerText = !hasSong ? 'Choose a song to begin' : isPlaying ? 'Pause music' : 'Resume music';
button.setAttribute('aria-label', label.innerText);
document.getElementById('songConsole').classList.toggle('is-playing', isPlaying);
}
function togglePlayback() {
const player = document.getElementById('audioPlayer');
if (!player.getAttribute('src')) return;
if (player.paused) {
const playPromise = player.play();
if (playPromise !== undefined) {
playPromise.catch(function(error) {
console.warn('Audio playback could not start:', error);
});
}
} else {
player.pause();
}
updatePlaybackButton();
}
const audioPlayer = document.getElementById('audioPlayer');
audioPlayer.addEventListener('play', updatePlaybackButton);
audioPlayer.addEventListener('pause', updatePlaybackButton);
audioPlayer.addEventListener('ended', updatePlaybackButton);
audioPlayer.addEventListener('loadedmetadata', updateSongProgress);
audioPlayer.addEventListener('durationchange', updateSongProgress);
audioPlayer.addEventListener('timeupdate', updateSongProgress);
audioPlayer.addEventListener('seeked', updateSongProgress);
document.getElementById('songSeek').addEventListener('input', event => {
audioPlayer.currentTime = Number(event.target.value);
updateSongProgress();
});
document.getElementById('songVolume').addEventListener('input', updateSongVolume);
updateSongVolume();
updateSongProgress();
updatePlaybackButton();

        const keepsakeStage = document.getElementById('keepsakeStage');
        const keepsakePendulum = document.getElementById('keepsakePendulum');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let keepsakeAngle = 0;
        let keepsakeVelocity = 0;
        let keepsakeDragging = false;
        let keepsakePointerMoved = false;
        let keepsakePointerAngle = 0;
        let keepsakePointerTime = 0;
        let keepsakeTapDirection = 1;
        let keepsakeLastTime = 0;
        let keepsakeFrame = 0;
        let keepsakeInView = false;
        function setKeepsakeAngle(angle) {
            keepsakeAngle = Math.max(-0.62, Math.min(0.62, angle));
            keepsakePendulum.style.setProperty('--keepsake-angle', `${keepsakeAngle}rad`);
        }
        function animateKeepsake(time) {
            keepsakeFrame = 0;
            if (document.hidden || keepsakeDragging) return;
            const delta = keepsakeLastTime ? Math.min((time - keepsakeLastTime) / 1000, 0.032) : 0;
            keepsakeLastTime = time;
            if (delta > 0) {
                const gravity = 9.81;
                const cordLength = 0.46;
                const airDamping = 0.9;
                const wind = prefersReducedMotion.matches ? 0 : 0.72 * Math.sin(time / 2100);
                keepsakeVelocity += ((-gravity / cordLength * Math.sin(keepsakeAngle)) + wind) * delta;
                keepsakeVelocity *= Math.exp(-airDamping * delta);
                const nextAngle = keepsakeAngle + keepsakeVelocity * delta;
                if (Math.abs(nextAngle) > 0.62) {
                    setKeepsakeAngle(Math.sign(nextAngle) * 0.62);
                    keepsakeVelocity *= -0.68;
                } else {
                    setKeepsakeAngle(nextAngle);
                }
            }
            if ((!prefersReducedMotion.matches && keepsakeInView) || Math.abs(keepsakeAngle) > 0.001 || Math.abs(keepsakeVelocity) > 0.005) {
                keepsakeFrame = window.requestAnimationFrame(animateKeepsake);
            } else {
                keepsakeAngle = 0;
                keepsakeVelocity = 0;
                keepsakePendulum.style.setProperty('--keepsake-angle', '0rad');
                keepsakeLastTime = 0;
            }
        }
        function startKeepsakeAnimation() {
            if (keepsakeInView && !document.hidden && !keepsakeFrame) {
                keepsakeFrame = window.requestAnimationFrame(animateKeepsake);
            }
        }
        function getKeepsakePointerAngle(event) {
            const bounds = keepsakeStage.getBoundingClientRect();
            return Math.atan2(event.clientX - (bounds.left + bounds.width / 2), Math.max(1, event.clientY - bounds.top));
        }
        keepsakeStage.addEventListener('pointerdown', event => {
            keepsakeDragging = true;
            keepsakePointerMoved = false;
            keepsakeStage.classList.add('is-dragging');
            keepsakeLastTime = 0;
            if (keepsakeFrame) {
                window.cancelAnimationFrame(keepsakeFrame);
                keepsakeFrame = 0;
            }
            keepsakeStage.setPointerCapture(event.pointerId);
            keepsakeStage.focus({ preventScroll: true });
            keepsakeVelocity = 0;
            keepsakePointerAngle = getKeepsakePointerAngle(event);
            keepsakePointerTime = performance.now();
            setKeepsakeAngle(keepsakePointerAngle);
        });
        keepsakeStage.addEventListener('pointermove', event => {
            if (keepsakeDragging && keepsakeStage.hasPointerCapture(event.pointerId)) {
                const time = performance.now();
                const delta = Math.max((time - keepsakePointerTime) / 1000, 0.008);
                const nextAngle = getKeepsakePointerAngle(event);
                if (Math.abs(nextAngle - keepsakePointerAngle) > 0.008) keepsakePointerMoved = true;
                keepsakeVelocity = Math.max(-5, Math.min(5, (nextAngle - keepsakePointerAngle) / delta));
                keepsakePointerAngle = nextAngle;
                keepsakePointerTime = time;
                setKeepsakeAngle(nextAngle);
            }
        });
        function releaseKeepsake(event) {
            if (!keepsakeDragging) return;
            keepsakeDragging = false;
            keepsakeStage.classList.remove('is-dragging');
            if (keepsakeStage.hasPointerCapture(event.pointerId)) keepsakeStage.releasePointerCapture(event.pointerId);
            if (!keepsakePointerMoved) {
                const direction = Math.abs(keepsakeAngle) > 0.035 ? Math.sign(keepsakeAngle) : keepsakeTapDirection;
                keepsakeTapDirection = -direction;
                keepsakeVelocity = direction * 2.2;
            } else {
                keepsakeVelocity = Math.max(-4.5, Math.min(4.5, keepsakeVelocity));
            }
            startKeepsakeAnimation();
        }
        keepsakeStage.addEventListener('pointerup', releaseKeepsake);
        keepsakeStage.addEventListener('pointercancel', releaseKeepsake);
        keepsakeStage.addEventListener('keydown', event => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            keepsakeVelocity += event.key === 'ArrowLeft' ? -1.1 : 1.1;
            startKeepsakeAnimation();
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && keepsakeFrame) {
                window.cancelAnimationFrame(keepsakeFrame);
                keepsakeFrame = 0;
                keepsakeLastTime = 0;
            } else if (!document.hidden) {
                startKeepsakeAnimation();
            }
        });
        prefersReducedMotion.addEventListener('change', () => {
            if (prefersReducedMotion.matches) {
                if (keepsakeFrame) {
                    window.cancelAnimationFrame(keepsakeFrame);
                    keepsakeFrame = 0;
                }
                keepsakeVelocity = 0;
                keepsakeLastTime = 0;
                setKeepsakeAngle(0);
            } else {
                startKeepsakeAnimation();
            }
        });
        if ('IntersectionObserver' in window) {
            const keepsakeObserver = new IntersectionObserver(entries => {
                keepsakeInView = entries.some(entry => entry.isIntersecting);
                if (keepsakeInView) {
                    startKeepsakeAnimation();
                } else if (keepsakeFrame) {
                    window.cancelAnimationFrame(keepsakeFrame);
                    keepsakeFrame = 0;
                    keepsakeLastTime = 0;
                }
            }, { threshold: 0.05 });
            keepsakeObserver.observe(keepsakeStage);
        } else {
            keepsakeInView = true;
        }
        startKeepsakeAnimation();

        const galleryWall = document.getElementById('galleryWall');
        const galleryItems = Array.from(galleryWall.querySelectorAll('.gallery-item'));
        const originalGalleryOrder = galleryItems.slice();
        const galleryWallStatus = document.getElementById('galleryWallStatus');
        let galleryAnimationTimer = 0;
        let galleryAnimationActive = false;
        let previousGalleryBatch = [];
        let galleryAnimationVisible = false;
        function stopGalleryAnimation() {
            galleryAnimationActive = false;
            window.clearTimeout(galleryAnimationTimer);
            galleryAnimationTimer = 0;
            galleryItems.forEach(item => item.classList.remove('is-featured'));
        }
        function animateGalleryBatch() {
            galleryAnimationTimer = 0;
            if (!galleryAnimationActive || document.hidden || prefersReducedMotion.matches || !galleryAnimationVisible) return;
            const candidates = galleryItems.filter(item =>
                item.classList.contains('is-visible') &&
                !item.classList.contains('is-dragging') &&
                !item.classList.contains('is-selected')
            );
            if (candidates.length < 2) {
                galleryAnimationTimer = window.setTimeout(animateGalleryBatch, 700);
                return;
            }
            const shuffled = candidates
                .filter(item => !previousGalleryBatch.includes(item))
                .sort(() => Math.random() - 0.5);
            const pool = shuffled.length >= 2 ? shuffled : candidates.sort(() => Math.random() - 0.5);
            const batch = pool.slice(0, Math.min(pool.length, 2 + Math.floor(Math.random() * 2)));
            previousGalleryBatch = batch;
            batch.forEach(item => item.classList.add('is-featured'));
            galleryAnimationTimer = window.setTimeout(() => {
                batch.forEach(item => item.classList.remove('is-featured'));
                galleryAnimationTimer = window.setTimeout(animateGalleryBatch, 550 + Math.random() * 650);
            }, 3200);
        }
        function startGalleryAnimation() {
            if (galleryAnimationActive || document.hidden || prefersReducedMotion.matches || !galleryAnimationVisible) return;
            galleryAnimationActive = true;
            galleryAnimationTimer = window.setTimeout(animateGalleryBatch, 450);
        }
        let selectedGalleryItem = null;
        let draggedGalleryItem = null;
        let galleryDropTarget = null;
        let galleryDragPointerId = null;
        let galleryDragStartX = 0;
        let galleryDragStartY = 0;
        function updateGalleryWallLabels() {
            galleryItems.forEach((item, index) => {
                const caption = item.querySelector('.caption').textContent.trim();
                item.setAttribute('aria-label', `Photo ${index + 1}. ${caption} Use the arrow keys to rearrange.`);
            });
        }
        function announceGalleryWall(message) {
            galleryWallStatus.textContent = '';
            window.setTimeout(() => {
                galleryWallStatus.textContent = message;
            }, 30);
        }
        function animateGalleryWall(previousPositions) {
            if (typeof Element.prototype.animate !== 'function' || !window.CSS || !CSS.supports('translate', '1px 1px')) return;
            previousPositions.forEach((previous, element) => {
                const next = element.getBoundingClientRect();
                const deltaX = previous.left - next.left;
                const deltaY = previous.top - next.top;
                if ((deltaX || deltaY) && !prefersReducedMotion.matches) {
                    element.animate(
                        [{ translate: `${deltaX}px ${deltaY}px` }, { translate: '0 0' }],
                        { duration: 420, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' }
                    );
                }
            });
        }
        function moveGalleryItem(item, targetIndex) {
            const currentItems = Array.from(galleryWall.children);
            const currentIndex = currentItems.indexOf(item);
            if (currentIndex < 0 || targetIndex < 0 || targetIndex >= currentItems.length || currentIndex === targetIndex) return false;
            const previousPositions = new Map(currentItems.map(element => [element, element.getBoundingClientRect()]));
            const nextItems = currentItems.filter(element => element !== item);
            nextItems.splice(targetIndex, 0, item);
            nextItems.forEach(element => galleryWall.appendChild(element));
            animateGalleryWall(previousPositions);
            updateGalleryWallLabels();
            return true;
        }
        function clearGallerySelection() {
            if (selectedGalleryItem) selectedGalleryItem.classList.remove('is-selected');
            selectedGalleryItem = null;
        }
        galleryItems.forEach(item => {
            item.draggable = false;
            item.querySelector('.gallery-img').draggable = false;
            item.addEventListener('pointerdown', event => {
                if (event.pointerType === 'touch' || event.button !== 0) return;
                draggedGalleryItem = item;
                galleryDragPointerId = event.pointerId;
                galleryDragStartX = event.clientX;
                galleryDragStartY = event.clientY;
                item.setPointerCapture(event.pointerId);
                item.focus({ preventScroll: true });
                event.preventDefault();
            });
            item.addEventListener('pointermove', event => {
                if (event.pointerId !== galleryDragPointerId || !draggedGalleryItem) return;
                if (!draggedGalleryItem.classList.contains('is-dragging')) {
                    const distance = Math.hypot(event.clientX - galleryDragStartX, event.clientY - galleryDragStartY);
                    if (distance < 8) return;
                    draggedGalleryItem.classList.add('is-dragging');
                }
                const underPointer = document.elementFromPoint(event.clientX, event.clientY);
                const target = underPointer && underPointer.closest('.gallery-item');
                if (galleryDropTarget && galleryDropTarget !== target) galleryDropTarget.classList.remove('is-drop-target');
                galleryDropTarget = target && galleryWall.contains(target) && target !== draggedGalleryItem ? target : null;
                if (galleryDropTarget) galleryDropTarget.classList.add('is-drop-target');
            });
            item.addEventListener('pointerup', event => {
                if (event.pointerId === galleryDragPointerId && draggedGalleryItem) {
                    const activeItem = draggedGalleryItem;
                    const wasDragging = activeItem.classList.contains('is-dragging');
                    const underPointer = document.elementFromPoint(event.clientX, event.clientY);
                    const target = underPointer && underPointer.closest('.gallery-item');
                    const dropTarget = target && galleryWall.contains(target) && target !== activeItem ? target : null;
                    if (wasDragging && dropTarget) {
                        const bounds = dropTarget.getBoundingClientRect();
                        const sameRow = Math.abs(event.clientY - (bounds.top + bounds.height / 2)) < bounds.height * 0.35;
                        const after = sameRow
                            ? event.clientX >= bounds.left + bounds.width / 2
                            : event.clientY >= bounds.top + bounds.height / 2;
                        const items = Array.from(galleryWall.children);
                        const sourceIndex = items.indexOf(activeItem);
                        let targetIndex = items.indexOf(dropTarget) + (after ? 1 : 0);
                        if (sourceIndex < targetIndex) targetIndex -= 1;
                        if (moveGalleryItem(activeItem, Math.min(targetIndex, galleryWall.children.length - 1))) {
                            announceGalleryWall('Photo rearranged.');
                        }
                    }
                    activeItem.classList.remove('is-dragging');
                    if (galleryDropTarget) galleryDropTarget.classList.remove('is-drop-target');
                    galleryDropTarget = null;
                    draggedGalleryItem = null;
                    galleryDragPointerId = null;
                }
            });
            item.addEventListener('pointercancel', () => {
                if (draggedGalleryItem) draggedGalleryItem.classList.remove('is-dragging');
                if (galleryDropTarget) galleryDropTarget.classList.remove('is-drop-target');
                galleryDropTarget = null;
                draggedGalleryItem = null;
                galleryDragPointerId = null;
             });
            item.addEventListener('pointerup', event => {
                if (event.pointerType !== 'touch') return;
                if (!selectedGalleryItem) {
                    selectedGalleryItem = item;
                    item.classList.add('is-selected');
                    announceGalleryWall('Photo selected. Tap another photo to place it next to that memory, or press Escape to cancel.');
                    return;
                }
                if (selectedGalleryItem === item) {
                    clearGallerySelection();
                    announceGalleryWall('Photo selection canceled.');
                    return;
                }
                const selectedIndex = Array.from(galleryWall.children).indexOf(selectedGalleryItem);
                const targetIndex = Array.from(galleryWall.children).indexOf(item);
                const insertIndex = selectedIndex < targetIndex ? targetIndex : targetIndex + 1;
                const moved = moveGalleryItem(selectedGalleryItem, Math.min(insertIndex, galleryWall.children.length - 1));
                clearGallerySelection();
                if (moved) announceGalleryWall('Photo rearranged.');
            });
            item.addEventListener('keydown', event => {
                if (event.key === 'Escape' && selectedGalleryItem) {
                    clearGallerySelection();
                    announceGalleryWall('Photo selection canceled.');
                    return;
                }
                const currentIndex = Array.from(galleryWall.children).indexOf(item);
                const direction = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1
                    : event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : 0;
                if (!direction) return;
                event.preventDefault();
                if (moveGalleryItem(item, currentIndex + direction)) {
                    announceGalleryWall(`Photo moved to position ${currentIndex + direction + 1} of ${galleryItems.length}.`);
                }
            });
        });
        updateGalleryWallLabels();
        document.getElementById('galleryWallReset').addEventListener('click', () => {
            const previousPositions = new Map(Array.from(galleryWall.children, item => [item, item.getBoundingClientRect()]));
            originalGalleryOrder.forEach(item => galleryWall.appendChild(item));
            animateGalleryWall(previousPositions);
            updateGalleryWallLabels();
            clearGallerySelection();
            announceGalleryWall('Photo wall restored to its original arrangement.');
        });
        galleryItems.forEach((item, index) => {
            item.style.setProperty('--gallery-delay', `${(index % 4) * 80}ms`);
        });
        if ('IntersectionObserver' in window) {
            const galleryAnimationObserver = new IntersectionObserver(entries => {
                galleryAnimationVisible = entries.some(entry => entry.isIntersecting);
                if (galleryAnimationVisible) {
                    startGalleryAnimation();
                } else {
                    stopGalleryAnimation();
                }
            }, { threshold: 0.08 });
            galleryAnimationObserver.observe(galleryWall);
        } else {
            galleryAnimationVisible = true;
            startGalleryAnimation();
        }
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopGalleryAnimation();
            } else {
                startGalleryAnimation();
            }
        });
        prefersReducedMotion.addEventListener('change', () => {
            if (prefersReducedMotion.matches) {
                stopGalleryAnimation();
            } else {
                startGalleryAnimation();
            }
        });
        const scrollRevealTargets = document.querySelectorAll('.section-heading, .soundtrack, .memory-feature, .gallery-keepsake, .bet-box, .wish-section, .reply-card');
        scrollRevealTargets.forEach((item, index) => {
            item.classList.add('scroll-reveal');
            item.classList.add(index % 2 === 0 ? 'scroll-reveal--left' : 'scroll-reveal--right');
            item.style.setProperty('--reveal-delay', `${(index % 3) * 90}ms`);
        });
        if ('IntersectionObserver' in window) {
            const galleryObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        galleryObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.14 });
            galleryItems.forEach(item => galleryObserver.observe(item));
            const scrollRevealObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        scrollRevealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
            scrollRevealTargets.forEach(item => scrollRevealObserver.observe(item));
        } else {
            galleryItems.forEach(item => item.classList.add('is-visible'));
            scrollRevealTargets.forEach(item => item.classList.add('is-revealed'));
        }
       