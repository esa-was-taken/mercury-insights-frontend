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
    return await axios.get<UserWithFollowers[]>(
        "http://localhost:3001/user/popular"
    );
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
            field: "username",
            headerName: "Twitter",
            renderCell: (params: GridRenderCellParams<string>) => (
                <SocialIcon url={`https://twitter.com/${params.value}`} />
            ),
        },
        { field: "followers", type: "number" },
        { field: "name" },
        { field: "followers_count", type: "number" },
        { field: "following_count", type: "number" },
        { field: "tweet_count", type: "number" },
        { field: "listed_count", type: "number" },
        { field: "createdAt", type: "dateTime" },
        { field: "description" },
        { field: "entities" },
        { field: "location" },
        { field: "protected", type: "boolean" },
        { field: "verified", type: "boolean" },
        { field: "marked", type: "boolean" },
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
