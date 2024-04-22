let songs;
let currFolder
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${currFolder}/`)
    let responce = await a.text();
    let div = document.createElement("div")
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1])

        }
    }


    //Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    songUL.innerHTML = ""

    for (let song of songs) {
        song = song.replaceAll("%20", " ")
        song = song.replace(".mp3", "")
        song = song.split("-")
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="images/music.svg" alt="">
        <div class="info">
            <div class="songName">${song[0]}</div>
            <div class="songArtist">${song[1]}</div>
            
        </div>
        <div class="playnow">
        <svg class="invert" data-encore-id="icon" role="img" aria-hidden="true"
        viewBox="0 0 24 24" class="Svg-sc-ytk21e-0 bneLcE">
        <path
                    d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                </path>
            </svg>
    
        </div></li>`;
    }


    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(li => {
        // console.log(element)
        li.querySelector(".playnow").addEventListener("click", () => {
            songName = li.querySelector(".songName").innerHTML;
            songArtist = li.querySelector(".songArtist").innerHTML;
            track = `${songName}-${songArtist}.mp3`;

            playMusic(track);
            // console.log(track);
        });
    });
    return songs
}

function convertSecondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return formattedMinutes + ":" + formattedSeconds;
}


let currentlyPlaying = null;
const playMusic = (track) => {
    const audio = new Audio(`/${currFolder}/` + track)
    if (audio) {
        if (currentlyPlaying) {
            currentlyPlaying.pause();
        }
        audio.play();
        currentlyPlaying = audio;
        play.src = "images/pause.svg"



    }

    let currentlyPlayingName = currentlyPlaying.src
    currentlyPlayingName = currentlyPlayingName.replaceAll("%20", " ")
    currentlyPlayingName = currentlyPlayingName.replace(".mp3", "")
    currentlyPlayingName = currentlyPlayingName.split(`/${currFolder}/`)[1]
    // console.log(currentlyPlayingName)
    currentlyPlayingName = currentlyPlayingName.split("-")
    document.querySelector(".songinfo").firstElementChild.innerHTML = currentlyPlayingName[0];
    document.querySelector(".songinfo").lastElementChild.innerHTML = currentlyPlayingName[1];


    //Listen for time update event
    audio.addEventListener("timeupdate", () => {
        // console.log(audio.currentTime, audio.duration);
        document.querySelector('.songCurrentTime').innerHTML = convertSecondsToMinutesSeconds(audio.currentTime)

        document.querySelector('.songDuration').innerHTML = convertSecondsToMinutesSeconds(audio.duration)

        document.querySelector(".circle").style.left = (audio.currentTime / audio.duration) * 100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        audio.currentTime = ((audio.duration) * percent) / 100
    })


}
async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let responce = await a.text();
    let div = document.createElement("div")
    div.innerHTML = responce;
    let anchors = div.getElementsByTagName("a")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-1)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let responce = await a.json();
            // console.log(responce)
            cardContainer = document.querySelector(".cardContainer")

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="innerCard">
            <div class="imgPlayBtn">
                <div class="play"><svg class="playSvg" data-encore-id="icon" role="img" aria-hidden="true"
                        viewBox="0 0 24 24" class="Svg-sc-ytk21e-0 bneLcE">
                        <path
                            d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                        </path>
                    </svg></div>
                <img src="songs/${folder}/cover.jpg" alt="">
            </div>
            <h2>${responce.title}</h2>
            <p>${responce.description}</p>
            </div>
        </div>`
        }
    }
    // load the playlist whenever card is clicked

    Array.from(document.getElementsByClassName('card')).forEach(e => {
        e.addEventListener("click", async item => {
            console.log( item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            
            
        })
        
        e.querySelector(".play").addEventListener("click", (item) => {
            console.log( item.currentTarget.dataset)
            playMusic(songs[0])
        })
    })
}


async function main() {

    //Get the list of all the songs
    await getSongs("songs/ncs")
    // console.log(songs)

    // Display all the albums on the page
    displayAlbums()


    //Attach ann event listener to play, next and previous
    playBtn.addEventListener("click", () => {
        if (currentlyPlaying.paused) {
            currentlyPlaying.play();
            play.src = "images/pause.svg";
        }
        else {
            currentlyPlaying.pause();
            play.src = "images/play.svg"
        }
    })

    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener('click', () => {
        document.querySelector(".left").style.position = "relative"
        document.querySelector(".left").style.left = "0"
        document.querySelector(".right").style.width = "calc(100vw - 250px)"
        document.querySelector(".hamburger").style.visibility = "hidden"
    })

    //Add an event listener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.position = "absolute"
        document.querySelector(".left").style.left = "-120%"
        document.querySelector(".right").style.width = "100vw"
        document.querySelector(".hamburger").style.visibility = "visible"

    })

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        // console.log("Previous")
        let index = songs.indexOf(currentlyPlaying.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
        // console.log(songs[index - 1])
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        // console.log("next")
        let index = songs.indexOf(currentlyPlaying.src.split("/").slice(-1)[0])
        if ((index + 1) > length) {
            playMusic(songs[index + 1])
        }
        // console.log(songs[index + 1])

    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentlyPlaying.volume = parseInt(e.target.value) / 100
    })


    // Add event listener to mute the track
    document.querySelector(".volume>button").addEventListener("click", e => {
        console.log(e.target)
        if (e.target.src.includes("images/volume.svg")) {
            e.target.src = e.target.src.replace("images/volume.svg", "images/mute.svg")
            currentlyPlaying.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;

        }
        else {
            e.target.src = e.target.src.replace("images/mute.svg", "images/volume.svg")
            currentlyPlaying.volume = 0.1
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

}



main()