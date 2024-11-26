import { useContext } from 'react';
import { PodcastDetails } from '../AppDetails/PodcastDetails';

const EpisodePlayer = ({ episodes }) => {
    const { addFavorite } = useContext(PodcastDetails);

    return (
        <div>
            <h4>Episodes</h4>
            <ul>
                {episodes.map(episode => (
                    <li key={episode.id}>
                        <span>{episode.title}</span>
                        <button onClick={() => addFavorite(episode)}>Add to Favorites</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EpisodePlayer;