import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import moment from "moment";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";

import "./App.css";

interface RandomApi {
  name: string,
  address: string,
  birthday: string,
  gender: string,
  country: string
}

export default class App extends Component {

  state = { rows: { data: Array<RandomApi>() }, copy: { data: Array<RandomApi>() }, sortDirection: "ASC", loading: true }

  componentDidMount() {
    fetch(`https://randomapi.com/api/s8plzshd?key=JQKX-0TJI-QH86-6ERM`)
      .then(response => response.json())
      .then(({ results }) => {
        const data = results[0];
        this.setState({ rows: data, copy: data, loading: false })
      });
  }

  getNewData = () => {
    fetch(`https://randomapi.com/api/s8plzshd?key=JQKX-0TJI-QH86-6ERM`)
      .then(response => response.json())
      .then(({ results }) => {
        const data = results[0];
        this.setState({ rows: data, copy: data, loading: false })
      });
  }

  filterData = (event: React.ChangeEvent) => {
    event.preventDefault()
    const input = event.target as HTMLInputElement
    const { rows: { data }, copy: { data: previous } } = this.state
    const newData = data.filter(d => d.name.includes(input.value))
    if (input.value) {
      this.setState({ rows: { data: newData } })
    } else {
      this.setState({ rows: { data: previous } })
    }
  }

  handleSort = (sort: string) => {
    const { rows: { data }, sortDirection } = this.state
    let newData = []
    if (sortDirection === "ASC") {
      this.setState({ sortDirection: "DESC" })
      newData = data.sort((a: any, b: any) => (a[sort] < b[sort]) ? 1 : -1)
    } else {
      this.setState({ sortDirection: "ASC" })
      newData = data.sort((a: any, b: any) => (a[sort] > b[sort]) ? 1 : -1)
    }
    this.setState({ rows: { data: newData } })
  }

  render() {
    const { rows: { data }, loading } = this.state;

    return data.length > -1 ?
      <div style={bodyStyles}>
        <div style={headerStyles}>
          <Button variant="contained" onClick={this.getNewData}>
            Refresh
          </Button>
          <div style={{ width: "30%" }}>
            <TextField
              label="Search"
              id="outlined-bare"
              placeholder="Search for a name here"
              margin="normal"
              variant="outlined"
              inputProps={{ "aria-label": "bare" }}
              onChange={this.filterData}
              fullWidth={true}
            />
          </div>
        </div>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => this.handleSort("name")}>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell onClick={() => this.handleSort("birthday")}>Birthday</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Country</TableCell>
              </TableRow>
            </TableHead>
            {!loading ?
              <TableBody>
                {data.map((d, index) =>
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {d.name}
                    </TableCell>
                    <TableCell>{d.address}</TableCell>
                    <TableCell>{moment().diff(d.birthday, 'years') + " years ago"}</TableCell>
                    <TableCell>{d.gender}</TableCell>
                    <TableCell>{d.country}</TableCell>
                  </TableRow>
                )}
              </TableBody> : <TableBody>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell align="center"><CircularProgress /></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableBody>}
          </Table>
        </Paper>
      </div>
      : <div><h1 style={loadingStyles}>Table is still loading. . .</h1><LinearProgress color="secondary" /></div>
  };
}

const headerStyles = {
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  marginBottom: "20px"
}

const bodyStyles = {
  marginTop: "20px",
  marginBottom: "20px"
}

const loadingStyles = {
  textAlign: "center" as "center"
}
