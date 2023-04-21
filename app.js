require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
})

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:

app.get('/', (req, res) => {
    res.render('home')
})


/* app.get('/artist-search', (req, res) => {
    const artistSearched = req.params
    console.log(artistSearched)
    spotifyApi
    .searchArtists(artistSearched)
    .then(data => {
      console.log('The received data from the API: ', data.body)
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search-results', {data})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
}) */

app.get('/artist-search', (req, res) => {
    console.log(req.query)
    const artist = req.query.artist
    spotifyApi.searchArtists(artist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items[0].images[0])
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results', {data})
}) 
  .catch(err => console.log('The error while searching artists occurred: ', err))
  
    
  })

  app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi.getArtistAlbums('artistId').then(
        function(data) {
          console.log('Artist albums', data.body);
        },
        function(err) {
          console.error(err);
        }
      );
  })

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
