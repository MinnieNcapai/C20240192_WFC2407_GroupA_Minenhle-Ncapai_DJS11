// SearchBar.jsx
import "react";
import PropTypes from "prop-types"; // Import PropTypes

const SearchBar = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search shows..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
};

export default SearchBar;