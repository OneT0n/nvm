document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("overlay");
    const containerFollow = document.getElementById("containerFollow");
    const audioElement = document.getElementById("audio");
    const progressBar = document.querySelector(".progress-bar-modern .progress");
    const timeCurrentDisplay = document.querySelector(".player-time-current");
    const timeDurationDisplay = document.querySelector(".player-time-duration");
    const rotatingContainer = document.getElementById("rotating-container");
    const coverBlock = document.getElementById("coverBlock");
    const coverImage = document.querySelector(".cover-img");
    const playerTitle = document.getElementById("playerTitle");
    const playerArtist = document.getElementById("playerArtist");
    const prevTrackButton = document.getElementById("prevTrack");
    const nextTrackButton = document.getElementById("nextTrack");
    const trackList = document.getElementById("trackList");
    const dynamicIsland = document.getElementById("dynamicIsland");
    const trackCoverMini = document.getElementById("trackCoverMini");
    const trackTitleMini = document.getElementById("trackTitleMini");
    const trackArtistMini = document.getElementById("trackArtistMini");
    const dynamicPlayPauseBtn = document.getElementById("dynamicPlayPauseBtn");
    const dynamicPrevBtn = document.getElementById("dynamicPrevBtn");
    const dynamicNextBtn = document.getElementById("dynamicNextBtn");
    const progressFillMini = document.getElementById("progressFillMini");
    const collapsedCoverMini = document.getElementById("collapsedCoverMini");
    const collapsedTrackTitle = document.getElementById("collapsedTrackTitle");
    const collapsedPlayIndicator = document.getElementById("collapsedPlayIndicator");
    let isDynamicIslandExpanded = false;
    let dynamicIslandTimeout = null;
    const track1 = {
        src: "assets/music/music.mp3",
        cover: "assets/cover/cover.png",
        title: "Still Think About You",
        artist: "A Boogie Wit da Hoodie",
    };
    const playlist = [track1];
    let currentTrackIndex = 0;

    function setupMarquee(titleEl) {
        if (!titleEl) return;
        
        titleEl.classList.remove('scrolling');
        titleEl.style.animation = 'none';
        titleEl.style.transform = 'translateX(0)';
        titleEl.style.removeProperty('--text-width');
        titleEl.style.removeProperty('--container-width');
        
        requestAnimationFrame(() => {
            const containerEl = titleEl.parentElement;
            const textWidth = titleEl.scrollWidth;
            const containerWidth = containerEl.clientWidth;

            if (textWidth > containerWidth) {
                titleEl.style.setProperty('--text-width', `${textWidth}px`);
                titleEl.style.setProperty('--container-width', `${containerWidth}px`);
                titleEl.style.removeProperty('animation');
                titleEl.classList.add('scrolling');
            }
        });
    }

    function showDynamicIsland() {
        if (dynamicIsland && !overlay.classList.contains("hidden")) return;
        if (dynamicIsland) {
            dynamicIsland.classList.add('visible');
        }
    }

    function hideDynamicIsland() {
        if (dynamicIsland) {
            dynamicIsland.classList.remove('visible', 'expanded');
            isDynamicIslandExpanded = false;
        }
    }

    function expandDynamicIsland() {
        if (dynamicIsland && !isDynamicIslandExpanded) {
            dynamicIsland.classList.add('expanded');
            isDynamicIslandExpanded = true;
            clearTimeout(dynamicIslandTimeout);
            dynamicIslandTimeout = setTimeout(() => {
                collapseDynamicIsland();
            }, 5000);
        }
    }

    function collapseDynamicIsland() {
        if (dynamicIsland && isDynamicIslandExpanded) {
            dynamicIsland.classList.remove('expanded');
            isDynamicIslandExpanded = false;
            
            const onTransitionEnd = (event) => {
                if (event.propertyName === 'width') {
                    setupMarquee(collapsedTrackTitle);
                    dynamicIsland.removeEventListener('transitionend', onTransitionEnd);
                }
            };
            dynamicIsland.addEventListener('transitionend', onTransitionEnd);
        }
    }

    function updateDynamicIslandTrack(track) {
        if (trackCoverMini) trackCoverMini.src = track.cover;
        if (trackTitleMini) trackTitleMini.textContent = track.title;
        if (trackArtistMini) trackArtistMini.textContent = track.artist;
        if (collapsedCoverMini) collapsedCoverMini.src = track.cover;
        if (collapsedTrackTitle) {
            collapsedTrackTitle.textContent = track.title;
            setupMarquee(collapsedTrackTitle);
        }
    }

    function updateDynamicIslandProgress(currentTime, duration) {
        if (progressFillMini && duration > 0) {
            const progress = (currentTime / duration) * 100;
            progressFillMini.style.width = progress + '%';
        }
    }

    function updateDynamicIslandPlayState(isPlaying) {
        if (dynamicPlayPauseBtn) {
            dynamicPlayPauseBtn.classList.toggle('playing', isPlaying);
        }
        if (collapsedPlayIndicator) {
            collapsedPlayIndicator.style.animation = isPlaying ? 'pulse-indicator 1.5s infinite' : 'none';
        }
    }

    function renderPlaylist() {
        if (!trackList) return;
        trackList.innerHTML = '';
        playlist.forEach((track, index) => {
            const trackItemElement = document.createElement("div");
            trackItemElement.className = "track-item" + (index === currentTrackIndex ? " active" : '');
            trackItemElement.dataset.index = index;
            trackItemElement.innerHTML = `
          <img src="${track.cover}" alt="${track.title}" class="track-item-cover">
          <div class="track-item-info">
            <div class="track-item-title">${track.title}</div>
            <div class="track-item-artist">${track.artist}</div>
          </div>`;
            trackItemElement.addEventListener("click", () => {
                if (index !== currentTrackIndex) {
                    loadTrack(index);
                }
            });
            trackList.appendChild(trackItemElement);
        });
    }

    function updateActiveTrackClass() {
        if (!trackList) return;
        const trackItems = trackList.querySelectorAll(".track-item");
        trackItems.forEach((item, index) => {
            item.classList.toggle("active", index === currentTrackIndex);
        });
    }

    function loadTrack(index, autoplay = true) {
        if (!audioElement || !coverBlock || !playerTitle || !playerArtist) return;
        currentTrackIndex = index;
        const track = playlist[index];
        audioElement.src = track.src;
        coverImage.src = track.cover;
        playerTitle.textContent = track.title;
        playerArtist.textContent = track.artist;
        setupMarquee(playerTitle);
        updateDynamicIslandTrack(track);
        updateActiveTrackClass();
        audioElement.volume = 0.05;
        if (autoplay) {
            audioElement.play().catch(error => {
                console.warn('Audio play failed:', error);
            });
            showDynamicIsland();
            expandDynamicIsland();
        }
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex, true);
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex, true);
    }

    let resizeTimeout;
    let isResizingOptimized = false;
    let originalFontSizes = new Map();

    function adjustArtistNameFontSize() {
        if (isResizingOptimized) return;
        const artistNameElements = document.querySelectorAll(".artist-name");
        artistNameElements.forEach(element => {
            element.style.fontSize = '';
            const checkHeight = () => {
                const rect = element.getBoundingClientRect();
                const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight);
                return rect.height > lineHeight * 2;
            };
            let currentFontSize = parseFloat(window.getComputedStyle(element).fontSize);
            while (checkHeight() && currentFontSize > 10) {
                currentFontSize -= 1;
                element.style.fontSize = currentFontSize + 'px';
            }
        });
    }

    function startFontResizeOptimization() {
        if (!isResizingOptimized) {
            isResizingOptimized = true;
            const artistNameElements = document.querySelectorAll(".artist-name");
            artistNameElements.forEach((element, index) => {
                const fontSize = window.getComputedStyle(element).fontSize;
                originalFontSizes.set(index, fontSize);
                element.style.fontSize = fontSize;
                element.style.transition = "none";
            });
        }
    }

    function endFontResizeOptimization() {
        if (isResizingOptimized) {
            isResizingOptimized = false;
            const artistNameElements = document.querySelectorAll(".artist-name");
            artistNameElements.forEach((element, index) => {
                element.style.transition = '';
                originalFontSizes.delete(index);
            });
            adjustArtistNameFontSize();
        }
    }

    let isAnimationInitialized = false;
    let targetRotateY = 0;
    let targetRotateX = 0;
    let currentRotateY = 0;
    let currentRotateX = 0;

    function handleMouseMove(event) {
        if (!rotatingContainer) return;
        const rect = rotatingContainer.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        targetRotateY = (event.clientX - centerX) / (rect.width / 2) * 3;
        targetRotateX = -((event.clientY - centerY) / (rect.height / 2)) * 3;
    }

    function animateCover() {
        if (isAnimationInitialized || !rotatingContainer) return;
        isAnimationInitialized = true;
        document.addEventListener("mousemove", handleMouseMove);
        function animationLoop() {
            currentRotateY += (targetRotateY - currentRotateY) * 0.08;
            currentRotateX += (targetRotateX - currentRotateX) * 0.08;
            rotatingContainer.style.transform = `perspective(800px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
            requestAnimationFrame(animationLoop);
        }
        animationLoop();
    }

    function setArtistBackgroundImages() {
        const artistItems = document.querySelectorAll(".artist-item");
        artistItems.forEach(item => {
            let bgImage = item.dataset.bgImage;
            if (bgImage) {
                console.log('Setting background image:', bgImage);
                item.style.setProperty("--artist-bg-image", `url('${bgImage}')`);
            }
        });
    }

    if (audioElement) {
        audioElement.volume = 0.06;
        audioElement.addEventListener("ended", nextTrack);
        audioElement.addEventListener("timeupdate", () => {
            if (!progressBar || !timeCurrentDisplay) return;
            const currentTime = audioElement.currentTime;
            const duration = audioElement.duration || 0;
            progressBar.style.width = (currentTime / duration) * 100 + '%';
            updateDynamicIslandProgress(currentTime, duration);
            const formatTime = (seconds) => {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
                return `${minutes}:${remainingSeconds}`;
            };
            timeCurrentDisplay.textContent = formatTime(currentTime);
        });
        audioElement.addEventListener("loadedmetadata", () => {
            if (!timeDurationDisplay) return;
            const duration = audioElement.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
            timeDurationDisplay.textContent = `${minutes}:${seconds}`;
        });
        const togglePlayingClass = () => {
            if (!coverBlock) return;
            coverBlock.classList.toggle("playing", !audioElement.paused);
            updateDynamicIslandPlayState(!audioElement.paused);
            showDynamicIsland();
        };
        audioElement.addEventListener("play", togglePlayingClass);
        audioElement.addEventListener("pause", togglePlayingClass);
    }

    if (nextTrackButton) nextTrackButton.addEventListener("click", nextTrack);
    if (prevTrackButton) prevTrackButton.addEventListener("click", prevTrack);

    if (coverBlock) {
        coverBlock.addEventListener("click", () => {
            if (audioElement.paused) {
                audioElement.play().catch(error => {
                console.warn('Audio play failed:', error);
            });
            } else {
                audioElement.pause();
            }
        });
        coverBlock.addEventListener("mouseenter", () => coverBlock.classList.add("show-controls"));
        coverBlock.addEventListener("mouseleave", () => coverBlock.classList.remove("show-controls"));
    }

    if (dynamicIsland) {
        dynamicIsland.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!isDynamicIslandExpanded) {
                expandDynamicIsland();
            } else {
                collapseDynamicIsland();
            }
        });
    }

    if (dynamicPlayPauseBtn) {
        dynamicPlayPauseBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (audioElement.paused) {
                audioElement.play().catch(error => {
                console.warn('Audio play failed:', error);
            });
            } else {
                audioElement.pause();
            }
        });
    }

    if (dynamicPrevBtn) {
        dynamicPrevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            prevTrack();
        });
    }

    if (dynamicNextBtn) {
        dynamicNextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            nextTrack();
        });
    }

    const progressBarContainer = document.querySelector(".progress-bar-modern");
    if (progressBarContainer && audioElement) {
        progressBarContainer.addEventListener("click", event => {
            const rect = event.currentTarget.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const width = rect.width;
            audioElement.currentTime = (clickX / width) * audioElement.duration;
        });
    }

    const languageItems = document.querySelectorAll(".language-item[data-lang]");
    languageItems.forEach(item => {
        item.addEventListener("click", () => {
            const lang = item.getAttribute("data-lang");
            if (window.changeLanguage) {
                window.changeLanguage(lang);
            }
            languageItems.forEach(el => el.classList.remove("active"));
            item.classList.add("active");
        });
    });

    // Категории модов
    const categoryItems = document.querySelectorAll(".category-item");
    categoryItems.forEach(category => {
        const header = category.querySelector(".category-header");
        header.addEventListener("click", () => {
            category.classList.toggle("expanded");
        });
    });

    window.addEventListener("resize", () => {
        startFontResizeOptimization();
        setupMarquee(playerTitle);
        setupMarquee(collapsedTrackTitle);
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(() => {
            endFontResizeOptimization();
        }, 150);
    });

    if (overlay) {
        overlay.addEventListener("click", () => {
            overlay.classList.add("hidden");
            containerFollow.classList.remove("hidden-content");
            loadTrack(currentTrackIndex, true);
            setArtistBackgroundImages();
            setTimeout(() => adjustArtistNameFontSize(), 1000);
        });
    }

    function initializeApp() {
        renderPlaylist();
        setArtistBackgroundImages();
        if (audioElement) {
            loadTrack(currentTrackIndex, false);
        }
        setTimeout(() => adjustArtistNameFontSize(), 1000);
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (!isTouchDevice) {
            animateCover();
        }
        if (overlay && overlay.classList.contains("hidden")) {
            containerFollow.classList.remove("hidden-content");
        }
        if (window.initTranslations) {
            window.initTranslations();
        }
    }

    initializeApp();
});