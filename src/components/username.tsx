import { Link } from "react-router-dom";

type UsernameProps = {
    username: string;
    name: string;
};

export const Username = ({ username, name }: UsernameProps) => {
    const maxLength = 20;
    const isTruncated = name.length > maxLength;
    return (
        <Link to={`/user/${username}`} title={name}>
            {isTruncated ? name.slice(0, maxLength) + "..." : name}
        </Link>
    );
};
