import React, { Component } from "react";
import * as d3 from "d3";
import _ from "lodash";

import Preloader from "./components/Preloader";
import { loadAllData } from "./DataHandling";

class App extends Component {
    state = {
        techSalaries: [],
        medianIncomes: [],
        countyNames: []
    };

    componentDidMount() {
        loadAllData(data => this.setState(data));
    }

    render() {
        const { techSalaries } = this.state;

        if (techSalaries.length < 1) {
            return <Preloader />;
        }

        return (
            <div className="App container">
                <h1>Loaded {techSalaries.length} salaries</h1>
            </div>
        );
    }
}

export default App;
