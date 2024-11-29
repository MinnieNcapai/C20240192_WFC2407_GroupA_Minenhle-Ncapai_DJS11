import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const PodcastDetails = createContext();

const PodcastDetailsProvider = ({ children }) => {
  const [shows, setShows] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get("https://podcast-api.netlify.app");
        setShows(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genrePromises = Array.from({ length: 9 }, (_, i) =>
          axios.get(`https://podcast-api.netlify.app/genre/${i + 1}`)
        );
        const genreResponses = await Promise.all(genrePromises);
        setGenres(genreResponses.map((res) => res.data));
      } catch (err) {
        setError(err);
      }
    };

    fetchGenres();
  }, []);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites array changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (episode) => {
    setFavorites([...favorites, episode]);
  };

  const removeFavorite = (episodeId) => {
    setFavorites(favorites.filter((episode) => episode.id !== episodeId));
  };

  return (
    <PodcastDetails.Provider
      value={{
        shows,
        genres,
        favorites,
        addFavorite,
        removeFavorite,
        loading,
        error,
      }}
    >
      {children}
    </PodcastDetails.Provider>
  );
};

// Prop validation for children
PodcastDetailsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PodcastDetailsProvider;