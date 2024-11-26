import { useContext } from 'react';
import { PodcastDetails } from '../AppDetails/PodcastDetails';
import { Link } from 'react-router-dom';

const ShowList = () => {
    const { shows } = useContext(PodcastDetails);

    return (
        <div>
            <h2>Available Shows</h2>
            <ul>
                {shows.map(show => (
                    <li key={show.id}>
                        <Link to={`/shows/${show.id}`}>{show.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShowList;