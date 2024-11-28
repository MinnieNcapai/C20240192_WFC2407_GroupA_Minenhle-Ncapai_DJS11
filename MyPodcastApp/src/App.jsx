import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PodcastDetailsProvider from './AppDetails/PodcastDetails'; // Correct import
import ShowList from './components/ShowList';
import ShowDetail from './components/ShowDetail';
import Favorites from './components/Favorites';
import Header from './components/Header';

const App = () => {
    return (
        <PodcastDetailsProvider> {/* Wrap with PodcastDetailsProvider */}
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<ShowList />} />
                    <Route path="/shows/:id" element={<ShowDetail />} />
                    <Route path="/favorites" element={<Favorites />} />
                </Routes>
            </Router>
        </PodcastDetailsProvider>
    );
};

export default App;
