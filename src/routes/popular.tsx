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
import { Link } from "react-router-dom";
import { SocialIcon } from "react-social-icons";
import { UserWithFollowers } from "../api/dtos";
import {
    DataGridPro,
    GridCallbackDetails,
    GridColDef,
    GridFilterModel,
    GridRenderCellParams,
    GridSortModel,
} from "@mui/x-data-grid-pro";
import { API_URL } from "../constants";

interface PopularDto {
    id: string;
    name: string;
    username: string;
    followers: number;
}

const flatten = (
    obj: UserWithFollowers | { [s: string]: unknown } | ArrayLike<unknown>
) => {
    const a = Object.fromEntries(
        Object.values(obj)
            .filter((x) => x && typeof x === "object")
            .map((x) => Object.entries(x))
            .flat(1)
    );
    const b = Object.fromEntries(
        Object.entries(obj).filter(([, x]) => typeof x !== "object")
    );
    return Object.assign({}, a, b);
};

const fetchPopular = async () => {
    return await axios.get<UserWithFollowers[]>(`${API_URL}/user/popular`);
};

function Popular() {
    // Declare a new state variable, which we'll call "count"  const [count, setCount] = useState(0);
    const query = useQuery("popular", fetchPopular);

    const [gridSortModel, setGridSortModel] = useState<GridSortModel>([
        { field: "followers", sort: "desc" },
    ]);
    const [gridFilterModel, setGridFilterModel] = useState<GridFilterModel>({
        items: [],
    });

    const loading = query.isLoading;
    const data = query.data?.data || [];
    const rows = data.map((x) => {
        return flatten(x);
    });
    const columns: GridColDef[] = [
        {
            field: "followers",
            type: "number",
            headerName: "(Marked) Followers",
        },
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
        </div>
    );
}

export default Popular;
