import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import PropTypes from "prop-types";

const ShowList = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShowsData = async () => {
    try {
      const response = await fetch("https://podcast-api.netlify.app");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      if (Array.isArray(data)) {
        setShows(data);
      } else {
        throw new Error("Invalid data format, expected an array of shows");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching shows:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowsData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (shows.length === 0) {
    return <p>No shows available</p>;
  }

  return (
    <div>
      {shows.map((show) => (
        <Link
          key={show.id}
          to={`/shows/${show.id}`} // Link to the show detail page
          className="show-card"
        >
          {/* Show image or a fallback image */}
          {show.image ? (
            <img src={show.image} alt={show.title} className="show-image" />
          ) : (
            <img
              src="default-image.jpg"
              alt="Default"
              className="show-image"
            />
          )}
          <h2>{show.title}</h2>
        </Link>
      ))}
    </div>
  );
};

ShowList.propTypes = {
  shows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string,
    })
  ),
};
export default ShowList;