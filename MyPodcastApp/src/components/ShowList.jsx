// ShowList.jsx
import  { useEffect, useState } from "react";
import ShowCard from "./ShowCard"; // Import the ShowCard component
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
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (shows.length === 0) {
    return <p className="no-show">No shows available</p>;
  }

  return (
    <div className="show-list"> 
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} /> 
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

