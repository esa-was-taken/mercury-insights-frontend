import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { SocialIcon } from "react-social-icons";
import { UserDto, UserLikedByDto } from "../api/dtos";
import { API_URL } from "../constants";
import { dateFormatShort } from "../utils";
import { Username } from "./username";

const fetchUserLikedBy = async (userName: string) => {
    return await axios.get<UserLikedByDto[]>(
        `${API_URL}/user/${userName}/likedBy`
    );
};

export default function LikedBy(user: UserDto) {
    const userLikedByQuery = useQuery(["userLikedBy", user.username], () =>
        fetchUserLikedBy(user.username)
    );
    if (userLikedByQuery.isLoading) return <div>Loading...</div>;
    if (userLikedByQuery.error)
        return <div>An error has occured. {userLikedByQuery.error}</div>;
    const users =
        userLikedByQuery.data?.data.sort((a, b) => b.addedAt - a.addedAt) || [];

    return (
        <div>
            <h3>Liked by</h3>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Added on</th>
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
