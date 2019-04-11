import React, { Component } from "react";
import axios from "axios";
import DataSetPagerRow from "./data-set-pager-row";
class DataSetPager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      skip: 0,
      searchTerm: "",
      searchTotal: 0,
      pageSize: this.props.pageSize || 10,
      selectedRow: 0,
      serviceDown: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.nextLine = this.nextLine.bind(this);
    this.prevLine = this.prevLine.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    this.startSearch();
    document.addEventListener("keydown", this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }
  componentWillReceiveProps(props) {
    this.startSearch();
  }

  handleKeyPress(event) {
    if (event.key === "ArrowDown") {
      this.nextLine();
    }
    if (event.key === "ArrowUp") {
      this.prevLine();
    }
  }
  upButtonHandler(e) {
    this.doPrevPage();
  }
  downButtonHandler(e) {
    this.doNextPage();
  }

  nextLine(e) {
    // e.preventDefault();
    if (
      this.state.selectedRow === this.state.searchResults.length - 1 &&
      this.state.skip ===
        parseInt((this.state.searchTotal - 1) / this.state.pageSize)
    )
      return false;
    if (this.state.selectedRow === this.state.searchResults.length - 1) {
      this.setState({ selectedRow: 0 });
      this.doNextPage();
    } else {
      var selectedRow = this.state.selectedRow + 1;
      this.setState({ selectedRow });
    }
  }
  prevLine(e) {
    // e.preventDefault();
    if (this.state.selectedRow === 0 && this.state.skip === 0) return false;
    if (this.state.selectedRow === 0) {
      this.setState({ selectedRow: this.state.pageSize - 1 }, () => {
        this.doPrevPage();
      });
    } else {
      var selectedRow = this.state.selectedRow - 1;
      this.setState({ selectedRow });
    }
  }
  prevPage(e) {
    e.preventDefault();
    this.doPrevPage();
  }
  doPrevPage() {
    if (this.state.skip === 0) return false;
    var nextSkip = this.state.skip - 1;
    this.setState({ skip: nextSkip }, () => {
      this.startSearch();
    });
  }
  nextPage(e) {
    e.preventDefault();
    this.doNextPage();
  }
  doNextPage() {
    if (
      this.state.skip ===
      parseInt((this.state.searchTotal - 1) / this.state.pageSize)
    )
      return false;
    var nextSkip = this.state.skip + 1;
    this.setState({ skip: nextSkip, selectedRow: 0 }, () => {
      this.startSearch();
    });
  }
  handleChange(event) {
    this.setState({ skip: 0, searchTerm: event.target.value }, () => {
      this.startSearch();
    });
  }
  startSearch() {
    axios
      .get(
        `${this.props.url}?skip=${this.state.skip}&searchterm=${
          this.state.searchTerm
        }&pagesize=${this.state.pageSize}`
      )
      .then(res => {
        this.setState({
          searchResults: res.data,
          searchTotal: res.headers["list-length"] || res.data.length,
          serviceDown: false
        });
      })
      .catch(error => {
        this.setState({ serviceDown: true, searchResults: [] });
      });
  }
  render() {
    // const throttleSearch = _.debounce(this.startSearch(), 300);
    const ItemComponent = this.props.component || DataSetPagerRow;
    const searchResults = this.state.searchResults.map((rowData, index) => (
      <ItemComponent
        key={rowData[this.props.uniqueKey]}
        uniqueKey={rowData[this.props.uniqueKey]}
        rowData={rowData}
        methods={this.props.methods}
        dsParams={this.props.dsParams}
        selectedRow={this.state.selectedRow}
        index={index}
        columns={this.props.columns}
        target={this.props.target}
        targetParams={this.props.targetParams}
        targetParamsCarry={this.props.targetParamsCarry}
        targetHash={this.props.targetHash}
        command={this.props.command}
      />
    ));

    return (
      <div>
        <div className="App">
          {/* <h4>{this.props.title}</h4> */}
          {this.state.serviceDown && (
            <h3 style={{ color: "red" }}>Service is down</h3>
          )}
          <div>
            <a
              onClick={this.prevPage}
              disabled={this.state.skip === 0 && "disabled"}
              href="#void"
              accessKey=","
            >
              &lt;&lt;
            </a>
            <input
              type="text"
              value={this.state.searchTerm}
              onChange={this.handleChange}
              autoComplete="false"
              placeholder="Search..."
              accessKey="s"
            />
            <a
              onClick={this.nextPage}
              disabled={
                this.state.skip + 1 ===
                  parseInt((this.state.searchTotal - 1) / this.state.pageSize) +
                    1 && "disabled"
              }
              href="#void"
              accessKey="."
            >
              &gt;&gt;
            </a>
            <br />
            <h5>
              Page {this.state.skip + 1} of{" "}
              {parseInt((this.state.searchTotal - 1) / this.state.pageSize) + 1}
              . Found {this.state.searchTotal} {this.props.title}.
            </h5>
          </div>
          {this.props.children}
          {!this.props.headerless && (
            <table
              style={{ textAlign: "left", tableLayout: "fixed", width: "100%" }}
            >
              <thead>
                <tr>
                  {this.props.columns.map(
                    /* Allow hidden column */
                    c => c.display && <th key={c.column}>{c.display}</th>
                  )}
                </tr>
              </thead>
              <tbody>{searchResults}</tbody>
            </table>
          )}
          {/* Allow headerless render */}
          {this.props.headerless && searchResults}
          <div style={{ display: "none" }}>
            <a onClick={this.prevLine} href="#void" accessKey="'">
              Up
            </a>
            <a onClick={this.nextLine} href="#void" accessKey="/">
              Down
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default DataSetPager;
