require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res, next) => {
  res.render("index.hbs");
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      //console.log(data);
      console.log("The received data from the API: ", data.body.artists.items);

      res.render("search-artist-result.hbs", {
        artistArr: data.body.artists.items,
      });
    })
    
});

app.get("/albums/:artistId", (req, res, next) => {

    spotifyApi.getArtistAlbums(req.params.artistId)
    .then((albumsRute)=> {
        //console.log(albumsRute.body.items)
        res.render("albums.hbs", {
            albums: albumsRute.body.items
        })
    })
    .catch((err) =>
    console.log("The error while searching artists occurred: ", err)
  );
  
})

app.get("/albums/:artistId/tracks", (req, res, next) => {
console.log(req.params.artistId)
    spotifyApi.getAlbumTracks(req.params.artistId)
    .then((data)=> {
        console.log(data.body)
        res.render("tracks.hbs", { 
            tracks: data.body.items
        })
    })
    .catch((err) =>
    console.log('Something went wrong!', err)
  );
  
})

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
