// GenreFilter.jsx
import  "react";
import PropTypes from "prop-types";

const GenreFilter = ({ genres, selectedGenre, handleGenreChange }) => {
  return (
    <select value={selectedGenre} onChange={handleGenreChange}>
      <option value="">All Genres</option>
      {genres.map((genre) => (
        <option key={genre.id} value={genre.id}> 1  {/* Use genre.id for value */}
          {genre.title} {/* Display genre.title */}
        </option>
      ))}
    </select>
  );
};

GenreFilter.propTypes = {
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedGenre: PropTypes.string.isRequired, // Or PropTypes.number if you're using genre ID
  handleGenreChange: PropTypes.func.isRequired,
};

export default GenreFilter;