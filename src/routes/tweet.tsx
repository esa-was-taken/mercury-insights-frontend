import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";

import axios from "axios";

import { API_URL } from "../constants";
import { SocialIcon } from "react-social-icons";

interface UserDto {
    username: string;
    name: string;
}

interface LikeDto {
    tUser: UserDto;
}

interface TweetDto {
    likes: LikeDto[];
    id: string;
    tweetText: string;
    createdAt: Date;
    authorId: string;
    like_count: number;
    quote_count: number;
    reply_count: number;
    retweet_count: number;
    id_copy: string; // Need to add this calculated value to fool data-grid
}

const fetchTweetById = async (tweetId: string) => {
    return await axios.get<TweetDto>(`${API_URL}/tweet/${tweetId}`);
};

export default function Tweet() {
    let params = useParams();
    const tweetId = params.tweetId;
    if (!tweetId) {
        throw new Error("UserId may not be undefined");
    }

    const tweetQuery = useQuery(["tweet", tweetId], () =>
        fetchTweetById(tweetId)
    );

    if (tweetQuery.isLoading) return <div>Loading...</div>;
    if (tweetQuery.error)
        return <div>An error has occured. {tweetQuery.error}</div>;
    const tweet = tweetQuery.data?.data;

    return (
        <div>
            <p>{tweet?.tweetText}</p>
            <p>TODO: Embed tweet here</p>
            <div>
                <h3>Liked by:</h3>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tweet?.likes.map((like) => (
                            <tr key={like.tUser.username}>
                                <td>
                                    <SocialIcon
                                        url={`https://twitter.com/${like.tUser.username}`}
                                    />
                                </td>
                                <td className="User-link">
                                    <Link to={`/user/${like.tUser.username}`}>
                                        {like.tUser.name}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
