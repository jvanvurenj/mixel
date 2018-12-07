import React, { Component } from 'react';
import { Select } from './Select';
import { connect } from 'react-redux';
import { setInstrument, setScale, setSpeed, setNumNotes } from '../actions';

class Instrument extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.props[name](value);
  }

  render() {
    return (
      <div>
        <Select
          name={"setInstrument"}
          value={this.props.instrument}
          options={this.props.instNames}
          handleChange={this.handleChange}
          label={"Instrument:"}
        />
        <Select
          name={"setScale"}
          value={this.props.scale}
          options={this.props.scales}
          handleChange={this.handleChange}
          label={"Scale:"}
        />
        <Select
          name={"setSpeed"}
          value={this.props.speed}
          options={this.props.speeds}
          handleChange={this.handleChange}
          label={"Speed:"}
        />
        <Select
          name={"setNumNotes"}
          value={this.props.numNotes}
          options={this.props.numNotesOps}
          handleChange={this.handleChange}
          label={"Number of Notes:"}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const instrument = state.instrument;
  const instNames = ownProps.instNames; //passed from parent
  const scale = state.scale;
  const scales = ownProps.scales;
  const speed = state.speed;
  const speeds = ownProps.speeds;
  const numNotes = state.numNotes;
  const numNotesOps = ownProps.numNotesOps;
  return { instrument, instNames, scale, scales, speed, speeds, numNotes, numNotesOps };
}

export default connect(
  mapStateToProps,
  { setInstrument, setScale, setSpeed, setNumNotes }
)(Instrument);
