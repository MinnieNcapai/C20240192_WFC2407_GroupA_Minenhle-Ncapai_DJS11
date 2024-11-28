// GenreFilter.jsx
import "react";
import PropTypes from "prop-types";

const GenreFilter = ({ genres, selectedGenre, handleGenreChange }) => {
  return (
    <select value={selectedGenre} onChange={handleGenreChange}>
      <option value="">All Genres</option>
      {genres.map((genre) => (
        <option key={genre} value={genre}>
          {genre}
        </option>
      ))}
    </select>
  );
};

GenreFilter.propTypes = {
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedGenre: PropTypes.string.isRequired,
  handleGenreChange: PropTypes.func.isRequired,
};

export default GenreFilter;