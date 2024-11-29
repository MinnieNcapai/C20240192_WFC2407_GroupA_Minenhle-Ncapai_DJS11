// Import necessary hooks and components
import { useEffect, useState } from "react"; // React hooks for state and lifecycle management
import { useParams, Link, useNavigate } from "react-router-dom"; // Routing utilities
import axios from "axios"; // For API requests
import SeasonList from "./SeasonList"; // Component for displaying seasons
import "../index.css"; // Import CSS styles

// ShowDetail component displays detailed information about a specific show
const ShowDetail = () => {
  const { id } = useParams(); // Extract the show ID from the route
  const [showDetails, setShowDetails] = useState(null); // State to store show details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Fetch show details and seasons on component mount or when the ID changes
  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true); // Indicate loading state
        const response = await axios.get(
          `https://podcast-api.netlify.app/id/${id}`
        ); // Fetch show details

        let seasons = response.data.seasons; // Get seasons from response

        // If seasons are not available in the initial response, fetch them separately
        if (!seasons) {
          const seasonsResponse = await axios.get(
            `https://podcast-api.netlify.app/shows/${id}/seasons`
          );
          seasons = seasonsResponse.data;
        }

        // Add unique IDs and `isFavorite` properties to episodes
        const seasonsWithIds = seasons.map((season, seasonIndex) => ({
          ...season,
          id: season.id || seasonIndex,
          episodes: season.episodes.map((episode, episodeIndex) => ({
            ...episode,
            id: episode.id || episodeIndex,
            isFavorite: false, // Initialize all episodes as not favorited
          })),
        }));

        setShowDetails({ ...response.data, seasons: seasonsWithIds }); // Update show details
      } catch (err) {
        console.error(err);
        setError("Failed to load show details."); // Handle errors
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchShowDetails();
  }, [id]); // Dependency array ensures the effect runs when the ID changes

  // Toggle the favorite status of an episode
  const handleFavoriteToggle = (episodeId) => {
    setShowDetails((prevShowDetails) => {
      let episodeFound = false;

      // Update the favorite status of the selected episode
      const updatedSeasons = prevShowDetails.seasons.map((season) => ({
        ...season,
        episodes: season.episodes.map((episode) => {
          if (episode.id === episodeId) {
            episodeFound = true;
            return { ...episode, isFavorite: !episode.isFavorite };
          }
          return episode;
        }),
      }));

      if (episodeFound) {
        const updatedShow = { ...prevShowDetails, seasons: updatedSeasons };

        // Manage favorites in localStorage
        const storedFavorites = localStorage.getItem("favorites");
        const existingFavorites = storedFavorites
          ? JSON.parse(storedFavorites)
          : [];

        // Check if the episode is already in favorites
        const episodeIndex = existingFavorites.findIndex(
          (fav) => fav.episode.id === episodeId
        );

        if (episodeIndex === -1) {
          // Add the episode to favorites
          existingFavorites.push({
            show: {
              title: updatedShow.title,
              image: updatedShow.image,
            },
            season: updatedSeasons.find((season) =>
              season.episodes.some((episode) => episode.id === episodeId)
            ).title,
            episode: updatedSeasons
              .flatMap((season) => season.episodes)
              .find((episode) => episode.id === episodeId),
          });
        } else {
          // Remove the episode from favorites
          existingFavorites.splice(episodeIndex, 1);
        }

        // Save updated favorites to localStorage
        localStorage.setItem("favorites", JSON.stringify(existingFavorites));

        return updatedShow; // Update show details
      } else {
        return prevShowDetails; // Return unchanged state if no episode matches
      }
    });
  };

  // Display loading message while fetching data
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Display error message if fetching fails
  if (error) {
    return <div className="error">{error}</div>;
  }

  // Display a fallback message if show details are unavailable
  if (!showDetails) {
    return (
      <div className="no-show">
        <p>Show not found. Please check the URL or try again later.</p>
      </div>
    );
  }

  // Render the show details page
  return (
    <div className="show-details-container">
      {/* Back button to navigate to the previous page */}
      <button onClick={() => navigate(-1)}>Back</button>

      <div className="show-card">
        <div className="show-header">
          {/* Display show image and title */}
          <img
            src={showDetails.image}
            alt={showDetails.title}
            className="show-image"
          />
          <h2 className="show-title">{showDetails.title}</h2>
        </div>
        {/* Display show description and last updated date */}
        <p className="show-description">{showDetails.description}</p>
        <p>Last Updated: {new Date(showDetails.updated).toLocaleDateString()}</p>

        {/* Display season list and pass the favorite toggle handler */}
        {showDetails.seasons && (
          <SeasonList
            seasons={showDetails.seasons}
            onFavoriteToggle={handleFavoriteToggle}
          />
        )}
      </div>

      {/* Link to navigate to the favorites page */}
      <Link to="/favorites">
        <button>Go to Favorites</button>
      </Link>
    </div>
  );
};

export default ShowDetail; // Export the component as default
