const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: "9500256483f54974a48bbbb847aa8f9e",
  clientSecret: "4c2427594e464d5ba49354ee123645da",
  redirectUri: "http://127.0.0.1:5173/callback",
});

module.exports = spotifyApi;
