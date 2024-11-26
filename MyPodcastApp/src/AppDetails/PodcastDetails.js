import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const PodcastContext = createContext();

const PodcastProvider = ({ children }) => {
    const [shows, setShows] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchShows = async () => {
            const response = await axios.get('https://podcast-api.netlify.app');
            setShows(response.data);
        };
        fetchShows();
    }, []);

    const addFavorite = (episode) => {
        setFavorites((prev) => [...prev, episode]);
    };

    const removeFavorite = (episodeId) => {
        setFavorites((prev) => prev.filter((ep) => ep.id !== episodeId));
    };

    return (
        <PodcastContext.Provider value={{ shows, favorites, addFavorite, removeFavorite }}>
            {children}
        </PodcastContext.Provider>
    );
};

export default PodcastProvider;