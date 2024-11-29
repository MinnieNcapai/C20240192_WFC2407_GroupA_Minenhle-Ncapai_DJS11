import { useEffect, useState } from "react";
import ShowCard from "./ShowCard";
import SearchBar from "./SearchBar";
import GenreFilter from "./GenreFilter";
import PropTypes from "prop-types";


const ShowList = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);
  const [sortOption, setSortOption] = useState("default"); 


  const fetchShowsData = async () => {
    try {
      const response = await fetch("https://podcast-api.netlify.app");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

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
          return { ...show, seasons: [] };
        }
      }));

      const showsWithDescriptions = showsWithSeasons.map((show) => ({
        ...show,
        description: show.description || "",
      }));

      showsWithDescriptions.sort((a, b) => a.title.localeCompare(b.title));
      setShows(showsWithDescriptions);

      const allGenreIds = new Set();
      showsWithDescriptions.forEach((show) => {
        if (show.genres) {
          show.genres.forEach((genre) => {
            if (typeof genre === "object" && genre.id) {
              allGenreIds.add(genre.id);
            } else if (typeof genre === "number") {
              allGenreIds.add(genre);
            }
          });
        }
      });

      const uniqueGenreIds = Array.from(allGenreIds);
      const genrePromises = uniqueGenreIds.map((id) =>
        fetch(`https://podcast-api.netlify.app/genre/${id}`)
          .then(res => res.json())
          .catch(error => {
            console.error("Error fetching genre:", error);
            return null;
          })
      );

      const fetchedGenres = await Promise.all(genrePromises);
      setGenres(fetchedGenres.filter((genre) => genre !== null));
    } catch (error) {
      setError(error.message);
      console.error("Error fetching shows:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowsData();
  }, []);

 // Sorting function
 const sortShows = (shows) => {
  switch (sortOption) {
    case "newest":
      return [...shows].sort(
        (a, b) => new Date(b.updated) - new Date(a.updated)
      );
        case "oldest": // Add case for oldest
        return [...shows].sort(
          (a, b) => new Date(a.updated) - new Date(b.updated)
        );
    default:
      return shows; 
  }
};


  const filteredShows = shows.filter((show) => {
    const matchesSearchTerm = show.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "" || show.genres.some((genre) => {
      const genreId = typeof genre === "object" ? genre.id : genre;
      return genreId === Number(selectedGenre);
    });
    return matchesSearchTerm && matchesGenre;
  });

  const sortedShows = sortShows(filteredShows); // Sort the filtered shows

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const toggleFavorite = (showId, seasonNumber, episodeNumber) => {
    const episodeKey = `${showId}-S${seasonNumber}-E${episodeNumber}`;
    setFavoriteEpisodes((prevFavorites) => {
 if (prevFavorites.includes(episodeKey)) {
        return prevFavorites.filter((fav) => fav !== episodeKey);
      } else {
        return [...prevFavorites, episodeKey];
      }
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (shows.length === 0) {
    return <p className="no-show">No shows available</p>;
  }

  return (
    <div>
      <SearchBar
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />

      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        handleGenreChange={handleGenreChange}
      />


       {/* Sorting Dropdown */}
       <div>
        <label htmlFor="sort">Sort by:</label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          <option value="default">Default</option>
          <option value="newest">Newly Updated</option>
          <option value="oldest">Oldest Updated</option>
        </select>
      </div>

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

// PropTypes for type checking
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

export default ShowList;