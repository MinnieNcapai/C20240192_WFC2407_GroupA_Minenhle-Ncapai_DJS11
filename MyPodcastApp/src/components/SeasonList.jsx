// Import useState for managing state and PropTypes for type-checking props
import { useState } from "react"; // useState to handle the selected season
import PropTypes from "prop-types"; // Import PropTypes for validating prop types
import EpisodePlayer from "./EpisodePlayer"; // Import the EpisodePlayer component

// Define the SeasonList functional component
const SeasonList = ({ seasons, onFavoriteToggle }) => {
  // State to track the currently selected season ID
  const [selectedSeasonId, setSelectedSeasonId] = useState(null);

  // Handle the click event for selecting/deselecting a season
  const handleSeasonClick = (seasonId) => {
    // Toggle selection: if the season is already selected, deselect it
    setSelectedSeasonId(selectedSeasonId === seasonId ? null : seasonId);
  };

  return (
    <div>
      {/* Loop through the seasons and render each one */}
      {seasons.map((season) => (
        <div key={season.id}> {/* Use season.id as a unique key */}
          <h3
            onClick={() => handleSeasonClick(season.id)} // Set the selected season on click
            style={{
              cursor: "pointer", // Change cursor to pointer to indicate clickable text
              fontWeight: selectedSeasonId === season.id ? "bold" : "normal", // Highlight the selected season
            }}
          >
            {season.title} {/* Display the title of the season */}
          </h3>
          {/* Conditionally render episodes for the selected season */}
          {selectedSeasonId === season.id && season.episodes && (
            <div>
              {/* Render the EpisodePlayer for the selected season's episodes */}
              <EpisodePlayer 
                episodes={season.episodes} // Pass the episodes array to EpisodePlayer
                onFavoriteToggle={onFavoriteToggle} // Pass the onFavoriteToggle function to EpisodePlayer
              /> 
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Define PropTypes for SeasonList to enforce prop validation
SeasonList.propTypes = {
  seasons: PropTypes.arrayOf( // seasons prop should be an array of season objects
    PropTypes.shape({
      id: PropTypes.number.isRequired, // Each season object must have a numeric ID
      title: PropTypes.string.isRequired, // Each season object must have a title
      episodes: PropTypes.arrayOf( // Each season object must have an array of episodes
        PropTypes.shape({
          id: PropTypes.number.isRequired, // Each episode must have a numeric ID
          title: PropTypes.string.isRequired, // Each episode must have a title
          file: PropTypes.string.isRequired, // Each episode must have a file URL
        })
      ).isRequired, // The episodes array is required
    })
  ).isRequired, // The seasons prop is required
  onFavoriteToggle: PropTypes.func.isRequired, // The onFavoriteToggle prop must be a function and is required
};

// Export the SeasonList component as the default export
export default SeasonList;
