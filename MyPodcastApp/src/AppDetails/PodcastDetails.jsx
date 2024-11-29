import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// Create a context to manage podcast details globally
export const PodcastDetails = createContext();

// PodcastDetailsProvider component to fetch and provide podcast data
const PodcastDetailsProvider = ({ children }) => {
  // State variables to store shows, favorites, genres, and loading/error states
  const [shows, setShows] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to fetch shows from the API when the component mounts
  useEffect(() => {
    const fetchShows = async () => {
      try {
        // Fetch data from the podcast API
        const response = await axios.get("https://podcast-api.netlify.app");
        setShows(response.data); // Set the shows in the state
      } catch (err) {
        setError(err); // Capture and set error if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetch completion
      }
    };

    fetchShows(); // Call the function to fetch shows
  }, []); // Empty dependency array ensures this effect runs once on mount

  // Effect to fetch genres from the API when the component mounts
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // Create an array of promises to fetch all genres (1 to 9)
        const genrePromises = Array.from({ length: 9 }, (_, i) =>
          axios.get(`https://podcast-api.netlify.app/genre/${i + 1}`)
        );
        // Wait for all genre data to be fetched and set it in the state
        const genreResponses = await Promise.all(genrePromises);
        setGenres(genreResponses.map((res) => res.data)); // Extract genre data
      } catch (err) {
        setError(err); // Capture and set error if fetching fails
      }
    };

    fetchGenres(); // Call the function to fetch genres
  }, []); // Empty dependency array ensures this effect runs once on mount

  // Effect to load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      // Parse and set the stored favorites if they exist
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []); // Empty dependency array ensures this effect runs once on mount

  // Effect to save favorites to localStorage whenever favorites change
  useEffect(() => {
    // Save favorites as a JSON string in localStorage
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]); // This effect runs when the favorites state changes

  // Function to add an episode to the favorites
  const addFavorite = (episode) => {
    setFavorites([...favorites, episode]); // Add episode to the favorites array
  };

  // Function to remove an episode from the favorites
  const removeFavorite = (episodeId) => {
    setFavorites(favorites.filter((episode) => episode.id !== episodeId)); // Filter out the episode with the specified id
  };

  return (
    // Provide the context value to children components
    <PodcastDetails.Provider
      value={{
        shows,          // Provided shows data
        genres,         // Provided genres data
        favorites,      // Provided favorites data
        addFavorite,    // Provided function to add a favorite
        removeFavorite, // Provided function to remove a favorite
        loading,        // Provided loading state
        error,          // Provided error state
      }}
    >
      {children} {/* Render the children components that consume the context */}
    </PodcastDetails.Provider>
  );
};

// Prop validation for children (ensures children is required and a valid React node)
PodcastDetailsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PodcastDetailsProvider;
