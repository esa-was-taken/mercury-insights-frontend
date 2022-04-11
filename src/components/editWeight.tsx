import { TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../constants";
import { useMutation } from "react-query";

export default function EditWeight(props: {
    username: string;
    weight: number;
}) {
    const [weight, setWeight] = useState(props.weight);
    const [proposedWeight, setProposedWeight] = useState(props.weight);

    const [editable, setEditable] = useState(false);

    const updateWeight = useMutation(
        (params: { username: string; weight: number }) =>
            axios.post(`${API_URL}/user/weight`, {
                username: params.username,
                weight: params.weight,
            }),
        {
            onSuccess: (data) => {
                setWeight(proposedWeight);
                setEditable(false);
                console.log(data);
            },
            onError: () => {
                alert("Failed to update user.");
            },
        }
    );

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 100 }}>
                <TextField
                    size="small"
                    value={editable ? proposedWeight : weight}
                    disabled={!editable}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value !== "") {
                            setProposedWeight(parseFloat(e.target.value));
                        } else {
                            setProposedWeight(0);
                        }
                    }}
                />
            </div>
            <div>
                {editable ? (
                    <div>
                        <div
                            onClick={() => {
                                if (proposedWeight !== weight) {
                                    updateWeight.mutate({
                                        username: props.username,
                                        weight: proposedWeight,
                                    });
                                } else {
                                    setEditable(false);
                                }
                            }}
                        >
                            <CheckIcon />
                        </div>
                        <div
                            onClick={() => {
                                setEditable(false);
                            }}
                        >
                            <CancelIcon />
                        </div>
                    </div>
                ) : (
                    <div onClick={() => setEditable(true)}>
                        <EditIcon />
                    </div>
                )}
            </div>
        </div>
    );
}
