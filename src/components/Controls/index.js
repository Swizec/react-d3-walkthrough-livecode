import React from "react";
import ControlRow from "./ControlRow";

class Controls extends React.Component {
    state = {
        yearFilter: () => true,
        year: "*"
    };

    componentDidMount() {}

    updateYearFilter = (year, reset) => {
        let filter = d => d.submit_date.getFullYear() === year;

        if (reset || !year) {
            filter = () => true;
            year = "*";
        }

        this.setState(
            {
                yearFilter: filter,
                year: year
            },
            () => this.reportUpdateUpTheChain()
        );
    };

    render() {
        const { data } = this.props;

        return null;
    }
}

export default Controls;
