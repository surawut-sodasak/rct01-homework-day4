import React, { Component } from 'react';

const posterPrefix = "https://image.tmdb.org/t/p/w780/";

class FilmPoster extends Component {
    render() {
        const posterUrl = posterPrefix + this.props.path;
        
        return (
            <img src={posterUrl} alt="" />
        );
    }
}

export default FilmPoster;