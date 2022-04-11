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
import { API_URL } from "../constants";
import { Container } from "@mui/material";
import LikedBy from "../components/likedBy";

const fetchUser = async (userId: string) => {
    return await axios.get<UserDto>(`${API_URL}/user/${userId}`);
};

const fetchUserByUsername = async (userName: string) => {
    return await axios.get<UserDto>(`${API_URL}/user/by/username/${userName}`);
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
            <div
                className="User-profile"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <h2 className="User-username">
                    <div>
                        <img src={user?.metadata?.profile_image_url}></img>
                    </div>{" "}
                    {user?.name}{" "}
                    <SocialIcon url={`https://twitter.com/${user?.username}`} />
                </h2>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: 400,
                    }}
                >
                    <div
                        style={{
                            maxWidth: 400,
                            borderBottomWidth: 1,
                            borderBottomStyle: "solid",
                            marginBottom: "0.5em",
                        }}
                    >
                        {user?.metadata?.description}
                    </div>
                    <div>
                        Followers: {user?.public_metrics?.followers_count}
                    </div>
                    <div>Account created on: {user?.metadata?.createdAt}</div>
                    <div>Marked: {user?.marked ? "yes" : "no"}</div>
                </div>
            </div>

            {user?.id && (
                <div className="User-relationships">
                    <Following {...user}></Following>

                    <Followers {...user}></Followers>
                    <LikedBy {...user}></LikedBy>
                </div>
            )}
        </div>
    );
}
