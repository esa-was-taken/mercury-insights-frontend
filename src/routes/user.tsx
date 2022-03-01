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
import Following from "../components/following";
import Followers from "../components/followers";
import { SocialIcon } from "react-social-icons";

const fetchUser = async (userId: string) => {
    return await axios.get<UserDto>(`http://localhost:3001/user/${userId}`);
};

const fetchUserByUsername = async (userName: string) => {
    return await axios.get<UserDto>(
        `http://localhost:3001/user/by/username/${userName}`
    );
};

export default function User() {
    let params = useParams();
    const userName = params.userName;
    if (!userName) {
        throw new Error("UserId may not be undefined");
    }

    const userQuery = useQuery(["user", userName], () =>
        fetchUserByUsername(userName)
    );

    if (userQuery.isLoading) return <div>Loading...</div>;
    if (userQuery.error)
        return <div>An error has occured. {userQuery.error}</div>;
    const user = userQuery.data?.data;

    return (
        <div>
            <h2 className="User-username">
                {user?.name}{" "}
                <SocialIcon url={`https://twitter.com/${user?.username}`} />
            </h2>
            {user?.id && (
                <div className="User-relationships">
                    <Following {...user}></Following>

                    <Followers {...user}></Followers>
                </div>
            )}
        </div>
    );
}
