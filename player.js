// Select all the elements in the HTML page
// and assign them to a variable
// let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".album-art img");
let track_name = document.querySelector(".track-title h1");
let track_artist = document.querySelector(".track-artist");
 
let playpause_btn = document.querySelector(".play-pause");
let next_btn = document.querySelector(".next");
let prev_btn = document.querySelector(".prev");
 
let seek_slider = document.querySelector(".bar");

let curr_time = document.querySelector(".elapsed-time");
let total_duration = document.querySelector(".total-time");
 
// Specify globally used values
let track_index = 0;
let isPlaying = false;
let updateTimer;
 
// Create the audio element for the player
let curr_track = document.createElement('audio');


// Define the list of tracks that have to be played
let track_list = [];

//fetch the metadata from the server
fetch('http://localhost:3000/metadata').then(response =>
response.json()).then(data => {
  console.log(data)
  track_list = data;
  loadTrack(track_index)
});
  

// Function to reset all values to their default
function resetValues() {
  curr_time.textContent = "0:00";
  total_duration.textContent = "0:00";
  seek_slider.value = 0;
}

function loadTrack(track_index) {
  // Clear the previous seek timer
  clearInterval(updateTimer);
  resetValues();
 
 console.log(track_list[track_index])
  // Load a new track
  curr_track.src = track_list[track_index]?.url;
  curr_track.load();
 
  // Update details of the track
  track_art.src = "data:image/jpeg;base64,"+track_list[track_index].cover;
  track_name.textContent = track_list[track_index].title.split("|")[0];
  track_artist.textContent = track_list[track_index].artist;
  // now_playing.textContent =
    // "PLAYING " + (track_index + 1) + " OF " + track_list.length;
 
  // Set an interval of 500 milliseconds
  // for updating the seek slider
  updateTimer = setInterval(seekUpdate, 500);
 
  // Move to the next track if the current finishes playing
  // using the 'ended' event
  curr_track.addEventListener("ended", nextTrack);
 
  // Apply a random background color
  random_bg_color();
}

function playpauseTrack() {
  // Switch between playing and pausing
  // depending on the current state
  if (!isPlaying) playTrack();
  else pauseTrack();
}
 
function playTrack() {
  // Play the loaded track
  curr_track.play();
  isPlaying = true;
 
  // Replace icon with the pause icon
  playpause_btn.innerHTML = '<i class="bi bi-pause-circle-fill"></i>';
}
 
function pauseTrack() {
  // Pause the loaded track
  curr_track.pause();
  isPlaying = false;
 
  // Replace icon with the play icon
  playpause_btn.innerHTML = '<i class="bi bi-play-circle-fill"></i>';
}
 
function nextTrack() {
  // Go back to the first track if the
  // current one is the last in the track list
  if (track_index < track_list.length - 1)
    track_index += 1;
  else track_index = 0;
 
  // Load and play the new track
  loadTrack(track_index);
  playTrack();
}
 
function prevTrack() {
  // Go back to the last track if the
  // current one is the first in the track list
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length - 1;
   
  // Load and play the new track
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  // Calculate the seek position by the
  // percentage of the seek slider
  // and get the relative duration to the track
  seekto = curr_track.duration * (seek_slider.value / 100);
 
  // Set the current track position to the calculated seek position
  curr_track.currentTime = seekto;
}
 
function seekUpdate() {
  let seekPosition = 0;
 
  // Check if the current track duration is a legible number
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;
 
    // Calculate the time left and the total duration
    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);
 
    // Add a zero to the single digit time values
    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }
 
    // Display the updated duration
    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}



function random_bg_color() {
  // Get a random number between 30 to 180
  // (for getting darker colors)
  let red = Math.floor(Math.random() * 180) + 30;
  let green = Math.floor(Math.random() * 180) + 30;
  let blue = Math.floor(Math.random() * 180) + 30;

  // Construct a color with the given values
  let bgColor = "rgb(" + red + ", " + green + ", " + blue + ")";

  // Set the background to the new color
  document.querySelector("body").style.backgroundColor = bgColor;
  document.querySelector(".content").style.backgroundColor = bgColor;
  document.querySelector(".plate").style.color = bgColor;
}

prev_btn.addEventListener('click', prevTrack)
playpause_btn.addEventListener('click', playpauseTrack)
next_btn.addEventListener('click', nextTrack)
seek_slider.addEventListener('change', seekTo)
