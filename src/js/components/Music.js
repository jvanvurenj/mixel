import React from "react";
import { connect } from "react-redux";

const mapStateToProps = state => {
    return { music: state.music };
};

const MusicShow = ({ music }) => (
    <div>
        <p>{music}</p>
    </div>
);

const Music = connect(mapStateToProps)(MusicShow);

export default Music;
