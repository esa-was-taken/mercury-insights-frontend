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
import { Link } from "react-router-dom";
import { SocialIcon } from "react-social-icons";

interface PopularDto {
    id: string;
    name: string;
    username: string;
    followers: number;
}

const fetchPopular = async () => {
    const limit = 100;
    const offset = 0;

    return await axios.get<PopularDto[]>("http://localhost:3001/user/popular", {
        params: {
            limit: limit,
            offset: offset,
        },
    });
};

function Popular() {
    // Declare a new state variable, which we'll call "count"  const [count, setCount] = useState(0);
    const query = useQuery("popular", fetchPopular);

    if (query.isLoading) return <div>Loading...</div>;
    if (query.error) return <div>An error has occured. {query.error}</div>;

    const data = query.data?.data || [];
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Followers</th>
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
                            <td>{user.followers}</td>
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

export default Popular;
