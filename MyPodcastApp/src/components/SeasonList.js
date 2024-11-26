import 'react';
import EpisodePlayer from '../components/EpisodePlayer';

const SeasonList = ({ seasons }) => {
    return (
        <div>
            {seasons.map(season => (
                <div key={season.id}>
                    <h3>{season.title}</h3>
                    <EpisodePlayer episodes={season.episodes} />
                </div>
            ))}
        </div>
    );
};


export default SeasonList;