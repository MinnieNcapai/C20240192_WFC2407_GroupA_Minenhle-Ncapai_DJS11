// Import React and PropTypes for defining the component and enforcing prop types
import "react"; // Import React for component functionality
import PropTypes from "prop-types"; // Import PropTypes for type-checking props

// Define the GenreFilter functional component
const GenreFilter = ({ genres, selectedGenre, handleGenreChange }) => {
  return (
    // Render a dropdown (select) for genre filtering
    <select value={selectedGenre} onChange={handleGenreChange}>
      <option value="">All Genres</option> {/* Default option for all genres */}
      {genres.map((genre) => (
        <option key={genre.id} value={genre.id}> {/* Use genre.id as the option value */}
          {genre.title} {/* Display the genre title as the option text */}
        </option>
      ))}
    </select>
  );
};

// Define PropTypes for the GenreFilter component to enforce prop validation
GenreFilter.propTypes = {
  genres: PropTypes.arrayOf( // genres prop should be an array of objects
    PropTypes.shape({
      id: PropTypes.number.isRequired, // Each genre object must have a numeric id
      title: PropTypes.string.isRequired, // Each genre object must have a string title
    })
  ).isRequired, // The genres prop is required
  selectedGenre: PropTypes.string.isRequired, // The selectedGenre prop must be a string and is required
  handleGenreChange: PropTypes.func.isRequired, // handleGenreChange must be a function and is required
};

// Export the GenreFilter component as the default export
export default GenreFilter;
