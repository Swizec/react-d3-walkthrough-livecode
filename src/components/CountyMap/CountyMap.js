import React, { useMemo } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import _ from "lodash";

import County from "./County";

function useQuantize(values) {
    return useMemo(
        () =>
            d3
                .scaleQuantize()
                .range(d3.range(9))
                .domain([
                    d3.quantile(values, 0.15, d => d.value),
                    d3.quantile(values, 0.85, d => d.value)
                ]),
        [values]
    );
}

function useGeoPath({ width, height, zoom, usTopoJson, USstateNames }) {
    return useMemo(() => {
        let projection = d3.geoAlbersUsa().scale(1280);
        let geoPath = d3.geoPath().projection(projection);

        projection.translate([width / 2, height / 2]).scale(width * 1.3);

        if (zoom && usTopoJson) {
            const us = usTopoJson,
                USstatePaths = topojson.feature(us, us.objects.states).features,
                id = _.find(USstateNames, { code: zoom }).id;

            projection.scale(width * 4.5);

            const centroid = geoPath.centroid(_.find(USstatePaths, { id: id })),
                translate = projection.translate();

            projection.translate([
                translate[0] - centroid[0] + width / 2,
                translate[1] - centroid[1] + height / 2
            ]);
        }

        return geoPath;
    }, [width, height, zoom, usTopoJson, USstateNames]);
}

function CountyMap({ width, height, usTopoJson, values, zoom, USstateNames }) {
    const quantize = useQuantize(values);

    const geoPath = useGeoPath({
        width,
        height,
        zoom,
        usTopoJson,
        USstateNames
    });

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

export default CountyMap;
