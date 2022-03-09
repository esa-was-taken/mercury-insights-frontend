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

const fetchFollowers = async (userId: string) => {
    const limit = 100;
    const offset = 0;

    return await axios.get<UserDto[]>(`${API_URL}/user/${userId}/followers`, {
        params: {
            limit: limit,
            offset: offset,
        },
    });
};

export default function Followers(user: UserDto) {
    const userId = user.id;
    const followersQuery = useQuery(["followers", userId], () =>
        fetchFollowers(userId)
    );
    if (followersQuery.isLoading) return <div>Loading...</div>;
    if (followersQuery.error)
        return <div>An error has occured. {followersQuery.error}</div>;
    const followers = followersQuery.data?.data || [];

    return (
        <div>
            <h3>Followers</h3>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {followers.map((user) => (
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
}
