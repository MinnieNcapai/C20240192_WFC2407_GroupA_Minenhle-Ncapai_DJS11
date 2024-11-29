// Import necessary modules from React and PropTypes
import "react"; // Import React library for JSX support
import PropTypes from "prop-types"; // Import PropTypes for type-checking

// Define the EpisodePlayer functional component
const EpisodePlayer = ({ episodes, onFavoriteToggle }) => {
  // Check if the episodes data is not available, and display a loading message if so
  if (!episodes) {
    return <div>Loading episodes...</div>; // Fallback UI for when episodes are undefined or null
  }

  // Render the list of episodes
  return (
    <div>
      {episodes.map((episode) => ( // Loop through the episodes array and render each episode
        <div key={episode.id}> {/* Unique key required for list items in React */}
          <h4>{episode.title}</h4> {/* Display the title of the episode */}
          <audio controls> {/* Audio player for the episode */}
            <source src={episode.file} type="audio/mpeg" /> {/* Source of the audio file */}
            Your browser does not support the audio element. {/* Fallback message for unsupported browsers */}
          </audio>
          <button onClick={() => onFavoriteToggle(episode.id)}> {/* Button to toggle favorite status */}
            {episode.isFavorite ? "Remove from Favorites" : "Add to Favorites"} {/* Dynamic button text based on favorite status */}
          </button>
        </div>
      ))}
    </div>
  );
};

// Define PropTypes for the EpisodePlayer component to enforce type-checking
EpisodePlayer.propTypes = {
  episodes: PropTypes.arrayOf( // Expect an array of episode objects
    PropTypes.shape({
      id: PropTypes.number.isRequired, // Each episode must have a numeric ID
      title: PropTypes.string.isRequired, // Each episode must have a title
      file: PropTypes.string.isRequired, // Each episode must have a file URL
      isFavorite: PropTypes.bool, // Each episode can optionally have a favorite status
    })
  ).isRequired, // The episodes prop is required
  onFavoriteToggle: PropTypes.func.isRequired, // The onFavoriteToggle prop must be a function and is required
};

// Export the EpisodePlayer component as the default export
export default EpisodePlayer;
