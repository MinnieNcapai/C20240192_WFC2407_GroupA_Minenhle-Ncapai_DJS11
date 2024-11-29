// Favorites.jsx
import { useState, useEffect } from "react";
import "../index.css";
import EpisodePlayer from "./EpisodePlayer";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDropdown, setShowDropdown] = useState(false);
  const [playingEpisode, setPlayingEpisode] = useState(null);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const sortedFavorites = [...favorites].sort((a, b) => {
    const titleA = a.episode.title.toLowerCase();
    const titleB = b.episode.title.toLowerCase();
    if (sortOrder === "asc") {
      return titleA.localeCompare(titleB);
    } else {
      return titleB.localeCompare(titleA);
    }
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
    // If the removed episode was playing, stop playback
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
            <button onClick={() => handleSortChange("asc")}>Sort A-Z</button>
            <button onClick={() => handleSortChange("desc")}>Sort Z-A</button>
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