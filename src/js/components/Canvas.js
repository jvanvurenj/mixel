import React, { Component } from "react";
import { connect } from "react-redux";
import { addImage } from "../actions/index";
import { setMode } from "../actions/index";
import { SketchField } from "react-sketch";
import { dataURLToBlob } from 'blob-util';
import getPixels from "get-pixels";
import Konva from "konva";
import { Layer, Stage, Line } from "react-konva";
import "../../css/Canvas.css";

const mapDispatchToProps = dispatch => {
  return {
    addImage: image => dispatch(addImage(image)),
    setMode: mode => dispatch(setMode(mode))
  };
};

const mapStateToProps = state => {
  console.log(state); // for testing state update
  const pos = state.pos;
  return { pos };
}

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.colors = [{color: "#B95151", colorname: "Red"},
                   {color: "#51B977", colorname: "Green"},
                   {color: "#9A51B9", colorname: "Purple"},
                   {color: "#D8B83A", colorname: "Yellow"}];

    this.state = {
      image: null,
      imageData: null,
      changeModeClicked: false,
      lineColor: '#B95151',
      line: null
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleChangeMode = this.handleChangeMode.bind(this);
  }

  /* Handle event when a user saves their drawing, allowing the user to
   * download the image and upload it for playback.
   */
  handleSave() {
    let imageURL = this.canvas.toDataURL('image/png');
    let fileBlob = dataURLToBlob(imageURL);
    let fReader = new FileReader();
    if (!fileBlob) {
      console.error("onImageUpload: No valid file given.");
      return;
    }

    fReader.onload = e => {
      let img = new window.Image();
      img.src = fReader.result;
      var line = new Konva.Line();

      getPixels(img.src, (err, pixels) => {
        if (err) {
          console.err("Pixel Data: Cannot process image provided.");
          return;
        }
        this.props.addImage(pixels);
        this.setState({
          image: img,
          imageData: pixels,
          line: line
      }, () => {
        this.state.line.width(window.innerWidth/this.state.imageData.shape[0]);
        });
      });
    };
    fReader.readAsDataURL(fileBlob);
  }

  /* Handle event where the user changes the color of the pencil */
  handleColorChange(event) {
    let colorValue = event.target.value;
    this.setState({ lineColor: colorValue });
  }

  /* Handle event where the user wants to change to image upload mode.
   * On setState, will re-render DOM according to logic in component return
   * statement.
   */
  handleChangeMode() {
    this.props.setMode("Board");
  }

  render() {
    //DivStyle used to overlay the line with the drawing canvas (Canvas is different from React, SketchField can't go in Layer)
    var divStyle = {
      position: 'absolute',
      top: 45,
      left: 0
    };
    const colorTags = this.colors.map(item => (
      <option value={item.color}>{item.colorname}</option>
    ));
    let content = (
        <React.Fragment>
        <Stage width={window.innerWidth} height={window.innerHeight / 1.5} >
            <Layer>
          
              {this.state.line && <Line
                line = {this.state.line}
                points= {[this.props.pos*(window.innerWidth/this.state.imageData.shape[0]), 0, this.props.pos*(window.innerWidth/this.state.imageData.shape[0]), window.innerHeight]}
                stroke= {'green'}
                strokeWidth= {3*window.innerWidth/this.state.imageData.shape[0]}
                opacity = {.5}
              />}
            </Layer>
          </Stage>
        </React.Fragment>
      );
    let content2 = (
        <React.Fragment>
          <select onChange={this.handleColorChange}>{colorTags}</select>
              <SketchField
                width={window.innerWidth}
                height={window.innerHeight / 1.5}
                lineColor={this.state.lineColor}
                lineWidth={3}
                ref={canvas => {
                  // REFERENCE: allow us to access the canvas element from outside render()
                  this.canvas = canvas;
                }}
              />
          
          <button type="submit" onClick={this.handleSave}>
            Save Image
          </button>
        </React.Fragment>
      );

    return (
      <div>
        <button type="submit" onClick={this.handleChangeMode}>
          Image Mode
        </button>
        <div style={divStyle}>{content}</div>
        <div>{content2}</div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas);
