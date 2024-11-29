// ShowCard.jsx
import "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ShowCard = ({ show, toggleFavorite, favoriteEpisodes }) => {
  return (
    <div className="show-card">
      <Link to={`/shows/${show.id}`}>
        <div>
          {show.image ? (
            <img src={show.image} alt={show.title} className="show-image" />
          ) : (
            <img src="default-image.jpg" alt="Default" className="show-image" />
          )}
        </div>
        <h2>{show.title}</h2>

        {/* Display the number of seasons if available */}
        {Array.isArray(show.seasons) && show.seasons.length > 0 ? (
          <p>{show.seasons.length} Season{show.seasons.length > 1 ? 's' : ''}</p>
        ) : (
          <p>No seasons available</p>
        )}
      </Link>

      {/* Display episodes and allow marking as favorite */}
      {show.seasons.map((season) => (
        <div key={season.season_number}>
          <h3>Season {season.season_number}</h3>
          {season.episodes.map((episode) => {
            const episodeKey = `${show.id}-S${season.season_number}-E${episode.episode_number}`;
            const isFavorite = favoriteEpisodes.includes(episodeKey);

            return (
              <div key={episode.episode_number} className="episode">
                <p>{episode.title} (Episode {episode.episode_number})</p>
                <button 
                  onClick={() => toggleFavorite(show.id, season.season_number, episode.episode_number)}
                  style={{ backgroundColor: isFavorite ? 'gold' : 'lightgray' }} // Change button color based on favorite status
                >
                  {isFavorite ? "Unfavorite" : "Favorite"}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

ShowCard.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    seasons: PropTypes.arrayOf(
      PropTypes.shape({
        season_number: PropTypes.number.isRequired,
        episodes: PropTypes.arrayOf(
          PropTypes.shape({
            episode_number: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
  toggleFavorite: PropTypes.func.isRequired, // Function to toggle favorite
  favoriteEpisodes: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of favorite episode keys
};

export default ShowCard;