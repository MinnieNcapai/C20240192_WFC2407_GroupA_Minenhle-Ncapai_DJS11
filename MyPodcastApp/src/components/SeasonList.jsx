// SeasonList.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import EpisodePlayer from "./EpisodePlayer";

const SeasonList = ({ seasons, onFavoriteToggle }) => {
  const [selectedSeasonId, setSelectedSeasonId] = useState(null);

  const handleSeasonClick = (seasonId) => {
    setSelectedSeasonId(selectedSeasonId === seasonId ? null : seasonId);
  };

  return (
    <div>
      {seasons.map((season) => (
        <div key={season.id}>
          <h3
            onClick={() => handleSeasonClick(season.id)}
            style={{
              cursor: "pointer",
              fontWeight: selectedSeasonId === season.id ? "bold" : "normal",
            }}
          >
            {season.title}
          </h3>
          {/* Conditionally render episodes only for the selected season */}
          {selectedSeasonId === season.id && season.episodes && (
            <div>
              {/* Pass onFavoriteToggle to EpisodePlayer */}
              <EpisodePlayer 
                episodes={season.episodes} 
                onFavoriteToggle={onFavoriteToggle} 
              /> 
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

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
        })
      ).isRequired,
    })
  ).isRequired,
  onFavoriteToggle: PropTypes.func.isRequired, // Add propType for onFavoriteToggle
};

export default SeasonList;