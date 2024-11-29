# React + Vite

Podcast App Documentation
This React application allows users to explore podcasts, view episodes and seasons, search, filter by genre, and mark episodes as favorites. It uses React's Context API for state management, Axios for fetching data, and localStorage for persisting user preferences.

Components
PodcastDetailsProvider
Fetches podcast show and genre data from an API using Axios.
Manages states for shows, genres, favorites, loading, and errors.
Provides functions for adding and removing favorite episodes.
Uses localStorage to store favorites across sessions.
Provides data and functions to child components using React's Context API.

ShowList
Displays a list of podcasts, their seasons, and episodes.
Allows searching for podcasts by title and filtering by genre.
Supports toggling favorite status for episodes.

ShowDetails
Displays detailed information for a specific podcast show.
Allows toggling favorite status for episodes within the show.
ShowCard
Renders a card for each podcast show with its title, image, and number of seasons.
Lists episodes for each season and allows marking them as favorites.

SeasonList
Displays a list of seasons for a podcast show.
Provides an expandable/collapsible view for episodes in each season.

SearchBar
Provides a search bar to filter podcast shows by title.
GenreFilter
Provides a dropdown menu for filtering podcast shows by genre.

Header
Renders the application header with basic navigation elements.
Favorites
Manages and displays the user's list of favorite episodes.
Allows users to remove or play favorite episodes.

EpisodePlayer
Provides an audio player for playing podcast episodes.
Supports adding or removing episodes from favorites.
State Management
The PodcastDetailsProvider uses React's Context API to manage and share state:

shows: The list of podcast shows.
genres: The available podcast genres.
favorites: The list of favorite episodes.
loading: Indicates whether data is being fetched.
error: Captures any errors during data fetching.
Axios is used to fetch data from the API, and state is updated once the data is retrieved.

Features
Data Persistence: Favorites are stored in localStorage, allowing them to persist across sessions.
Search & Filter: Users can search for podcasts by title and filter them by genre.
Favorites: Users can mark episodes as favorites, view them in the Favorites list, and remove them.
Usage
Wrap your main application component with the PodcastDetailsProvider.

Conclusion
This app allows users to explore podcasts, manage their favorites, and filter by genre. With state management using React's Context API and persistent favorites through localStorage, it offers a seamless experience for discovering and enjoying podcasts.