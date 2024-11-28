import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SeasonList from "./SeasonList";

const ShowDetail = () => {
  const { id } = useParams();
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleFavoriteToggle = (episodeId) => {
    setShowDetails((prevShowDetails) => {
      const updatedSeasons = prevShowDetails.seasons.map((season) => ({
        ...season,
        episodes: season.episodes.map((episode) =>
          episode.id === episodeId ? { ...episode, isFavorite: !episode.isFavorite } : episode
        ),
      }));
      return { ...prevShowDetails, seasons: updatedSeasons };
    });
  };

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://podcast-api.netlify.app/id/${id}`);

        let seasons = response.data.seasons;
        if (!seasons) {
          const seasonsResponse = await axios.get(`https://podcast-api.netlify.app/shows/${id}/seasons`);
          seasons = seasonsResponse.data;
        }

        // Ensure each season and episode has an ID
        const seasonsWithIds = seasons.map((season, seasonIndex) => ({
          ...season,
          id: season.id || seasonIndex,
          episodes: season.episodes.map((episode, episodeIndex) => ({
            ...episode,
            id: episode.id || episodeIndex,
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
      <div className="show-header">
        <img
          src={showDetails.image}
          alt={showDetails.title}
          className="show-image"
        />
        <h2 className="show-title">{showDetails.title}</h2>
      </div>
      <p className="show-description">{showDetails.description}</p>

      {/* Conditionally render SeasonList if seasons exist */}
      {showDetails.seasons && (
        <SeasonList seasons={showDetails.seasons} onFavoriteToggle={handleFavoriteToggle} /> 
      )}
    </div>
  );
};


export default ShowDetail;