import React, { useState, useEffect } from "react";

import ProgressBar from "./Progress";

const ProgressBars = () => {

    const [value, setValue] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setValue(oldValue => {
                const newValue = oldValue + 10;

                if (newValue === 100) {
                    clearInterval(interval);
                }

                return newValue;
            });
        }, 1300);
    }, []);

    return (
        <ProgressBar color={"#ff7979"} width={"150px"} value={value} max={100} />
    )
}

export default ProgressBars;
