import React, { Component } from "react";
import { connect } from "react-redux";
import { addImage, setMode } from "../actions/index";
import { Stage, Layer, Image, Line } from "react-konva";
import getPixels from "get-pixels";
import Konva from "konva";
import "../../css/Board.css";

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

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      imageData: null,
      buttonClicked: false,
      line: null
    };

    this.onImageUpload = this.onImageUpload.bind(this);
    this.handleDrawing = this.handleDrawing.bind(this);
  }

  handleDrawing() {
    this.props.setMode("Canvas");
  }


  /* Event handler that handles image input from input element. Utilizes getPixels library to
   * return an ndarray to the global state. The image data is accessed by MusicComp.
   * Note the usage of async patterns - waits for image to be processed as data URL prior to
   * state update.
   */
  onImageUpload(event) {
    let newImageFile = event.target.files[0];
    let fReader = new FileReader();
    if (!newImageFile) {
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
          //console.log("**************");
          this.state.line.width(window.innerWidth/this.state.imageData.shape[0]);
          //this.state.line.draw();
        });
      });
    };
    fReader.readAsDataURL(newImageFile);
    
  }

  render() {
    let content;

    /* If the user has chosen to change the mode, the content of the page should be the Canvas
     * and not the image board. Otherwise, set the content to be rendered to the Board component.
     */
    content = (
      <React.Fragment>
        <input
          type="file"
          onChange={this.onImageUpload}
          accept="image/png, image/jpeg"
        />
        <button type="submit" onClick={this.handleDrawing}>
          Draw
        </button>
        <Stage width={window.innerWidth} height={window.innerHeight / 1.5}>
          <Layer>
            <Image
              image={this.state.image}
              ref={node => {
                this.imageNode = node;
              }}
              width={window.innerWidth}
              height={window.innerHeight / 1.5}
            />
            
            {this.state.line && <Line
              line = {this.state.line}
              points= {[(this.props.pos-3)*(window.innerWidth/this.state.imageData.shape[0]), 0, (this.props.pos-3)*(window.innerWidth/this.state.imageData.shape[0]), window.innerHeight]}
              stroke= {'green'}
              strokeWidth= {3*window.innerWidth/this.state.imageData.shape[0]}
              opacity = {.5}
            />}
            
          </Layer>
        </Stage>
      </React.Fragment>
    );

    return (
      <div>
        <div>{content}</div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
