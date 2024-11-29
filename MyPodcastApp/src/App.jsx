// App.jsx
// Import necessary modules and components
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Router components for navigation
import { useState, useEffect } from "react"; // React hooks for state management and side effects
import PodcastDetailsProvider from "./AppDetails/PodcastDetails"; // Context provider for podcast details
import ShowList from "./components/ShowList"; // Component that displays the list of shows
import ShowDetail from "./components/ShowDetail"; // Component for displaying details of a selected show
import Favorites from "./components/Favorites"; // Component for displaying favorite shows
import Header from "./components/Header"; // Header component with navigation options

const App = () => {
  // State management hooks
  const [loading, setLoading] = useState(true); // Loading state to show a loading spinner
  const [error, setError] = useState(null); // Error state to handle any API or fetch errors
  const [shows, setShows] = useState([]); // State to store the fetched list of shows

  // Function to fetch shows data from the API
  const fetchShowsData = async () => {
    try {
      // Fetch the shows from the API
      const response = await fetch("https://podcast-api.netlify.app/");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`); // Handle HTTP errors
      }
      const data = await response.json(); // Parse the response data as JSON
      setShows(data); // Update the shows state with the fetched data
    } catch (error) {
      setError(error.message); // Set the error state if something goes wrong
      console.error("Error fetching shows:", error); // Log the error to the console
    } finally {
      setLoading(false); // Set loading state to false when fetching is complete
    }
  };

  // useEffect hook to fetch shows data when the component mounts
  useEffect(() => {
    fetchShowsData(); // Call the function to fetch shows data
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    // Provide the context for podcast details to all child components
    <PodcastDetailsProvider>
      <Router>
        <Header /> {/* Render the Header component for navigation */}
        <Routes>
          {/* Define routes for different pages */}
          <Route
            path="/" // Home route
            element={
              // Conditional rendering based on loading or error state
              loading ? (
                <div className="loading">Loading...</div> // Show loading message while fetching data
              ) : error ? (
                <div className="error">Error: {error}</div> // Show error message if there's an issue
              ) : (
                <ShowList shows={shows} /> // Show the list of shows once data is loaded
              )
            }
          />
          {/* Route for displaying details of a selected show */}
          <Route path="/shows/:id" element={<ShowDetail />} />
          {/* Route for displaying favorite shows */}
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Router>
    </PodcastDetailsProvider>
  );
};

export default App; // Export the App component for use in other parts of the application
