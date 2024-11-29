// Import React hooks and other dependencies
import { useState, useEffect } from "react"; // useState and useEffect for state management and side effects
import "../index.css"; // Import CSS for styling
import EpisodePlayer from "./EpisodePlayer"; // Import EpisodePlayer component

// Define the Favorites component
function Favorites() {
  // State to store the list of favorite episodes
  const [favorites, setFavorites] = useState([]);
  // State to control the visibility of the dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  // State to track the currently playing episode
  const [playingEpisode, setPlayingEpisode] = useState(null);
  // State to manage sorting criteria
  const [sortBy, setSortBy] = useState("title");

  // Load favorites from localStorage when the component mounts
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Toggle the visibility of the dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Update the sorting criteria based on user selection
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Sort the favorites array based on the selected criteria
  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortBy === "title") {
      // Sort by episode title alphabetically
      const titleA = a.episode.title.toLowerCase();
      const titleB = b.episode.title.toLowerCase();
      return titleA.localeCompare(titleB);
    } else if (sortBy === "dateAdded") {
      // Sort by the date the episode was added to favorites
      return new Date(a.favoritedAt) - new Date(b.favoritedAt);
    } else if (sortBy === "showUpdatedLatest") {
      // Sort by the latest show update
      return new Date(b.show.updated) - new Date(a.show.updated);
    } else if (sortBy === "showUpdatedOldest") {
      // Sort by the oldest show update
      return new Date(a.show.updated) - new Date(b.show.updated);
    }
    return 0; // Default case
  });

  // Handle playing an episode
  const handlePlay = (episode) => {
    setPlayingEpisode(episode);
  };

  // Remove an episode from favorites
  const handleRemoveFavorite = (episodeId) => {
    const updatedFavorites = favorites.filter(
      (favorite) => favorite.episode.id !== episodeId
    );
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    // Stop playing the episode if it's the one being removed
    if (playingEpisode && playingEpisode.id === episodeId) {
      setPlayingEpisode(null);
    }
  };

  return (
    <div className="favorites-container">
      <h2>Favorites</h2> {/* Page heading */}

      {/* Button to toggle the dropdown */}
      <button onClick={toggleDropdown}>
        {showDropdown ? "Hide Favorites" : "Show Favorites"}
      </button>

      {/* Render dropdown if visible */}
      {showDropdown && (
        <div className="favorites-dropdown">
          <div>
            {/* Dropdown for sorting options */}
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" value={sortBy} onChange={handleSortChange}>
              <option value="title">Title (A-Z)</option>
              <option value="dateAdded">Date Added</option>
              <option value="showUpdatedLatest">Show Updated (Latest First)</option>
              <option value="showUpdatedOldest">Show Updated (Oldest First)</option>
            </select>
          </div>

          {/* Display sorted favorite episodes */}
          <div className="favorites-grid">
            {sortedFavorites.map((favorite) => (
              <div key={favorite.episode.id} className="favorite-card">
                {/* Show image for the episode */}
                <img
                  src={favorite.show.image}
                  alt={favorite.episode.title}
                  className="favorite-image"
                />
                {/* Details about the favorite episode */}
                <div className="favorite-details">
                  <h3>{favorite.show.title}</h3>
                  <h4>{favorite.season}</h4>
                  <h5>{favorite.episode.title}</h5>
                  <p>{favorite.episode.description}</p>
                  <p>
                    Added to Favorites:{" "}
                    {new Date(favorite.favoritedAt).toLocaleString()}
                  </p>
                  {/* Button to play the episode */}
                  <button onClick={() => handlePlay(favorite.episode)}>
                    Play Episode
                  </button>
                  {/* Button to remove the episode from favorites */}
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

      {/* Show the EpisodePlayer if an episode is playing */}
      {playingEpisode && (
        <EpisodePlayer
          episode={playingEpisode}
          onClose={() => setPlayingEpisode(null)}
        />
      )}
    </div>
  );
}

// Export the Favorites component
export default Favorites;
