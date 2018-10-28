import React from "react";
import * as d3 from "d3";

class Histogram extends React.Component {
    state = {
        histogram: d3.histogram(),
        widthScale: d3.scaleLinear(),
        yScale: d3.scaleLinear()
    };

    static getDerivedStateFromprops(props, state) {
        let { histogram, widthScale, yScale } = state;

        return {
            ...state,
            histogram,
            widthScale,
            yScale
        };
    }

    makeBar = (bar, N) => {
        const { yScale, widthScale } = this.state;
    };

    render() {
        const { histogram, yScale } = this.state,
            { x, y, data, axisMargin } = this.state;

        return null;
    }
}

export default Histogram;
