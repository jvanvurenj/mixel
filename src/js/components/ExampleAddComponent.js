import React, { Component } from "react";
import { connect } from "react-redux";
import { addMusic } from "../actions/index";

const mapDispatchToProps = dispatch => {
    return {
        addMusic: music => dispatch(addMusic(music))
    };
};

class MusicForm extends Component {
    constructor() {
        super();

        this.state = {
            songTitle: ""
        };
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        const { songTitle } = this.state;
        this.props.addMusic(songTitle);
        this.setState({ songTitle: "" });
    }

    render() {
        const { songTitle } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <label htmlFor={songTitle}>Song Title</label>
                <input
                    type="text"
                    id="songTitle"
                    value={songTitle}
                    onChange={this.handleChange}
                />
            <button type="submit">
                SAVE
            </button>
            </form>
        );
    }
}

const Form = connect(null, mapDispatchToProps)(MusicForm);

export default Form;