const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

var playlist = $(".zm-playlist-song-list");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const songName = $(".song-name-player");
const songSinger = $(".song-singer-player");
const cdthumb = $(".cd-thumb");
const audio = $("#audio");
const timebtn = $(".time-cr");
const btnRandom = $(".btn-random");
const btnRepeat = $(".btn-repeat");
const volumeCurrent = $(".volume");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "LALISA",
            singer: "Lisa",
            path: "./assets/music/Song1.mp3",
            image: "./assets/img/Song1.jpg",
        },
        {
            name: "On The Ground",
            singer: "Rose",
            path: "./assets/music/Song2.mp3",
            image: "./assets/img/Song2.jpg",
        },
        {
            name: "Yêu là cưới",
            singer: "Phát Hồ, X2X",
            path: "./assets/music/Song3.mp3",
            image: "./assets/img/Song3.jpg",
        },
        {
            name: "Phố đã lên đèn",
            singer: "Masew",
            path: "./assets/music/Song4.mp3",
            image: "./assets/img/Song4.jpg",
        },
        {
            name: "Rồi tới luôn",
            singer: "Nal",
            path: "./assets/music/Song5.mp3",
            image: "./assets/img/Song5.jpg",
        },
        {
            name: "Happy For You",
            singer: "Vũ",
            path: "./assets/music/Song6.mp3",
            image: "./assets/img/Song6.jpg",
        },
        {
            name: "Windy Hill",
            singer: "No Singer",
            path: "./assets/music/Song7.mp3",
            image: "./assets/img/Song7.jpg",
        },
        {
            name: "24H",
            singer: "LyLy",
            path: "./assets/music/Song8.mp3",
            image: "./assets/img/lyly24h.jpg",
        },
        {
            name: "Cưới thôi",
            singer: "Bray, Mashew",
            path: "./assets/music/Song9.mp3",
            image: "./assets/img/cuoi.jpg",
        },
        {
            name: "Thức Giấc",
            singer: "Da LaB",
            path: "./assets/music/Song10.mp3",
            image: "./assets/img/thucgiac.jpg",
        },
        {
            name: "3 1 0 7 - 3",
            singer: "W/n /Duong Nau",
            path: "./assets/music/Song11.mp3",
            image: "./assets/img/3107.jpg",
        },
        {
            name: "Sài Gòn Đau Lòng Quá",
            singer: "Hoàng Duyên, Hứa Kim Tuyền",
            path: "./assets/music/Song12.mp3",
            image: "./assets/img/saigon.jpg",
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <li class="zm-playlist-song-item ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                                <img src="${song.image}" class="song-img" alt="" />
                                <div class="song-info">
                                    <span class="song-name">${song.name}</span>
                                    <span class="song-singer">${song.singer}</span>
                                </div>
                            </li>`;
        });
        playlist.innerHTML = htmls.join("");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleDom: function () {
        const cdthumbAnimate = cdthumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, //10 seconds
            iterations: Infinity,
        });
        cdthumbAnimate.pause();
        playBtn.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        //Khi song được play
        audio.onplay = function () {
            app.isPlaying = true;
            playBtn.classList.add("playing");
            cdthumbAnimate.play();
        };

        //Khi song được pause
        audio.onpause = function () {
            app.isPlaying = false;
            playBtn.classList.remove("playing");
            cdthumbAnimate.pause();
        };
        audio.ontimeupdate = function () {
            var timeSongCurrent = $(".time-song-current");
            var timeSongDuration = $(".time-song-duration");
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.style.width = `${progressPercent}%`;
            }
            // Update current song play

            audio.addEventListener("loadeddata", () => {
                //Update song toltal
                let audioTimeDurations = audio.duration;
                let toltalMin = Math.floor(audioTimeDurations / 60);
                let toltalSec = Math.floor(audioTimeDurations % 60);
                if (toltalSec < 10) {
                    toltalSec = `0${toltalSec}`;
                }
                timeSongDuration.innerText = `${toltalMin}:${toltalSec}`;
            });
            let currentMin = Math.floor(audio.currentTime / 60);
            let currentSec = Math.floor(audio.currentTime % 60);
            if (currentSec < 10) {
                currentSec = `0${currentSec}`;
            }
            timeSongCurrent.innerText = `${currentMin}:${currentSec}`;
        };

        timebtn.addEventListener("click", (e) => {
            let progressWidth = timebtn.clientWidth;
            let clicked = e.offsetX;
            let songDuration = audio.duration;
            audio.currentTime = (clicked / progressWidth) * songDuration;
        });

        // Next
        nextBtn.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
        };
        audio.onended = function () {
            if (app.isRepeat) {
                audio.play();
            } else {
                nextBtn.onclick();
            }
        };
        prevBtn.onclick = function () {
            app.prevSong();
            audio.play();
        };
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".zm-playlist-song-item:not(.active)");
            if (songNode || e.target.closest(".option")) {
                //Xử lý vào songs
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadcurrentSong();
                    app.render();
                    audio.play();
                }

                //Xử lý khi check vào song option
            }
        };

        //Xử lý random song
        btnRandom.onclick = function () {
            app.isRandom = !app.isRandom;
            btnRandom.classList.toggle("active", app.isRandom);
        };

        //Xử lý lặp lại song
        btnRepeat.onclick = function () {
            app.isRepeat = !app.isRepeat;
            btnRepeat.classList.toggle("active", app.isRepeat);
        };

        // Xử lý mute volume khi click vào volume
        mute_sound = function () {
            audio.volume = 0;
            volume.value = 0;
        };
        //Xử lý thanh volume
        volume_change = () => {
            audio.volume = volume.value / 100;
            if (volume.value > 0) {
                volumeCurrent.classList.remove("mute");
            } else {
                volumeCurrent.classList.add("mute");
            }
        };
        unmute_sound = () => {
            const getValue = volume.value;
            volume.value = 43;
            audio.value = 43;
            volumeCurrent.classList.remove("mute");
        };

        volumeCurrent.onclick = function () {
            volumeCurrent.classList.add("mute");
        };
    },
    loadcurrentSong: function () {
        songName.textContent = this.currentSong.name;
        songSinger.textContent = this.currentSong.singer;
        cdthumb.style.backgroundImage = ` url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadcurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex <= 0) {
            this.currentIndex = 0;
        }
        this.loadcurrentSong();
    },
    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadcurrentSong();
    },

    repeatSong: function () {
        audio.play();
    },

    start: function () {
        this.defineProperties();
        this.handleDom();
        this.loadcurrentSong();
        this.render();
    },
};

