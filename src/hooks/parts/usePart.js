import { useState, useEffect } from "react";
import useParts from "./useParts";

const usePart = (partId) => {
    const {
        parts,
        isLoading,
        error,
        mutate
    } = useParts();

    const [part, setPart] = useState();
    useEffect(() => {
        setPart(parts?.find(part => part._id === partId));
    }, [parts])

    return { part, isLoading, error, mutate };
}

export default usePart;