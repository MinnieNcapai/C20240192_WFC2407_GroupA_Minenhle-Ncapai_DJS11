import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import axios for making the API call
import SeasonList from './SeasonList'; // Import the SeasonList component to display seasons

const ShowDetail = () => {
    const { id } = useParams(); // Get the show ID from the URL
    const [show, setShow] = useState(null); // State for the detailed show data
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        // Fetch show details when the ID changes
        const fetchShowDetails = async () => {
            try {
                setLoading(true); // Set loading to true while fetching
                const response = await axios.get(`https://podcast-api.netlify.app/id/${id}`); // Fetch the show details
                setShow(response.data); // Set the fetched show data
            } catch (err) {
                console.error(err); // Log the error to the console for debugging
                setError('Failed to load show details.'); // Set a generic error message
            } finally {
                setLoading(false); // Set loading to false after fetching completes
            }
        };

        fetchShowDetails(); // Call the function to fetch show details
    }, [id]); // Dependency on the show ID to refetch if it changes

    if (loading) {
        return <div className="loading">Loading...</div>; // Show loading text while fetching
    }

    if (error) {
        return <div className="error">{error}</div>; // Show error message if something went wrong
    }

    if (!show) {
        return (
            <div className="no-show">
                <p>Show not found. Please check the URL or try again later.</p>
            </div>
        ); // If no show is found, display a message
    }

    return (
        <div className="show-details-container">
            <div className="show-header">
                <img 
                    src={show.image} 
                    alt={show.title} 
                    className="show-image" 
                />
                <h2 className="show-title">{show.title}</h2>
            </div>
            <p className="show-description">{show.description}</p>
            <SeasonList seasons={show.seasons} /> {/* Pass seasons data to SeasonList */}
        </div>
    );

};

export default ShowDetail;
