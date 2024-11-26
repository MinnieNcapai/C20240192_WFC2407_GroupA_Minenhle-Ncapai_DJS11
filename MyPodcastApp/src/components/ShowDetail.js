import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PodcastDetails } from '../AppDetails/PodcastDetails';
import SeasonList from './SeasonList';

const ShowDetail = () => {
    const { shows } = useContext(PodcastDetails);
    const { id } = useParams();
    const [show, setShow] = useState(null);

    useEffect(() => {
        const foundShow = shows.find(s => s.id === parseInt(id));
        setShow(foundShow);
    }, [id, shows]);

    if (!show) return <div>Loading...</div>;

    return (
        <div>
            <h2>{show.title}</h2>
            <p>{show.description}</p>
            <SeasonList seasons={show.seasons} />
        </div>
    );
};

export default ShowDetail;