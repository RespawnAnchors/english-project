const exploreButton = document.querySelector("#explore-button");
const fullscreenStatus = document.querySelector("#fullscreen-status");

function showLoadingScreen(backgroundAudio) {
    document.documentElement.classList.add("blackout");

    const screen = document.createElement("main");
    screen.className = "loading-screen";

    const title = document.createElement("h1");
    title.className = "loading-title";
    title.textContent = "CONGRUTALIONS! YOU'RE GETTING HACKED";

    const layout = document.createElement("div");
    layout.className = "loading-layout";

    const photo = document.createElement("img");
    photo.className = "loading-photo";
    photo.alt = "Loading screen image";
    photo.hidden = true;
    photo.addEventListener("error", () => {
        console.error("Unable to load loading-screen photo:", photo.src);
    });

    const content = document.createElement("div");
    content.className = "loading-content";

    const message = document.createElement("p");
    message.className = "loading-message";
    message.setAttribute("aria-live", "polite");

    const progressRow = document.createElement("div");
    progressRow.className = "progress-row";

    const track = document.createElement("div");
    track.className = "progress-track";
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", "Loading");
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    track.setAttribute("aria-valuenow", "0");

    const fill = document.createElement("div");
    fill.className = "progress-fill";
    track.append(fill);

    const percent = document.createElement("span");
    percent.className = "progress-percent";
    percent.textContent = "0%";
    progressRow.append(track, percent);

    const error = document.createElement("p");
    error.className = "loading-error";
    error.setAttribute("role", "alert");
    error.hidden = true;

    const cancelButton = document.createElement("button");
    cancelButton.className = "loading-cancel";
    cancelButton.type = "button";
    cancelButton.textContent = "Cancel";
    cancelButton.hidden = true;

    content.append(title, message, progressRow, error, cancelButton);
    layout.append(photo, content);
    screen.append(layout);
    document.body.replaceChildren(screen);

    let messageTimer;
    let progressTimer;
    let photoTimer;
    let dialogueAudioContext;
    cancelButton.addEventListener("click", () => {
        window.clearInterval(messageTimer);

        const line = "You think you can leave?? Since when do you think you are the one in control....";
        const dialogue = document.createElement("div");
        dialogue.className = "dialogue-box";
        dialogue.setAttribute("role", "status");
        dialogue.setAttribute("aria-label", line);

        const text = document.createElement("p");
        text.className = "dialogue-text";
        text.setAttribute("aria-hidden", "true");

        const cursor = document.createElement("span");
        cursor.className = "dialogue-cursor";
        cursor.setAttribute("aria-hidden", "true");
        cursor.textContent = "_";

        dialogue.append(text, cursor);
        cancelButton.disabled = true;
        content.append(dialogue);

        let characterIndex = 0;
        if (window.AudioContext) {
            try {
                dialogueAudioContext = new window.AudioContext();
                if (dialogueAudioContext.state === "suspended") {
                    dialogueAudioContext.resume().catch((error) => {
                        console.error("Unable to start dialogue audio:", error);
                    });
                }
            } catch (error) {
                console.error("Unable to create dialogue audio:", error);
            }
        } else {
            console.warn("Dialogue sound is not supported by this browser.");
        }

        const typeNextCharacter = () => {
            const character = line[characterIndex];
            text.textContent = line.slice(0, characterIndex + 1);
            if (dialogueAudioContext && character !== " ") {
                const oscillator = dialogueAudioContext.createOscillator();
                const volume = dialogueAudioContext.createGain();
                const now = dialogueAudioContext.currentTime;

                oscillator.type = "square";
                oscillator.frequency.value = 520 + (characterIndex % 5) * 55;
                volume.gain.setValueAtTime(0.045, now);
                volume.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
                oscillator.connect(volume);
                volume.connect(dialogueAudioContext.destination);
                oscillator.start(now);
                oscillator.stop(now + 0.035);
            }
            characterIndex += 1;

            if (characterIndex < line.length) {
                window.setTimeout(typeNextCharacter, 38);
            } else {
                cursor.remove();
                if (dialogueAudioContext) {
                    dialogueAudioContext.close().catch((error) => {
                        console.error("Unable to close dialogue audio:", error);
                    });
                    dialogueAudioContext = undefined;
                }
            }
        };
        typeNextCharacter();
    });

    const messages = [
        "Installing malware...",
        "accessing files...",
        "fetching Instagram data...",
        "fetched all data from device",
        "sending information to 2001:df0:b240:7b44:8a4:282:ac08:f5e0...",
        "sending instagram data",
        "succesfully sent instagram data to hacker",
        "sending chatgpt data"
    ];
    let progress = 0;
    let messageIndex = 0;
    let photoIndex = 0;
    message.textContent = messages[messageIndex];

    messageTimer = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        message.textContent = messages[messageIndex];
    }, 1100);

    progressTimer = window.setInterval(() => {
        progress = Math.min(progress + 1, 63);
        fill.style.width = `${progress}%`;
        percent.textContent = `${progress}%`;
        track.setAttribute("aria-valuenow", String(progress));

        if (progress === 10) {
            const photos = ["hacker1.png", "hacker2.png"];
            photo.src = new URL(photos[photoIndex], document.baseURI).href;
            photo.hidden = false;

            photoTimer = window.setInterval(() => {
                photoIndex = (photoIndex + 1) % photos.length;
                photo.src = new URL(photos[photoIndex], document.baseURI).href;
            }, 300);
        }

        if (progress === 30) {
            cancelButton.hidden = false;
        }

        if (progress === 63) {
            window.clearInterval(progressTimer);
            window.clearInterval(messageTimer);
            message.textContent = "ERR_DATA_TRANSFER_FAILED";
            error.textContent = "data transfer to hacker stopped abruptly...";
            error.hidden = false;
            fill.style.background = "#ff7777";
            window.setTimeout(() => {
                window.clearInterval(photoTimer);
                if (backgroundAudio) {
                    backgroundAudio.pause();
                    backgroundAudio.currentTime = 0;
                }
                if (dialogueAudioContext) {
                    dialogueAudioContext.close().catch((error) => {
                        console.error("Unable to close dialogue audio:", error);
                    });
                    dialogueAudioContext = undefined;
                }

                const video = document.createElement("video");
                video.className = "ending-video";
                video.src = new URL(
                    "ULTRAKILL death screen (blue screen - alt).mp4",
                    document.baseURI
                ).href;
                video.autoplay = true;
                video.muted = true;
                video.playsInline = true;
                video.addEventListener("playing", () => {
                    window.setTimeout(() => {
                        video.pause();
                        video.removeAttribute("src");
                        video.load();
                        if (backgroundAudio) {
                            backgroundAudio.pause();
                            backgroundAudio.currentTime = 0;
                        }
                        document.body.replaceChildren();
                        document.documentElement.classList.remove("video-screen");
                        document.documentElement.classList.add("maroon-screen");

                        const endingMessage = document.createElement("main");
                        endingMessage.className = "ending-message";

                        const greeting = document.createElement("h1");
                        greeting.textContent = "HI NIGGA, I AM THE HACKER. I HAVE YOUR DATA. I WILL BE WATCHING YOU.";

                        const image = document.createElement("img");
                        image.className = "ending-image";
                        image.src = new URL("image.webp", document.baseURI).href;
                        image.alt = "A photo";
                        image.addEventListener("error", () => {
                            console.error("Unable to load the ending image:", image.src);
                        });

                        endingMessage.append(greeting, image);
                        document.body.append(endingMessage);
                    }, 5000);
                }, { once: true });
                video.addEventListener("error", () => {
                    console.error("Unable to load the ending video:", video.error);
                });

                document.body.replaceChildren();
                document.documentElement.classList.remove("blackout");
                document.documentElement.classList.add("video-screen");
                document.body.append(video);
                video.load();
                video.play().catch((error) => {
                    console.error("Unable to play the ending video:", error);
                });
            }, 5000);
        }
    }, 120);
}

