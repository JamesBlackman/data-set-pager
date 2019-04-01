import React, { Component } from "react";
import Moment from "react-moment";
class DataSetPagerRow extends Component {
  constructor(props) {
    super(props);
    this.clickCommand = this.clickCommand.bind(this);
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }
  handleKeyPress = event => {
    if (event.key === "Enter" && this.props.index === this.props.selectedRow) {
      this.runCommand();
    }
  };

  clickCommand = event => {
    event.preventDefault();
    this.runCommand();
  };

  runCommand() {
    if (!this.props.command && !this.props.target) return false;
    if (this.props.command) {
      console.log("COMMAND=", this.props.rowData[this.props.command]);
      fetch(this.props.rowData[this.props.command]);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      var params = [];
      this.props.targetParamsCarry &&
        this.props.targetParamsCarry.map(p => {
          params.push(p + "=" + urlParams.get(p));
        });
      this.props.targetParams &&
        this.props.targetParams.map(p => {
          params.push(p + "=" + this.props.rowData[p]);
        });
      var paramsUrl = params.join("&") + "&";

      if (this.props.targetHash) {
        paramsUrl = paramsUrl + "/" + this.props.targetHash;
      }
      console.log("params", paramsUrl);
      window.location = this.props.target + "?" + paramsUrl;
    }
  }
  render() {
    const { rowData, selectedRow, index } = this.props;
    const { clientID, clientName, requestCount } = rowData;
    return (
      <tr
        key={this.props.uniqueKey}
        className={index === selectedRow ? "selected" : ""}
      >
        {this.props.columns.map((c, i) => (
          <td key={i}>
            <a href="#" onClick={this.clickCommand}>
              {c.type === "date" ? (
                <Moment
                  format="D MMM YYYY HH:mm:ss"
                  withTitle
                  date={rowData[c.column]}
                />
              ) : (
                rowData[c.column]
              )}
            </a>
          </td>
        ))}
      </tr>
    );
  }
}

export default DataSetPagerRow;
