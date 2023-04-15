require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
    

    // Our routes go here:
const index = require("./routes/index.routes");
app.use("/", index);


app.get('/artist-search', (req, res, next) => {
    const {artist} = req.query;
    //res.send(artistSearch.artist);
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            const artistsArr= data.body.artists.items;
            res.render('artist-search-result', {art: artistsArr})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
    console.log(req.query);
});

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            const albumsArr= data.body.items;
            res.render('albums',{albums: albumsArr})
        })
        .catch(err => {
            console.log('Error occurred while fetching artist albums:', err);
            next(err);
        });
});


app.get('/tracks/:tracksId/', (req, res, next) => {
    console.log(req.params.tracksId)
    spotifyApi
        .getAlbumTracks(req.params.tracksId)

        .then(data => {
            console.log('data recived: ', data.body);
            const tracksArr = data.body.items;
            res.render('tracks', { tracks: tracksArr })
        })
        .catch(err => {
            console.log('Error occurred while fetching album tracks:', err);
            next(err);
        });
    });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
