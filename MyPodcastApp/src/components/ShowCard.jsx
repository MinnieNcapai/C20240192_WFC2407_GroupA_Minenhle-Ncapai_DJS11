// ShowCard.jsx
import "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ShowCard = ({ show }) => {
  return (
    <Link to={`/shows/${show.id}`} className="show-card">
      <div> {/* Wrap image in a div for better styling control */}
        {show.image ? (
          <img src={show.image} alt={show.title} className="show-image" />
        ) : (
          <img src="default-image.jpg" alt="Default" className="show-image" />
        )}
      </div>
      <h2>{show.title}</h2>
    </Link>
  );
};

ShowCard.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
};

export default ShowCard;