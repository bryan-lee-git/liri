// read and set any environment variables with the dotenv package
require("dotenv").config();
var Spotify = require("node-spotify-api");
var request = require("request")



var keys = require("./keys");
var spotify = new Spotify(keys.spotify);
var api = process.argv[2];
var formattedInput = process.argv.slice(3).join(" ");

switch(api) {

    case "concert-this":

    console.log("concert");
    console.log(formattedInput);
    break;

    case "spotify-this":

    spotify.search({ type: 'track', query: formattedInput },(err, data) => {
        if (err) console.log(err);
        var artistName = JSON.stringify(data.tracks.items[0].album.artists[0].name);
        var albumName = JSON.stringify(data.tracks.items[0].album.name, null, 2);
        var releaseDate = JSON.stringify(data.tracks.items[0].album.release_date, null, 2);
        var songPreview = JSON.stringify(data.tracks.items[0].album.artists[0].external_urls.spotify, null, 2);
        console.log(`\nArtist: ${artistName}.`);
        console.log(`Album: ${albumName}`);
        console.log(`Release Date: ${releaseDate}`);
        console.log(`Listen on Spotify: ${songPreview}\n`);
    });
    break;

    case "movie-this":

    console.log("movie");
    console.log(formattedInput);
    break;

    case "do-what-it-says":

    console.log("do");
    console.log(formattedInput);
    break;
}