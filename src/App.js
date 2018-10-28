import React, { Component } from "react";
import * as d3 from "d3";
import _ from "lodash";

import "./style.css";

import Preloader from "./components/Preloader";
import { loadAllData } from "./DataHandling";

import CountyMap from "./components/CountyMap";
import Histogram from "./components/Histogram";
import { Title, Description } from "./components/Meta";
import MedianLine from "./components/MedianLine";

class App extends Component {
    state = {
        techSalaries: [],
        medianIncomes: [],
        countyNames: [],
        filteredBy: {
            USstate: "*",
            year: "*",
            jobTitle: "*"
        }
    };

    componentDidMount() {
        loadAllData(data => this.setState(data));
    }

    countyValue(county, techSalariesMap) {
        const medianHousehold = this.state.medianIncomes[county.id],
            salaries = techSalariesMap[county.name];

        if (!medianHousehold || !salaries) {
            return null;
        }

        const median = d3.median(salaries, d => d.base_salary);

        return {
            countyID: county.id,
            value: median - medianHousehold.medianIncome
        };
    }

    render() {
        const {
            techSalaries,
            countyNames,
            usTopoJson,
            USstateNames,
            filteredBy
        } = this.state;

        if (techSalaries.length < 1) {
            return <Preloader />;
        }

        const filteredSalaries = techSalaries,
            filteredSalariesMap = _.groupBy(filteredSalaries, "countyID"),
            countyValues = countyNames
                .map(county => this.countyValue(county, filteredSalariesMap))
                .filter(d => !_.isNull(d));

        let zoom = null,
            medianHousehold = this.state.medianIncomesByUSState["US"][0]
                .medianIncome;

        return (
            <div className="App container">
                <Title data={filteredSalaries} filteredBy={filteredBy} />
                <Description
                    data={filteredSalaries}
                    allData={techSalaries}
                    filteredBy={filteredBy}
                    medianIncomesByCounty={this.state.medianIncomesByCounty}
                />
                <svg width="1100" height="500">
                    <CountyMap
                        usTopoJson={usTopoJson}
                        USstateNames={USstateNames}
                        values={countyValues}
                        x={0}
                        y={0}
                        width={500}
                        height={500}
                        zoom={zoom}
                    />
                    <Histogram
                        bins={10}
                        width={500}
                        height={500}
                        x={500}
                        y={10}
                        data={filteredSalaries}
                        axisMargin={83}
                        bottomMargin={5}
                        value={d => d.base_salary}
                    />
                    <MedianLine
                        data={filteredSalaries}
                        x={500}
                        y={10}
                        width={600}
                        height={500}
                        bottomMargin={5}
                        median={medianHousehold}
                        value={d => d.base_salary}
                    />
                </svg>
            </div>
        );
    }
}

export default App;