app.start();

//Slider

var slideIndex = 0;
var slides = document.querySelectorAll(".gallery-item");
var showSl = document.querySelector(".gallery-contaier");
var btnPrev = document.querySelector(".btn-prev-slide");
var btnNext = document.querySelector(".btn-next-slide");
var slideShow = document.querySelectorAll(".gallery-contaier-item");
var slideIndex = 1;
showSlides(slideIndex);

btnNext.onclick = function plusSlides() {
    showSlides((slideIndex += 1));
};
btnPrev.onclick = function plusSlides() {
    showSlides((slideIndex += -1));
};

function currentSlide(n) {
    showSlides((slideIndex = n));
}

function showSlides(n) {
    var i;
    if (n > slideShow.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slideShow.length;
    }
    for (i = 0; i < slideShow.length; i++) {
        slideShow[i].classList.remove("active");
    }
    slideShow[slideIndex - 1].classList.add("active");
}

// Slider listned

const listnedItems = $$(".listend .listen-history-container");
const listendMain = $(".listend");
const listPrev = $(".listen-history-icon-back");
const listNext = $(".listen-history-icon-next");
const listendItemWidth = listnedItems[0].offsetWidth;
const listendLength = listnedItems.length;
console.log(listendItemWidth, listendLength);

listNext.addEventListener("click", function () {
    handelSlide(1);
    listPrev.classList.add("active");
});

listPrev.addEventListener("click", function () {
    handelSlide(-1);
    listNext.classList.add("active");
});
var ind = 1;
var positionX = 0;
function handelSlide(derection) {
    if (derection === 1) {
        ind++;
        if (ind > listendLength) {
            ind = listendLength;
            return;
        }
        if (ind > listendLength - 1) {
            listNext.classList.remove("active");
        }
        positionX = positionX - listendItemWidth;
        listendMain.style = `transform: translateX(${positionX}px)`;
    } else if (derection === -1) {
        ind--;
        if (ind < 1) {
            ind = 1;
            listPrev.classList.remove("active");
            return;
        }
        positionX = positionX + listendItemWidth;
        listendMain.style = `transform: translateX(${positionX}px)`;
    }
}

//Slider show 2

const slideContainer = $(".slideshow-list-music");
const sliderImg = [...$$(".list1")];
const sliderWidth = sliderImg[0].offsetWidth;
let pos = 0;
console.log(sliderImg);
let index = 0;
function next() {
    if (index >= sliderImg.length - 1) {
        return;
        // index = 0;
    } else {
        index++;
    }
    if (index === sliderImg.length - 1) {
        $(".listen-history-container-next").classList.remove("active");
    }
    slideContainer.style.transform = `translateX(-${index * sliderWidth}px)`;
}

function prev() {
    if (index === 0) {
        return;
    } else {
        index--;
    }
    if (index < 1) {
        $(".listen-history-container-prev").classList.remove("active");
    }
    slideContainer.style.transform = `translateX(-${index * sliderWidth}px)`;
}

$(".listen-history-container-next").addEventListener("click", function () {
    next();
    $(".listen-history-container-prev").classList.add("active");
});
$(".listen-history-container-prev").addEventListener("click", function () {
    prev();
    $(".listen-history-container-next").classList.add("active");
});

// setInterval(function () {
//     next();
// }, 5000);
