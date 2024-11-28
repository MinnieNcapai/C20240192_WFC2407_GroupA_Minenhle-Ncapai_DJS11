import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 
import SeasonList from './SeasonList'; 

const ShowDetail = () => {
    const { id } = useParams(); 
    const [showDetails, setShowDetails] = useState(null); // Changed to showDetails for clarity
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchShowDetails = async () => {
            try {
                setLoading(true); 
                const response = await axios.get(`https://podcast-api.netlify.app/id/${id}`); 
                setShowDetails(response.data); 
            } catch (err) {
                console.error(err); 
                setError('Failed to load show details.'); 
            } finally {
                setLoading(false); 
            }
        };

        fetchShowDetails(); 
    }, [id]); 

    if (loading) {
        return <div className="loading">Loading...</div>; 
    }

    if (error) {
        return <div className="error">{error}</div>; 
    }

    if (!showDetails) { // Check if showDetails is null
        return (
            <div className="no-show">
                <p>Show not found. Please check the URL or try again later.</p>
            </div>
        ); 
    }

    return (
        <div className="show-details-container">
            <div className="show-header">
                <img 
                    src={showDetails.image} // Access properties from showDetails
                    alt={showDetails.title} 
                    className="show-image" 
                />
                <h2 className="show-title">{showDetails.title}</h2>
            </div>
            <p className="show-description">{showDetails.description}</p>

            {/* Conditionally render SeasonList if seasons exist */}
            {showDetails.seasons && <SeasonList seasons={showDetails.seasons} />} 
        </div>
    );
};

export default ShowDetail;