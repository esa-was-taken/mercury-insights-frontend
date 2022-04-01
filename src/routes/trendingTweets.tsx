import {
    DataGridPro,
    GridColDef,
    GridFilterModel,
    GridRenderCellParams,
    GridSortModel,
} from "@mui/x-data-grid-pro";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { SocialIcon } from "react-social-icons";
import { API_URL } from "../constants";

interface TweetDto {
    likes: number;
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

const fetchTweets = async (interval: number) => {
    const before = new Date();
    before.setHours(before.getHours() - interval);

    // Round everything up to 5 minutes to allow for caching
    var coeff = 1000 * 60 * 5;
    const _before = new Date(Math.ceil(before.getTime() / coeff) * coeff);

    return await axios.get<TweetDto[]>(`${API_URL}/tweet/trending`, {
        params: { before: _before },
    });
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

function TrendingTweets() {
    const [selectedInterval, setSelectedInterval] = useState(
        INTERVAL_OPTIONS[0].value
    );

    const query = useQuery(["tweets", selectedInterval], () =>
        fetchTweets(selectedInterval)
    );

    const [gridSortModel, setGridSortModel] = useState<GridSortModel>([
        { field: "followers", sort: "desc" },
    ]);
    const [gridFilterModel, setGridFilterModel] = useState<GridFilterModel>({
        items: [],
    });

    const loading = query.isLoading;
    const data = query.data?.data || [];
    const rows = data.map((x) => {
        return { ...x, id_copy: x.id };
    });
    const columns: GridColDef[] = [
        {
            field: "likes",
            type: "number",
            headerName: "(Marked) Likes",
        },
        {
            field: "tweetText",
            type: "string",
            headerName: "Tweet Text",
            width: 400,
        },
        {
            field: "id",
            headerName: "Tweet URL",
            renderCell: (params: GridRenderCellParams<string>) => (
                <div>
                    <SocialIcon
                        url={`https://twitter.com/i/web/status/${params.value}`}
                    />
                </div>
            ),
        },
        {
            field: "authorId",
            headerName: "Author URL",
            renderCell: (params: GridRenderCellParams<string>) => (
                <div>
                    <SocialIcon
                        url={`https://twitter.com/i/user/${params.value}`}
                    />
                </div>
            ),
        },
        {
            field: "id_copy",
            headerName: "Tweet ID",
            renderCell: (params: GridRenderCellParams<string>) => (
                <div>
                    <div className="User-link">
                        <Link to={`/tweet/${params.value}`}>
                            {params.value}
                        </Link>
                    </div>
                </div>
            ),
        },
        { field: "like_count", type: "number", headerName: "Likes" },
        { field: "quote_count", type: "number", headerName: "Quotes" },
        { field: "reply_count", type: "number", headerName: "Replies" },
        { field: "retweet_count", type: "number", headerName: "Retweets" },
        { field: "createdAt", type: "dateTime", headerName: "Tweeted At" },
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
            <div style={{ width: "100%" }}>
                <DataGridPro
                    autoHeight
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
        </div>
    );
}

export default TrendingTweets;
