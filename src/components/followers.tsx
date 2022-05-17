import { Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { SocialIcon } from "react-social-icons";
import { UserDto, UserFollowerDto } from "../api/dtos";
import { API_URL } from "../constants";
import { dateFormatShort } from "../utils";
import { Username } from "./username";

const fetchFollowers = async (userId: string) => {
    const limit = 100;
    const offset = 0;

    return await axios.get<UserFollowerDto[]>(
        `${API_URL}/user/${userId}/followers`,
        {
            params: {
                limit: limit,
                offset: offset,
            },
        }
    );
};

const fetchRemovedFollowers = async (userId: string) => {
    const limit = 100;
    const offset = 0;

    return await axios.get<UserFollowerDto[]>(
        `${API_URL}/user/${userId}/followers/removed`,
        {
            params: {
                limit: limit,
                offset: offset,
            },
        }
    );
};

export default function Followers(user: UserDto) {
    const [showRemoved, setShowRemoved] = useState(false);

    const userId = user.id;
    const followersQuery = useQuery(["followers", userId, showRemoved], () => {
        return showRemoved
            ? fetchRemovedFollowers(userId)
            : fetchFollowers(userId);
    });

    if (followersQuery.isLoading) return <div>Loading...</div>;
    if (followersQuery.error)
        return <div>An error has occured. {followersQuery.error}</div>;
    const followers =
        followersQuery.data?.data.sort((a, b) => b.addedAt - a.addedAt) || [];

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setShowRemoved(!showRemoved);
                    }}
                >
                    <b>Followers</b>: {showRemoved ? "Removed" : "Added"}
                </Button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>{showRemoved ? "Removed on" : "Added on"}</th>
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
                                <Username
                                    username={user.username}
                                    name={user.name}
                                />
                            </td>
                            <td>{dateFormatShort(new Date(user.addedAt))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
