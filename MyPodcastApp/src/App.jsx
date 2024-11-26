import 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PodcastProvider from './AppDetails/PodcastDetails';
import Header from './components/Header';
import ShowList from './components/ShowList';
import ShowDetail from './components/ShowDetail';
import Favorites from './components/Favorites';

const App = () => {
    return (
        <PodcastProvider>
            <Router>
                <Header />
                <Switch>
                    <Route path="/" exact component={ShowList} />
                    <Route path="/shows/:id" component={ShowDetail} />
                    <Route path="/favorites" component={Favorites} />
                </Switch>
            </Router>
        </PodcastProvider>
    );
};

export default App;