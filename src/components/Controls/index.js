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

    reportUpdateUpTheChain() {
        window.location.hash = [this.state.year || "*"].join("-");

        this.props.updateDataFilter(
            (filters => {
                return d => filters.yearFilter(d);
            })(this.state),
            {
                year: this.state.year
            }
        );
    }

    render() {
        const { data } = this.props;

        const years = new Set(data.map(d => d.submit_date.getFullYear()));

        return (
            <div>
                <ControlRow
                    data={data}
                    toggleNames={Array.from(years.values())}
                    picked={this.state.year}
                    updateDataFilter={this.updateYearFilter}
                />
            </div>
        );
    }
}

export default Controls;
