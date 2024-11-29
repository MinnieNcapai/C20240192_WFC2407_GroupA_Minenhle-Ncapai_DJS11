// ShowDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SeasonList from "./SeasonList";

const ShowDetail = () => {
  const { id } = useParams();
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://podcast-api.netlify.app/id/${id}`
        );

        let seasons = response.data.seasons;
        if (!seasons) {
          const seasonsResponse = await axios.get(
            `https://podcast-api.netlify.app/shows/${id}/seasons`
          );
          seasons = seasonsResponse.data;
        }

        const seasonsWithIds = seasons.map((season, seasonIndex) => ({
          ...season,
          id: season.id || seasonIndex,
          episodes: season.episodes.map((episode, episodeIndex) => ({
            ...episode,
            id: episode.id || episodeIndex,
            isFavorite: false,
          })),
        }));

        setShowDetails({ ...response.data, seasons: seasonsWithIds });
      } catch (err) {
        console.error(err);
        setError("Failed to load show details.");
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [id]);

  const handleFavoriteToggle = (episodeId) => {
    setShowDetails((prevShowDetails) => {
      let episodeFound = false;

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

        const storedFavorites = localStorage.getItem("favorites");
        const existingFavorites = storedFavorites
          ? JSON.parse(storedFavorites)
          : [];

        const episodeIndex = existingFavorites.findIndex(
          (fav) => fav.episode.id === episodeId
        );

        if (episodeIndex === -1) {
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
          existingFavorites.splice(episodeIndex, 1);
        }

        localStorage.setItem("favorites", JSON.stringify(existingFavorites));

        return updatedShow;
      } else {
        return prevShowDetails;
      }
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!showDetails) {
    return (
      <div className="no-show">
        <p>Show not found. Please check the URL or try again later.</p>
      </div>
    );
  }

  return (
    <div className="show-details-container">
      {/* Back button */}
      <button onClick={() => navigate(-1)}>Back</button>

      <div className="show-header">
        <img
          src={showDetails.image}
          alt={showDetails.title}
          className="show-image"
        />
        <h2 className="show-title">{showDetails.title}</h2>
      </div>
      <p className="show-description">{showDetails.description}</p>
      {/* The line below was trying to access show.updated, 
          but it should be showDetails.updated */}
      <p>Last Updated: {new Date(showDetails.updated).toLocaleDateString()}</p>

      {showDetails.seasons && (
        <div className="show-card">
          <SeasonList
            seasons={showDetails.seasons}
      
            onFavoriteToggle={handleFavoriteToggle}
          />
        </div>
      )}

      <Link to="/favorites">
        <button>Go to Favorites</button>
      </Link>
    </div>
  );
};

export default ShowDetail;