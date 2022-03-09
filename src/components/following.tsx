import { useParams } from "react-router-dom";
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
import { UserDto } from "../api/dtos";
import { SocialIcon } from "react-social-icons";
import { API_URL } from "../constants";

const fetchFollowing = async (userId: string) => {
    const limit = 100;
    const offset = 0;
    return await axios.get<UserDto[]>(`${API_URL}/user/${userId}/following`, {
        params: {
            limit: limit,
            offset: offset,
        },
    });
};

const Following = (user: UserDto) => {
    const userId = user.id;
    const followingQuery = useQuery(["following", userId], () =>
        fetchFollowing(userId)
    );

    if (followingQuery.isLoading) return <div>Loading...</div>;
    if (followingQuery.error)
        return <div>An error has occured. {followingQuery.error}</div>;
    const following = followingQuery.data?.data || [];

    return (
        <div>
            <h3>Following</h3>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {following.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <SocialIcon
                                    url={`https://twitter.com/${user.username}`}
                                />
                            </td>
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
};

export default Following;
