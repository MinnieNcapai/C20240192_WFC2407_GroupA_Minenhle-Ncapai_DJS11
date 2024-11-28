// ShowCard.jsx
import  "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ShowCard = ({ show }) => {
  return (
    <Link to={`/shows/${show.id}`} className="show-card">
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
  );
};

ShowCard.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    seasons: PropTypes.arrayOf(
      PropTypes.shape({
        // 
      })
    ), 
  }).isRequired,
};

export default ShowCard;