import React, { Component } from "react";
import FilmPoster from "./FilmPoster";
import Fave from './Fave';

class FilmRow extends Component {

  render() {
    const releaseDate = new Date(this.props.film.release_date);

    return (
      <div className="film-row" onClick={() =>{this.props.handleDetailsClick(this.props.film)}} >
        <FilmPoster path={this.props.film.poster_path} />

        <div className="film-summary">
          <h1>{this.props.film.title}</h1>
          <p>{releaseDate.getFullYear()}</p>
          <Fave onFaveToggle={ () => this.props.onFaveToggle(this.props.film) } isFave={this.props.isFave} />
        </div>
      </div>
    );
  }
}

export default FilmRow;
