import React from "react";

const HistogramBar = ({ percent, x, y, width, height }) => {
    let translate = `translate(${x}, ${y})`,
        label = percent.toFixed(0) + "%";

    if (percent < 1) {
        label = percent.toFixed(2) + "%";
    }

    if (width < 20) {
        label = label.replace("%", "");
    }

    if (width < 10) {
        label = "";
    }

    return (
        <g transform={translate} className="bar">
            <rect
                width={width}
                height={height - 2}
                transform="translate(0, 1)"
            />
            <text textAnchor="end" x={width - 5} y={height / 2 + 3}>
                {label}
            </text>
        </g>
    );
};

export default HistogramBar;
