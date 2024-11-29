// Favorites.jsx
import { useState, useEffect } from "react";
import "../index.css";
import EpisodePlayer from "./EpisodePlayer";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [playingEpisode, setPlayingEpisode] = useState(null);
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortBy === "title") {
      const titleA = a.episode.title.toLowerCase();
      const titleB = b.episode.title.toLowerCase();
      return titleA.localeCompare(titleB);
    } else if (sortBy === "dateAdded") {
      return new Date(a.favoritedAt) - new Date(b.favoritedAt);
    } else if (sortBy === "showUpdatedLatest") {
      return new Date(b.show.updated) - new Date(a.show.updated);
    } else if (sortBy === "showUpdatedOldest") {
      return new Date(a.show.updated) - new Date(b.show.updated);
    }
    return 0;
  });

  const handlePlay = (episode) => {
    setPlayingEpisode(episode);
  };

  const handleRemoveFavorite = (episodeId) => {
    const updatedFavorites = favorites.filter(
      (favorite) => favorite.episode.id !== episodeId
    );
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    if (playingEpisode && playingEpisode.id === episodeId) {
      setPlayingEpisode(null);
    }
  };

  return (
    <div className="favorites-container">
      <h2>Favorites</h2>

      <button onClick={toggleDropdown}>
        {showDropdown ? "Hide Favorites" : "Show Favorites"}
      </button>

      {showDropdown && (
        <div className="favorites-dropdown">
          <div>
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" value={sortBy} onChange={handleSortChange}>
              <option value="title">Title (A-Z)</option>
              <option value="dateAdded">Date Added</option>
              <option value="showUpdatedLatest">Show Updated (Latest First)</option>
              <option value="showUpdatedOldest">Show Updated (Oldest First)</option>
            </select>
          </div>

          <div className="favorites-grid">
            {sortedFavorites.map((favorite) => (
              <div key={favorite.episode.id} className="favorite-card">
                <img
                  src={favorite.show.image}
                  alt={favorite.episode.title}
                  className="favorite-image"
                />
                <div className="favorite-details">
                  <h3>{favorite.show.title}</h3>
                  <h4>{favorite.season}</h4>
                  <h5>{favorite.episode.title}</h5>
                  <p>{favorite.episode.description}</p>
                  <p>
                    Added to Favorites:{" "}
                    {new Date(favorite.favoritedAt).toLocaleString()}
                  </p>
                  <button onClick={() => handlePlay(favorite.episode)}>
                    Play Episode
                  </button>
                  <button
                    onClick={() => handleRemoveFavorite(favorite.episode.id)}
                  >
                    Remove from Favorites
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {playingEpisode && (
        <EpisodePlayer
          episode={playingEpisode}
          onClose={() => setPlayingEpisode(null)}
        />
      )}
    </div>
  );
}

export default Favorites;
