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

  // (Optional) Function to fetch any initial data your app might need
  const fetchInitialData = async () => { 
    try {
      // ... your initial data fetching logic (if any) ...
    } catch (error) {
      setError(error.message);
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData(); 
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
                <ShowList />  // No need to pass shows here
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