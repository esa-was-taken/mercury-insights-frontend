import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from "react-query";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Routes,
    Outlet,
} from "react-router-dom";

import Popular from "./routes/popular";
import Trending from "./routes/trending";
import User from "./routes/user";
import Users from "./routes/users";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Tweets from "./routes/tweets";
import TrendingTweets from "./routes/trendingTweets";
import Tweet from "./routes/tweet";
import MarkedUsers from "./routes/markedUsers";

const queryClient = new QueryClient();
const theme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    return (
        // Provide the client to your App
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="popular" element={<Popular />} />
                            <Route path="trending" element={<Trending />} />
                            <Route path="tweets" element={<TrendingTweets />} />
                            <Route path="tweet" element={<Tweets />}>
                                <Route path=":tweetId" element={<Tweet />} />
                            </Route>
                            <Route path="user" element={<Users />}>
                                <Route path=":userName" element={<User />} />
                            </Route>
                            <Route
                                path="admin"
                                element={<MarkedUsers />}
                            ></Route>
                            <Route path="*" element={<NoMatch />} />
                        </Route>
                    </Routes>
                </Router>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;

function Layout() {
    return (
        <div className="App">
            <div className="App-header">
                <nav>
                    <ul className="App-navbar">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/popular">Popular</Link>
                        </li>
                        <li>
                            <Link to="/trending">Trending</Link>
                        </li>
                        <li>
                            <Link to="/tweets">Tweets</Link>
                        </li>
                        <li>
                            <Link to="/admin">Admin</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="App-body">
                <Outlet />
            </div>
        </div>
    );
}

function Home() {
    return <div>Mercury Insights</div>;
}

function NoMatch() {
    return (
        <div>
            <h2>Nothing to see here!</h2>
            <p>
                <Link to="/">Go to the home page</Link>
            </p>
        </div>
    );
}
