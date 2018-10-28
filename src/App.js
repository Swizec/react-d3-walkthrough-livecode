import React, { Component } from "react";

import Preloader from "./components/Preloader";

class App extends Component {
    state = {
        techSalaries: []
    };

    render() {
        const { techSalaries } = this.state;

        if (techSalaries.length < 1) {
            return <Preloader />;
        }

        return <div className="App" />;
    }
}

export default App;