if (exploreButton && fullscreenStatus) {
    exploreButton.addEventListener("click", async () => {
        if (!document.fullscreenEnabled || !document.documentElement.requestFullscreen) {
            fullscreenStatus.textContent = "Fullscreen is not supported by this browser.";
            return;
        }

        const backgroundAudio = new Audio(new URL(
            "Undertale - Flowey Laugh (Free sound effect HD) 🔥🔥.mp3",
            document.baseURI
        ));
        backgroundAudio.loop = true;
        backgroundAudio.volume = 0.35;
        backgroundAudio.play().catch((error) => {
            console.error("Unable to play the looping background audio:", error);
        });

        try {
            await document.documentElement.requestFullscreen();
            exploreButton.disabled = true;
            exploreButton.textContent = "ACCESSING...";
            exploreButton.dataset.glitchText = exploreButton.textContent;
            exploreButton.classList.add("is-glitching");

            await new Promise((resolve) => window.setTimeout(resolve, 750));
            exploreButton.classList.remove("is-glitching");
            exploreButton.textContent = "SEE YOU SOON";
            await new Promise((resolve) => window.setTimeout(resolve, 500));

            showLoadingScreen(backgroundAudio);
        } catch (error) {
            fullscreenStatus.textContent = "Fullscreen could not start. Try opening this page with Live Server and click again.";
            console.error("Unable to enter fullscreen:", error);
        }
    });
}