import React, { Component } from 'react';
import { connect } from "react-redux";
import '../../css/App.css';
import Music from "./Music";
import MusicComp from "./MusicComp";
import Board from "./Board";
import Canvas from "./Canvas";

class App extends Component {
  render() {
    return (
      <div className="App">
        {this.props.mode === "Board" ? <Board /> : <Canvas />}
        <MusicComp />
        <Music />
      </div>
    );
  }
}

const mapStatetoProps = state => {
  const mode = state.mode;
  return { mode };
}

export default connect(
  mapStatetoProps,
  null
)(App);
