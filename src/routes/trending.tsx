import { assertExpressionStatement } from "@babel/types";
import React, { useState } from "react";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from "react-query";

import axios from "axios";
import { Link, Outlet } from "react-router-dom";
import { SocialIcon } from "react-social-icons";
import { start } from "repl";
import { endianness } from "os";
import { resourceLimits } from "worker_threads";

interface TrendingDto {
    id: string;
    name: string;
    username: string;
    difference: number;
}

const fetchTrending = async (interval: number) => {
    const start = new Date();
    start.setHours(start.getHours() - interval);
    const end = new Date();

    const limit = 100;

    const offset = 0;

    return await axios.get<TrendingDto[]>(
        "http://localhost:3001/user/trending",
        {
            params: {
                start: start,
                end: end,
                limit: limit,
                offset: offset,
            },
        }
    );
};

const INTERVAL_OPTIONS = [
    {
        name: "1D",
        value: 24,
    },
    {
        name: "3D",
        value: 72,
    },
    {
        name: "1W",
        value: 168,
    },
    {
        name: "1M",
        value: 730,
    },
    {
        name: "3M",
        value: 2191,
    },
    {
        name: "6M",
        value: 4382,
    },
    {
        name: "1Y",
        value: 8765,
    },
];

function Trending() {
    // Declare a new state variable, which we'll call "count"  const [count, setCount] = useState(0);
    const [selectedInterval, setSelectedInterval] = useState(
        INTERVAL_OPTIONS[0].value
    );

    const query = useQuery(["trending", selectedInterval], () =>
        fetchTrending(selectedInterval)
    );

    if (query.isLoading) return <div>Loading...</div>;
    if (query.error) return <div>An error has occured. {query.error}</div>;

    const data = query.data?.data || [];
    return (
        <div>
            <div>
                <label htmlFor="intervals">Select time interval: </label>
                <select
                    name="intervals"
                    id="intervals"
                    value={selectedInterval}
                    onChange={(e) =>
                        setSelectedInterval(parseInt(e.target.value))
                    }
                >
                    {INTERVAL_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.name}
                        </option>
                    ))}
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Difference</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user) => (
                        <tr key={user.username}>
                            <td>
                                <SocialIcon
                                    url={`https://twitter.com/${user.username}`}
                                />
                            </td>
                            <td>{user.difference}</td>
                            <td className="User-link">
                                <Link to={`/user/${user.username}`}>
                                    {user.name}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Trending;
