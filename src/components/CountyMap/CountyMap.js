import React from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import _ from "lodash";

import County from "./County";

class CountyMap extends React.Component {
    constructor(props) {
        super(props);

        const projection = d3.geoAlbersUsa().scale(1280);

        this.state = {
            geoPath: d3.geoPath().projection(projection),
            quantize: d3.scaleQuantize().range(d3.range(9)),
            projection
        };
    }

    static getDerivedStateFromProps(props, state) {
        let { projection, quantize, geoPath } = state;

        projection
            .translate([props.width / 2, props.height / 2])
            .scale(props.width * 1.3);

        if (props.zoom && props.usTopoJson) {
            const us = props.usTopoJson,
                USstatePaths = topojson.feature(us, us.objects.states).features,
                id = _.find(props.USstateNames, { code: props.zoom }).id;

            projection.scale(props.width * 4.5);

            const centroid = geoPath.centroid(_.find(USstatePaths, { id: id })),
                translate = projection.translate();

            projection.translate([
                translate[0] - centroid[0] + props.width / 2,
                translate[1] - centroid[1] + props.height / 2
            ]);
        }

        if (props.values) {
            quantize.domain([
                d3.quantile(props.values, 0.15, d => d.value),
                d3.quantile(props.values, 0.85, d => d.value)
            ]);
        }

        return {
            ...state,
            projection,
            quantize
        };
    }

    render() {
        const { usTopoJson, values, zoom } = this.props,
            { geoPath, quantize } = this.state;

        if (!usTopoJson) {
            return null;
        } else {
            const us = usTopoJson,
                USstatesMesh = topojson.mesh(
                    us,
                    us.objects.states,
                    (a, b) => a !== b
                ),
                counties = topojson.feature(us, us.objects.counties).features;

            const countyValueMap = _.fromPairs(
                values.map(d => [d.countyID, d.value])
            );

            return (
                <g>
                    {counties.map(feature => (
                        <County
                            geoPath={geoPath}
                            feature={feature}
                            zoom={zoom}
                            key={feature.id}
                            quantize={quantize}
                            value={countyValueMap[feature.id]}
                        />
                    ))}

                    <path
                        d={geoPath(USstatesMesh)}
                        style={{
                            fill: "none",
                            stroke: "#fff",
                            strokeLineJoin: "round"
                        }}
                    />
                </g>
            );
        }
    }
}

export default CountyMap;
