// Import necessary hooks, components, and libraries
import { useEffect, useState } from "react"; // React hooks for managing state and side effects
import ShowCard from "./ShowCard"; // Component to display individual show details
import SearchBar from "./SearchBar"; // Search input component for filtering shows
import GenreFilter from "./GenreFilter"; // Filter component for selecting genres
import PropTypes from "prop-types"; // For type-checking props

const ShowList = () => {
  // State management hooks
  const [shows, setShows] = useState([]); // List of shows
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering shows
  const [selectedGenre, setSelectedGenre] = useState(""); // Selected genre for filtering
  const [genres, setGenres] = useState([]); // List of available genres
  const [favoriteEpisodes, setFavoriteEpisodes] = useState([]); // List of favorite episodes
  const [sortOption, setSortOption] = useState("default"); // Sorting option (default or by various criteria)

  // Fetch data for shows, seasons, and genres
  const fetchShowsData = async () => {
    try {
      const response = await fetch("https://podcast-api.netlify.app"); // Fetch all shows
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`); // Handle errors from API
      }
      const data = await response.json(); // Parse response data

      // Fetch season data for each show asynchronously
      const showsWithSeasons = await Promise.all(data.map(async (show) => {
        try {
          const seasonsResponse = await fetch(`https://podcast-api.netlify.app/shows/${show.id}/seasons`);
          if (!seasonsResponse.ok) {
            throw new Error(`Error fetching seasons for show ${show.id}`);
          }
          const seasonsData = await seasonsResponse.json();
          return { ...show, seasons: seasonsData };
        } catch (error) {
          console.error(`Error fetching seasons for show ${show.id}:`, error);
          return { ...show, seasons: [] }; // Return the show with empty seasons if error occurs
        }
      }));

      // Add description to each show if it's missing and sort by title
      const showsWithDescriptions = showsWithSeasons.map((show) => ({
        ...show,
        description: show.description || "", // Fallback to empty string if no description
      }));

      showsWithDescriptions.sort((a, b) => a.title.localeCompare(b.title)); // Sort shows alphabetically by title
      setShows(showsWithDescriptions); // Update state with sorted shows

      // Extract and fetch genre information
      const allGenreIds = new Set();
      showsWithDescriptions.forEach((show) => {
        if (show.genres) {
          show.genres.forEach((genre) => {
            const genreId = typeof genre === "object" ? genre.id : genre;
            allGenreIds.add(genreId); // Collect unique genre IDs
          });
        }
      });

      const uniqueGenreIds = Array.from(allGenreIds);
      const genrePromises = uniqueGenreIds.map((id) =>
        fetch(`https://podcast-api.netlify.app/genre/${id}`)
          .then(res => res.json())
          .catch(error => {
            console.error("Error fetching genre:", error);
            return null; // Return null if genre fetch fails
          })
      );

      const fetchedGenres = await Promise.all(genrePromises);
      setGenres(fetchedGenres.filter((genre) => genre !== null)); // Filter out null values and update genres
    } catch (error) {
      setError(error.message); // Handle general errors
      console.error("Error fetching shows:", error);
    } finally {
      setLoading(false); // Set loading to false when data is fetched or if error occurs
    }
  };

  // Fetch shows data when component mounts
  useEffect(() => {
    fetchShowsData();
  }, []); // Empty dependency array means this effect runs only once

  // Sorting function for shows based on selected option
  const sortShows = (shows) => {
    switch (sortOption) {
      case "newest":
        return [...shows].sort(
          (a, b) => new Date(b.updated) - new Date(a.updated) // Sort by newest updates
        );
      case "oldest": // Add case for oldest
        return [...shows].sort(
          (a, b) => new Date(a.updated) - new Date(b.updated) // Sort by oldest updates
        );
      case "a-z": // Sort alphabetically from A-Z
        return [...shows].sort((a, b) => a.title.localeCompare(b.title));
      case "z-a": // Sort alphabetically from Z-A
        return [...shows].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return shows; // Return shows in default order
    }
  };

  // Filter shows based on search term and selected genre
  const filteredShows = shows.filter((show) => {
    const matchesSearchTerm = show.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "" || show.genres.some((genre) => {
      const genreId = typeof genre === "object" ? genre.id : genre;
      return genreId === Number(selectedGenre); // Match selected genre
    });
    return matchesSearchTerm && matchesGenre; // Return shows that match both criteria
  });

  // Sort filtered shows
  const sortedShows = sortShows(filteredShows);

  // Handlers for input changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update search term
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value); // Update selected genre
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value); // Update sorting option
  };

  // Toggle favorite status of an episode
  const toggleFavorite = (showId, seasonNumber, episodeNumber) => {
    const episodeKey = `${showId}-S${seasonNumber}-E${episodeNumber}`;
    setFavoriteEpisodes((prevFavorites) => {
      if (prevFavorites.includes(episodeKey)) {
        return prevFavorites.filter((fav) => fav !== episodeKey); // Remove from favorites
      } else {
        return [...prevFavorites, episodeKey]; // Add to favorites
      }
    });
  };

  // Return loading state if data is still being fetched
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Return error message if there was an issue fetching data
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Return message if no shows are available
  if (shows.length === 0) {
    return <p className="no-show">No shows available</p>;
  }

  // Render the show list page
  return (
    <div>
      {/* Search bar for filtering shows */}
      <SearchBar
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />

      {/* Genre filter for selecting genres */}
      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        handleGenreChange={handleGenreChange}
      />

      {/* Sorting dropdown for selecting sorting option */}
      <div>
        <label htmlFor="sort">Sort by:</label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          <option value="default">Default</option>
          <option value="newest">Newly Updated</option>
          <option value="oldest">Oldest Updated</option>
          <option value="a-z">A - Z</option>
          <option value="z-a">Z - A</option>
        </select>
      </div>

      {/* Display the list of shows */}
      <div className="show-list">
        {sortedShows.map((show) => (
          <ShowCard
            key={show.id}
            show={show}
            toggleFavorite={toggleFavorite}
            favoriteEpisodes={favoriteEpisodes}
          />
        ))}
      </div>
    </div>
  );
};

// PropTypes for type checking of component props
ShowList.propTypes = {
  shows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      genres: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.shape({
            id: PropTypes.number.isRequired,
          }),
          PropTypes.number,
        ])
      ).isRequired,
    })
  ).isRequired,
};

export default ShowList; // Export ShowList as the default export
