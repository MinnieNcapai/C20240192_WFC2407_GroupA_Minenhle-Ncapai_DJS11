// Import React for component functionality
import "react";
// Import Link for navigation within the app
import { Link } from "react-router-dom";
// Import PropTypes for prop validation
import PropTypes from "prop-types";

// Define the ShowCard component
const ShowCard = ({ show, toggleFavorite, favoriteEpisodes }) => {
  return (
    <div className="show-card">
      {/* Link to navigate to the show details page */}
      <Link to={`/shows/${show.id}`}>
        <div>
          {/* Display show image or a default image if not available */}
          {show.image ? (
            <img src={show.image} alt={show.title} className="show-image" />
          ) : (
            <img src="default-image.jpg" alt="Default" className="show-image" />
          )}
        </div>
        <h2>{show.title}</h2> {/* Display the show title */}

        {/* Display the number of seasons or a fallback if none are available */}
        {Array.isArray(show.seasons) && show.seasons.length > 0 ? (
          <p>{show.seasons.length} Season{show.seasons.length > 1 ? 's' : ''}</p>
        ) : (
          <p>No seasons available</p>
        )}
      </Link>

      {/* Loop through the seasons and episodes */}
      {show.seasons.map((season) => (
        <div key={season.season_number}>
          <h3>Season {season.season_number}</h3> {/* Display season number */}
          {season.episodes.map((episode) => {
            // Create a unique key for each episode
            const episodeKey = `${show.id}-S${season.season_number}-E${episode.episode_number}`;
            // Check if the episode is marked as a favorite
            const isFavorite = favoriteEpisodes.includes(episodeKey);

            return (
              <div key={episode.episode_number} className="episode">
                {/* Display episode title and number */}
                <p>{episode.title} (Episode {episode.episode_number})</p>
                {/* Button to toggle favorite status */}
                <button 
                  onClick={() => toggleFavorite(show.id, season.season_number, episode.episode_number)} // Call toggleFavorite when clicked
                  style={{ backgroundColor: isFavorite ? 'gold' : 'lightgray' }} // Style button based on favorite status
                >
                  {isFavorite ? "Unfavorite" : "Favorite"} {/* Display button text based on favorite status */}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Define PropTypes for the ShowCard component
ShowCard.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.string.isRequired, // Show must have a unique string ID
    title: PropTypes.string.isRequired, // Show must have a title
    image: PropTypes.string, // Optional image URL for the show
    seasons: PropTypes.arrayOf( // Array of season objects
      PropTypes.shape({
        season_number: PropTypes.number.isRequired, // Each season must have a number
        episodes: PropTypes.arrayOf( // Array of episodes within each season
          PropTypes.shape({
            episode_number: PropTypes.number.isRequired, // Each episode must have a number
            title: PropTypes.string.isRequired, // Each episode must have a title
          })
        ).isRequired, // Episodes array is required
      })
    ).isRequired, // Seasons array is required
  }).isRequired,
  toggleFavorite: PropTypes.func.isRequired, // Function to toggle favorite status
  favoriteEpisodes: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of favorite episode keys
};

// Export the ShowCard component as the default export
export default ShowCard;
