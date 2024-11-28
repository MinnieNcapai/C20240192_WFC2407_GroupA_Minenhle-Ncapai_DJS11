// App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import PodcastDetailsProvider from "./AppDetails/PodcastDetails";
import ShowList from "./components/ShowList";
import ShowDetail from "./components/ShowDetail";
import Favorites from "./components/Favorites";
import Header from "./components/Header";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shows, setShows] = useState([]); // Add state for shows

  // Function to fetch shows data
  const fetchShowsData = async () => {
    try {
      const response = await fetch("https://podcast-api.netlify.app/");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); 1 
      setShows(data);
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

  return (
    <PodcastDetailsProvider>
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              loading ? (
                <div className="loading">Loading...</div>
              ) : error ? (
                <div className="error">Error: {error}</div>
              ) : (
                <ShowList shows={shows} />
              )
            }
          />
          <Route path="/shows/:id" element={<ShowDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Router>
    </PodcastDetailsProvider>
  );
};

export default App;