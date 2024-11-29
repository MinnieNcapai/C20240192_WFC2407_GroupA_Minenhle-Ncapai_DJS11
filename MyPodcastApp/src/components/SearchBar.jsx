// Import React and PropTypes for defining the component and enforcing prop types
import "react"; // Import React for component functionality
import PropTypes from "prop-types"; // Import PropTypes for type-checking props

// Define the SearchBar functional component
const SearchBar = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      {/* Input field for searching shows */}
      <input
        type="text" // Text input field
        placeholder="Search shows..." // Placeholder text for the input
        value={searchTerm} // Bind the input value to the searchTerm prop
        onChange={handleSearchChange} // Call the handleSearchChange function when the input value changes
      />
    </div>
  );
};

// Define PropTypes for the SearchBar component to enforce prop validation
SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired, // The searchTerm prop must be a string and is required
  handleSearchChange: PropTypes.func.isRequired, // The handleSearchChange prop must be a function and is required
};

// Export the SearchBar component as the default export
export default SearchBar;
