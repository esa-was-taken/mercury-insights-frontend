import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { SocialIcon } from "react-social-icons";
import {
    DataGridPro,
    GridCallbackDetails,
    GridColDef,
    GridFilterModel,
    GridRenderCellParams,
    GridSortModel,
} from "@mui/x-data-grid-pro";
import { UserFollowersDiff } from "../api/dtos";
import { API_URL } from "../constants";

interface TrendingDto {
    id: string;
    name: string;
    username: string;
    difference: number;
}

const flatten = (
    obj: UserFollowersDiff | { [s: string]: unknown } | ArrayLike<unknown>
) =>
    Object.assign(
        {},
        Object.fromEntries(
            Object.values(obj)
                .filter((x) => x && typeof x === "object")
                .map((x) => Object.entries(x))
                .flat(1)
        ),
        Object.fromEntries(
            Object.entries(obj).filter(([, x]) => typeof x !== "object")
        )
    );

const fetchTrending = async (interval: number) => {
    return await axios.get<UserFollowersDiff[]>(`${API_URL}/user/trending/${interval}`);
};

const INTERVAL_OPTIONS = [
    {
        name: "1D",
        value: 24,
    },
    {
        name: "3D",
        value: 72,
    },
    {
        name: "1W",
        value: 168,
    },
    {
        name: "1M",
        value: 730,
    },
    {
        name: "3M",
        value: 2191,
    },
    {
        name: "6M",
        value: 4382,
    },
    {
        name: "1Y",
        value: 8765,
    },
];

function Trending() {
    // Declare a new state variable, which we'll call "count"  const [count, setCount] = useState(0);
    const [selectedInterval, setSelectedInterval] = useState(
        INTERVAL_OPTIONS[0].value
    );

    const [gridSortModel, setGridSortModel] = useState<GridSortModel>([
        { field: "difference", sort: "desc" },
    ]);
    const [gridFilterModel, setGridFilterModel] = useState<GridFilterModel>({
        items: [],
    });

    const query = useQuery(["trending", selectedInterval], () =>
        fetchTrending(selectedInterval)
    );

    const loading = query.isLoading;
    // if (query.isLoading) return <div>Loading...</div>;
    // if (query.error) return <div>An error has occured. {query.error}</div>;

    const data = query.data?.data || [];
    const rows = data.map((x) => flatten(x));
    const columns: GridColDef[] = [
        { field: "difference", type: "number", headerName: "Score" },
        {
            field: "username",
            headerName: "Username",
            renderCell: (params: GridRenderCellParams<string>) => (
                <div>
                    <div className="User-link">
                        <Link to={`/user/${params.value}`}>{params.value}</Link>
                    </div>
                </div>
            ),
        },
        {
            field: "followers",
            type: "number",
            headerName: "(Marked) Followers",
        },
        {
            field: "marked_followers_ratio",
            type: "number",
            headerName: "Ratio Marked Followers",
        },
        { field: "followers_count", type: "number", headerName: "Followers" },
        { field: "following_count", type: "number", headerName: "Following" },
        { field: "tweet_count", type: "number", headerName: "Tweets" },
        { field: "listed_count", type: "number", headerName: "Listed" },
        { field: "createdAt", type: "dateTime", headerName: "Acc. Created At" },
        { field: "verified", type: "boolean", headerName: "Verified" },
        { field: "marked", type: "boolean", headerName: "Marked" },
        { field: "description", headerName: "Profile Desc." },
        { field: "entities", headerName: "Entities" },
        { field: "location", headerName: "Location" },
        { field: "protected", type: "boolean", headerName: "Protected" },
    ];

    return (
        <div>
            <div>
                <label htmlFor="intervals">Select time interval: </label>
                <select
                    name="intervals"
                    id="intervals"
                    value={selectedInterval}
                    onChange={(e) => {
                        console.log(e, parseInt(e.target.value));
                        setSelectedInterval(parseInt(e.target.value));
                    }}
                >
                    {INTERVAL_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.name}
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ height: 1000, width: "100%" }}>
                <DataGridPro
                    initialState={{
                        sorting: { sortModel: gridSortModel },
                        filter: { filterModel: gridFilterModel },
                        pagination: {
                            pageSize: 100,
                        },
                    }}
                    pagination
                    loading={loading}
                    rows={rows}
                    columns={columns}
                ></DataGridPro>
            </div>

            {/* <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Difference</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user) => (
                        <tr key={user.username}>
                            <td>
                                <SocialIcon
                                    url={`https://twitter.com/${user.username}`}
                                />
                            </td>
                            <td>{user.difference}</td>
                            <td className="User-link">
                                <Link to={`/user/${user.username}`}>
                                    {user.name}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
        </div>
    );
}

export default Trending;
