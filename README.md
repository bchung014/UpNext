# README

![alt text][logo]

[logo]: https://raw.githubusercontent.com/MannanK/UpNext/master/frontend/src/assets/images/logo_3.png "UpNext Logo"

## [**_Link to UpNext (best viewed on mobile)_**](https://upnext-aa.herokuapp.com/)

### Team Members

**Mannan Kasliwal, [Michael Shen](https://github.com/imshentastic), [Brandon Chung](https://github.com/bchung014), [Sean Woodruff](https://github.com/sswoodruff89)**

### Basic Overview

UpNext is a one-stop-shop app that allows you to both log movies that you are interested in and then automatically get provided with recommendations based on these interests. No longer will you have to waste time on Google searching for what's next, because we'll show you what's *UpNext*!

The app was made using the **MERN stack** and is **meant to be used as a mobile web app first**. The API we are currently querying for movie information is **[TMDb](https://www.themoviedb.org/documentation/api?language=en-US)**. In the current version of the app, recommendations are provided based on your most recently watched interest, and media is limited to movies. In the future, UpNext will take into account all of your interests and provide aggregate recommendations, with media types being expanded to movies, shows, games, and music.

### Other Libraries Used
* React Slick
* Slick Carousel

### Features

* The app constantly queries and parses API calls to and from the TMDb API
* User authentication on the frontend and backend
* Ability to login as a demo user if signing up is too much of a hassle and you want to access the site's full features
* Ability to search for and add/delete interests, and get recommendations for similar interests based on your most recently watched interest
* Expanded details are available for each interest and recommendation, including information like the movie's duration, release date, vote rating, genres, and a lengthy overview that gives you a preview of what the movie  is about
* You can click on a recommendation to view more details about the movie, and then add it as an interest from the details pane

### React-Slick slider

* Carousel displays all entry results
* Carousel displays most recent interest
* Also allows for swipe options on mobile users
* Responsively changes size depending on the window size of the client

### Adding and Deleting Interests
* To add an interest, a user can start searching in the search bar for any movie they could possibly think of
* Using a debounced search every 350ms, an API request is made to TMDb's server to get movie titles the user could be trying to search for
* The user can then click on one of the suggestions to add that movie as an interest; doing so will add the interest in the MongoDB database
* Additionally, an API request is then made to TMDB's server to get recommendations for the interest the user just added, and the recommendations row is updated

### Future Features

* Have recommendations that take into account all of the user's interests
* Query multiple databases for multiple types of media (Spotify API for music, IGDb for games, TVDb for shows)
* Recommendations should include all forms of media, and mix and match metadata from all forms of media