import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { createInterest } from '../../actions/interest_actions';
import { createSimilarRecommendations, fetchSimilarRecommendations } from '../../actions/recommendation_actions';
import keys from "../../config/keys";

// const keys = require('../../config/keys');

// had to append REACT_APP at the front of the config var in Heroku in order for
// React to know to embed the var inside process.env
const tmdbApiKey = keys.tmdbApiKey;
const debounce = require("lodash.debounce");
const isEmpty = require("lodash.isempty");

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: '',
      searchResults: []
    };

    this.handleInput = this.handleInput.bind(this);
    this.makeDebouncedSearch = debounce(this.makeDebouncedSearch, 350);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillUnmount() {
    // without this, we get a memory leak error
    // after unmounting the debounced function was still getting called, and
      // therefore we were trying to setState for searchResults after the
      // component had already unmounted
    this.makeDebouncedSearch.cancel();
  }

  handleInput(e) {
    let keyword = e.currentTarget.value;

    // 1. make the omdb call to get the final interest the user chose
    if (keyword !== "") {
      this.setState({ keyword });
      this.makeDebouncedSearch(keyword);
    } else {
      this.props.closeModal();
    }
  }

  makeDebouncedSearch(keyword) {
    const instance = axios.create();
    instance.defaults.headers.common = {};
    instance.defaults.headers.common.accept = 'application/json';

    // https://developers.themoviedb.org/3/search/search-movies

    instance
      .get(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${keyword}&include_adult=false`)
      .then(response => {
        let searchResults = response.data.results;
        
        // Removes any search results that are missing metadata like date or poster
        let sanitizedResults = searchResults.reduce((store, entry) => {
          if (!Object.values(entry).some(field => field === null)) {
            store.push(entry);
          }
          return store;
        }, []);

        if (!isEmpty(sanitizedResults)) {
          sanitizedResults = sanitizedResults.slice(0, 10);
        }

        this.setState({
          searchResults: sanitizedResults
        });
      });
  }

  // first make a call to omdb to get the full interest info
  // then make a call to our own backend with the return value of that, to add
    // a new interest
  handleClick(id) {
    return e => {
      e.preventDefault();

      const instance = axios.create();
      instance.defaults.headers.common = {};
      instance.defaults.headers.common.accept = 'application/json';

      // https://developers.themoviedb.org/3/movies/get-movie-details

      instance
        .get(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}`)
        .then(response => {
          this.props.createInterest(response.data);
          setTimeout(() => {
            this.props.fetchSimilarRecommendations();
            this.props.closeModal();
          }, 30);
        });

      // May refactor in the future so that recommendations are made only after and if createInterest and closeModal are successful
      instance
        .get(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${tmdbApiKey}`)
        .then(response => {
          let count = 0;
          let recommendations = [];

          const promises = response.data.results.map((recommendation) => {
            let recId = recommendation.id;
            return instance.get(`https://api.themoviedb.org/3/movie/${recId}?api_key=${tmdbApiKey}`)
              .then(movie => {
                count += 1;

                recommendation.genres = movie.data.genres;
                recommendation.runtime = movie.data.runtime;
                recommendation.similarMovieId = id;

                recommendations.push(recommendation);
                if (count === 15) this.props.closeModal();
              });
          })

          Promise.all(promises)
            .then(() => {
              this.props.createSimilarRecommendations(recommendations);
              this.props.closeModal();
            })
            
        });

      // call receiveGenres
      // receiveGenres

      // instance
      //   .get(`https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&sort_by=popularity.desc&include_adult=false&with_genres=${genre1}%7C${genre2}`)
      //   .then(response => {
      //     let count = 0;
      //     let discovers = [];

      //     const promises = response.data.results.map((discover) => {
      //       let discId = discover.id;
      //     })
      //   })
    };
  }

  render() {
    const {searchResults} = this.state;
    
    let sorted = searchResults.sort((a, b) => (a.release_date < b.release_date) ? 1 : -1);

    let results = !isEmpty(searchResults) ? (
      <ul className="search-results">
        {sorted.map((result, idx) => {
          let year = result.release_date.slice(0,4);
          return (
            <li onClick={this.handleClick(result.id)} key={idx}>
              <span>
                {result.title} ({year})
              </span>
            </li>
          );})}
      </ul> ) : "";


    return(
      <div className='search-container'>
        <input
          type="text"
          placeholder="Search..."
          className='search-input'
          onChange={this.handleInput}
          autoFocus/>
        <div>
          {results}
        </div>
      </div>
    );
  }
}

const mdp = dispatch => ({
  createInterest: data => dispatch(createInterest(data)),
  createSimilarRecommendations: data => dispatch(createSimilarRecommendations(data)),
  fetchSimilarRecommendations: () => dispatch(fetchSimilarRecommendations())
});

export default connect(null, mdp)(Search);