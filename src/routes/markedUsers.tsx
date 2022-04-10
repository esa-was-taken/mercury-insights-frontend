import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { API_URL } from "../constants";

interface UserDto {
    username: string;
    name: string;
    marked: boolean;
}

const fetchMarkedUsers = async () => {
    return await axios.get<UserDto[]>(`${API_URL}/user/marked`);
};

const updateMarkedUser = async (username: string, marked: boolean) => {
    return axios.post(`${API_URL}/user/by/username/${username}`, {
        username: username,
        marked: marked,
    });
};

// Create a list of marked users, with a button to the side to remove
// On top have an input for twitter username and a button to confirm
export default function MarkedUsers() {
    const markedUsersQuery = useQuery("markedUsers", () => fetchMarkedUsers());
    const [usernameInput, setUsernameInput] = useState("");

    const { mutate, isLoading } = useMutation(
        (user: { username: string; marked: boolean }) =>
            axios.post(`${API_URL}/user/by/username/${user.username}`, {
                username: user.username,
                marked: user.marked,
            }),
        {
            onSuccess: (data) => {
                console.log(data);
                const message = "Succeeded in updating user.";
                alert(message);
                markedUsersQuery.refetch();
            },
            onError: () => {
                alert("Failed to update user.");
            },
        }
    );

    if (markedUsersQuery.isLoading) return <div>Loading...</div>;
    if (markedUsersQuery.error)
        return <div>An error has occured. {markedUsersQuery.error}</div>;

    const markedUsers = markedUsersQuery.data?.data;

    return (
        <div>
            TODO: Add management of marked user weight/score
            <h3>Marked users</h3>
            <TextField
                id="outlined-basic"
                label="Mark twitter user"
                variant="outlined"
                onChange={(event) => {
                    setUsernameInput(event.target.value);
                }}
            />
            <Button
                variant="outlined"
                onClick={() => {
                    mutate({ username: usernameInput, marked: true });
                }}
            >
                Mark
            </Button>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Username</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {markedUsers
                        ?.sort((a, b) => {
                            var nameA = a.name.toLowerCase(),
                                nameB = b.name.toLowerCase();
                            if (nameA < nameB) return -1;
                            if (nameA > nameB) return 1;
                            return 0; //default return value (no sorting)
                        })
                        .map((user) => (
                            <tr key={user.username}>
                                <td>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            mutate({
                                                username: user.username,
                                                marked: false,
                                            });
                                        }}
                                    >
                                        Unmark
                                    </Button>
                                </td>
                                <td>{user.username}</td>
                                <td>{user.name}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
