import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for validation

const ShowList = () => {
  const [shows, setShows] = useState([]); // Use state to store shows data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the shows preview data
  const fetchShowsData = async () => {
    let response;

    try {
      // Fetch data from the preview API
      response = await fetch('https://podcast-api.netlify.app');
      
      // Check if the response is successful (status code 200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check if the response is in JSON format
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        // Parse the JSON response only if it's a valid JSON
        const data = await response.json();
        
        // Log the response data for debugging purposes
        console.log('Fetched data:', data);

        // Validate the data format (ensure it's an array)
        if (Array.isArray(data)) {
          setShows(data); // Set the shows state with fetched data
        } else {
          throw new Error('Invalid data format, expected an array of shows');
        }
      } else {
        throw new Error('Response is not in JSON format');
      }
    } catch (error) {
      // Handle error by setting error state
      setError(error.message);
      console.error('Error fetching shows:', error);

      // If response is not in JSON, try to fetch the body as text (HTML, etc.)
      if (response) {
        const responseText = await response.text();
        console.error('Response Text:', responseText);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch the shows data when the component is mounted
  useEffect(() => {
    fetchShowsData();
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // If shows data is empty or not available, show a message
  if (shows.length === 0) {
    return <p>No shows available</p>;
  }

  return (
    <div>
      {shows.map((show) => (
        <div key={show.id} className="show-card">
          {show.image ? (
            <img src={show.image} alt={show.title} className="show-image" />
          ) : (
            <img
              src="default-image.jpg" // Fallback image if no image is provided
              alt="Default"
              className="show-image"
            />
          )}
          <h2>{show.title}</h2>
          <p>{show.description}</p>
          <p>Seasons: {show.seasons}</p>
        </div>
      ))}
    </div>
  );
};

// PropTypes validation for the `shows` prop
ShowList.propTypes = {
  shows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string,
      seasons: PropTypes.number.isRequired,
    })
  ),
};

export default ShowList;
