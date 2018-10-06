// ---------------------------------------------------------------------- 
// LIRI - Node.js Language Interpretation and Recognition Interface
// By Bryan Lee - September 2018
// ---------------------------------------------------------------------- 

// ---------------------------------------------------------------------- 
// global variables and npm requires 
// ---------------------------------------------------------------------- 

require("dotenv").config(); // dont env for information security
var Spotify = require("node-spotify-api"); // spotify API
var request = require("request"); // request package
var shortUrl = require('node-url-shortener'); // url shortener package for pretty urls
var moment = require("moment"); // moment package for time conversion
var keys = require("./keys"); // require this file for hidden spotify API keys
var fs = require("fs"); // require this file for hidden spotify API keys
var spotify = new Spotify(keys.spotify); // variable for spotify keys
var api = process.argv[2]; // variable to receive user arguments and process
var formattedInput = process.argv.slice(3).join("+");

// ---------------------------------------------------------------------- 
// function for getting data from spotify API 
// ---------------------------------------------------------------------- 

function getSpotify() {
    if (formattedInput === "") var formattedArtist = "The Sign";
    else var formattedArtist = formattedInput
    spotify.search({ type: 'track', query: formattedArtist }, (err, data) => {
        if (err) throw err;
        var songData = data.tracks.items;
        songData.forEach((song) => {
            var songPreview = song.album.artists[0].external_urls.spotify;
            songPreview = songPreview.replace(/"/g, "");
            var releaseDate = song.album.release_date;
            releaseDate = releaseDate.replace(/"/g, "");
            var artistName = song.album.artists[0].name;
            var songName = song.name;
            var albumName = song.album.name;
            shortUrl.short(songPreview, (err, url) => {
                if (err) throw err;
                console.log(`Artist: ${artistName}\nSong Name: ${songName}\nAlbum: ${albumName}\nListen on Spotify: ${url}\n`);
                fs.appendFile("song-log.txt", `Artist: ${artistName}\nSong Name: ${songName}\nListen on Spotify: ${url}\nAlbum: ${albumName}\n\n`, (err) => {if (err) throw err;});
            });
        });
    });
};

// ---------------------------------------------------------------------- 
// switch cases for diff API functionality - BandsInTown, OMDB, Spotify
// ---------------------------------------------------------------------- 

switch(api) {

    // bandsintown functionality
    case "concert-this":
        var queryUrl = `https://rest.bandsintown.com/artists/${formattedInput}/events?app_id=codingbootcamp`;
        request(queryUrl, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                var data = JSON.parse(body);
                data.forEach((event) => {
                    shortUrl.short(`${event.offers[0].url}`, (err, url) => {
                        if (err) throw err;
                        console.log(`Show Lineup: ${event.lineup[0]}\nShow Date: ${moment(event.datetime).format("MM-DD-YYYY")}\nVenue: ${event.venue.name}\nLocation: ${event.venue.city}, ${event.venue.region}\nLearn More: ${url}\n`);
                        fs.appendFile("show-log.txt",`Show Lineup: ${event.lineup[0]}\nShow Date: ${moment(event.datetime).format("MM-DD-YYYY")}\nVenue: ${event.venue.name}\nLocation: ${event.venue.city}, ${event.venue.region}\nLearn More: ${url}\n\n`,(error) => {if (error) throw error;});
                    });
                });
            };
        });
    break;

    // spotify functionality
    case "spotify-this-song":
        getSpotify();
    break;

    // omdb functionality
    case "movie-this":
        if (formattedInput === "") var formattedMovie = "Mr. Nobody";
        else var formattedMovie = formattedInput;
        var queryUrl = `http://www.omdbapi.com/?t=${formattedMovie}&y=&plot=short&apikey=trilogy`;
        request(queryUrl, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                var data = JSON.parse(body);
                console.log(`${data.Title}\nIMDB Rating: ${data.imdbRating}\nRTM Rating: ${data.Ratings[1].Value}\nProduced In: ${data.Country}\nLanguage: ${data.Language}\nPlot: ${data.Plot}\nActors: ${data.Actors}\n`);
                fs.appendFile("movie-log.txt",`${data.Title}\nIMDB Rating: ${data.imdbRating}\nReleased in: ${data.Year}\nRTM Rating: ${data.Ratings[1].Value}\nProduced In: ${data.Country}\nLanguage: ${data.Language}\nPlot: ${data.Plot}\nActors: ${data.Actors}\n\n`, (err) => {if (err) throw err;});
            };
        });
    break;

    // do what it says functionality
    case "do-what-it-says":
        fs.readFile("random.txt", "utf8", (err, data) => {
            if (err) throw err;
            var dataArr = data.split(",");
            api = dataArr[0];
            formattedInput = dataArr[1].replace(/"/g, "");
            getSpotify();
        });
    break;
};