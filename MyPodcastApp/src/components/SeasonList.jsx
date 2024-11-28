// In SeasonList.jsx
import  "react";
import PropTypes from "prop-types";
import EpisodePlayer from "./EpisodePlayer";

const SeasonList = ({ seasons }) => {
  if (!seasons) { 
    return <div>Loading seasons...</div>; 
  }

  return (
    <div>
      {seasons.map((season) => (
        <div key={season.id}>
          <h3>{season.title}</h3>

          {/* Check if season.episodes is defined before mapping */}
          {season.episodes && ( 
            <EpisodePlayer episodes={season.episodes} />
          )}
        </div>
      ))}
    </div>
  );
};

// Prop validation
SeasonList.propTypes = {
  seasons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      episodes: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          title: PropTypes.string.isRequired,
          file: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
};

export default SeasonList;