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

const fetchUserLikedBy = async (userName: string) => {
    return await axios.get<UserDto[]>(`${API_URL}/user/${userName}/likedBy`);
};

export default function LikedBy(user: UserDto) {
    const userLikedByQuery = useQuery(["userLikedBy", user.username], () =>
        fetchUserLikedBy(user.username)
    );
    if (userLikedByQuery.isLoading) return <div>Loading...</div>;
    if (userLikedByQuery.error)
        return <div>An error has occured. {userLikedByQuery.error}</div>;
    const users = userLikedByQuery.data?.data || [];

    return (
        <div>
            <h3>Liked by</h3>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
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
