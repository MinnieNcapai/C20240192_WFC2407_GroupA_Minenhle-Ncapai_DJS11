// EpisodePlayer.jsx
import  "react";
import PropTypes from "prop-types";

const EpisodePlayer = ({ episodes, onFavoriteToggle }) => {
  if (!episodes) {
    return <div>Loading episodes...</div>;
  }

  return (
    <div>
      {episodes.map((episode) => (
        <div key={episode.id}>
          <h4>{episode.title}</h4>
          <audio controls>
            <source src={episode.file} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <button onClick={() => onFavoriteToggle(episode.id)}>
            {episode.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
      ))}
    </div>
  );
};

EpisodePlayer.propTypes = {
  episodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      file: PropTypes.string.isRequired,
      isFavorite: PropTypes.bool, 
    })
  ).isRequired,
  onFavoriteToggle: PropTypes.func.isRequired, 
};

export default EpisodePlayer;