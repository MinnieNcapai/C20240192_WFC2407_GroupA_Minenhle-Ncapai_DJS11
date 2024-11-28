// ShowList.jsx
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

  const fetchShowsData = async () => {
    try {
      const response = await fetch("https://podcast-api.netlify.app");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      if (Array.isArray(data)) {
        setShows(data);

        // Extract genres (assuming each show has a 'genres' array)
        const allGenres = new Set();
        data.forEach((show) => {
          show.genres.forEach((genre) => allGenres.add(genre));
        });
        setGenres(Array.from(allGenres));
      } else {
        throw new Error("Invalid data format, expected an array of shows");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching shows:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch("https://podcast-api.netlify.app/genres");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
  
      // Check if data is an array before mapping
      const genreNames = Array.isArray(data) 
        ? data.map((genre) => (typeof genre === 'string' ? genre : genre.name))
        : []; // If data is not an array, set genres to an empty array
  
      setGenres(genreNames); 
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  useEffect(() => {
    fetchShowsData();
    fetchGenres(); 
  }, []);

  const filteredShows = shows.filter((show) => {
    const matchesSearchTerm = show.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenre === "" || show.genres.includes(selectedGenre);
    return matchesSearchTerm && matchesGenre;
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
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

      <div className="show-list">
        {filteredShows.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
};

ShowList.propTypes = {
  shows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string,
    })
  ),
};

export default ShowList;