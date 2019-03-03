import React, { useMemo } from "react";
import * as d3 from "d3";

import HistogramBar from "./HistogramBar";
import Axis from "./Axis";

function makeBar({ bar, yScale, widthScale, N, axisMargin }) {
    let percent = (bar.length / N) * 100;

    let props = {
        percent,
        x: axisMargin,
        y: yScale(bar.x1),
        width: widthScale(bar.length),
        height: yScale(bar.x0) - yScale(bar.x1),
        key: `histogram-bar-${bar.x0}`
    };

    return <HistogramBar {...props} />;
}

function useD3Stuff({
    bins,
    value,
    data,
    width,
    axisMargin,
    height,
    y,
    bottomMargin
}) {
    const bars = useMemo(
        () =>
            d3
                .histogram()
                .thresholds(bins)
                .value(value)(data),
        [bins, value, data]
    );

    const widthScale = useMemo(() => {
        const counts = bars.map(d => d.length);
        return d3
            .scaleLinear()
            .domain([d3.min(counts), d3.max(counts)])
            .range([0, width - axisMargin]);
    }, [width, axisMargin, bars]);

    const yScale = useMemo(
        () =>
            d3
                .scaleLinear()
                .domain([0, d3.max(bars, d => d.x1)])
                .range([height - y - bottomMargin, 0]),
        [height, y, bottomMargin, bars]
    );

    return { bars, widthScale, yScale };
}

function Histogram({
    x,
    y,
    width,
    height,
    data,
    axisMargin,
    bottomMargin,
    bins,
    value
}) {
    const { bars, widthScale, yScale } = useD3Stuff({
        bins,
        value,
        data,
        width,
        axisMargin,
        height,
        y,
        bottomMargin
    });

    const N = data.length;

    return (
        <g className="histogram" transform={`translate(${x}, ${y})`}>
            <g className="bars">
                {bars.map(bar =>
                    makeBar({ bar, yScale, widthScale, N, axisMargin })
                )}
            </g>
            <Axis x={axisMargin - 3} y={0} data={bars} scale={yScale} />
        </g>
    );
}

export default Histogram;
