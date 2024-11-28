import  "react";
import PropTypes from "prop-types";

const EpisodePlayer = ({ episodes }) => {
  if (!episodes) { 
    return <div>Loading episodes...</div>
  }

  return (
    <div>
      {/* Assuming 'episodes' is an array, add a key prop */}
      {episodes.map((episode, index) => ( 
        <div key={episode.id || index}> 
          <h4>{episode.title}</h4>
          <audio controls>
            <source src={episode.file} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
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
      episodes: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          title: PropTypes.string.isRequired,
          file: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default EpisodePlayer;
