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
      console.log("Fetched shows data:", data);

      // Fetch season data for each show
      const showsWithSeasons = await Promise.all(data.map(async (show) => {
        try {
          const seasonsResponse = await fetch(
            `https://podcast-api.netlify.app/shows/${show.id}/seasons`
          );
          if (!seasonsResponse.ok) {
            const errorText = await seasonsResponse.text();
            throw new Error(
              `Error fetching seasons for show ${show.id}: ${seasonsResponse.status} - ${errorText}`
            );
          }
          const seasonsData = await seasonsResponse.json();
          return { ...show, seasons: seasonsData };
        } catch (error) {
          console.error(`Error fetching seasons for show ${show.id}:`, error);
          return { ...show, seasons: [] };
        }
      }));

      // Ensure each show has a description before setting shows state
      const showsWithDescriptions = showsWithSeasons.map((show) => ({
        ...show,
        description: show.description || "",
      }));

      // Sort shows alphabetically by title
      showsWithDescriptions.sort((a, b) =>
        a.title.localeCompare(b.title)
      );

      setShows(showsWithDescriptions);

      // Extract unique genre IDs from shows
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
      console.log("Unique Genre IDs:", uniqueGenreIds);

      // Fetch genre data for each unique genre ID
      const genrePromises = Array.from(uniqueGenreIds).map((id) =>
        fetch(`https://podcast-api.netlify.app/genre/${id}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Error fetching genre ${id}: ${res.status}`);
            }
            return res.json();
          })
          .then((genreData) => ({
            id: genreData.id,
            title: genreData.title,
          }))
          .catch((error) => {
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

  const filteredShows = shows.filter((show) => {
    const matchesSearchTerm = show.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesGenre =
      selectedGenre === "" ||
      show.genres.some((genre) => {
        const genreId = typeof genre === "object" ? genre.id : genre;
        return genreId === Number(selectedGenre);
      });

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