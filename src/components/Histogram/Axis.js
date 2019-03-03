import * as d3 from "d3";
import React from "react";
import { useD3 } from "d3blackbox";

function Axis({ x, y, scale, data }) {
    const anchorRef = useD3(function(anchorRef) {
        const axis = d3
            .axisLeft()
            .tickFormat(d => `${d3.format(".2s")(d)}`)
            .scale(scale)
            .ticks(data.length);

        d3.select(anchorRef).call(axis);
    });

    return <g transform={`translate(${x}, ${y})`} ref={anchorRef} />;
}

export default Axis;
