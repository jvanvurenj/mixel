import React, { Component } from 'react';
import MIDISounds from 'midi-sounds-react';
import '../../css/MusicComp.css';
import { IoIosPause, IoIosPlay } from 'react-icons/io';
import { IconContext } from 'react-icons';
import { connect } from 'react-redux';
import { setPlayPause, setPos } from '../actions';
import Instrument from './MusicOps';

class MusicComp extends Component {
  constructor(props) {
    super(props);

    this.pos = 0; // pos == colummn in ndarray
    this.playingHandle = null;

    this.instruments = { "Flute": 774, "Violin": 449, "String Ensemble": 546, "Grand Piano": 16, "Electric Piano": 65, "Church Organ": 182, "Accordion": 213, "Trumpet": 620, "French Horn": 651, "Oboe": 730, "Sitar": 1120, "Synth Pad": 930, "Synth Lead (chiff)": 870, "Synth Lead (calliope)": 857, "Electric Guitar": 879 };

    //lists of scales in C
    this.scales = { "Major": [0, 2, 4, 5, 7, 9, 11], "Natural Minor": [0, 2, 3, 5, 7, 8, 10], "Harmonic Minor": [0, 2, 3, 5, 7, 8, 11] };

    this.speeds = { "1x": .5, "1/2x": 1, "2x": .25, "3x": .125 };
    this.numNotesOps = { "1": 1, "3": 3, "5": 5, "10+": 100 };

    this.playNextNote = this.playNextNote.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
  }

  //cache each instrument to avoid loading wait and skipped notes
  componentDidMount() {
    Object.values(this.instruments).forEach(value => {
      this.midiSounds.cacheInstrument(value);
    });
  }


  /* plays each note/rhythm from the arrays and waits until the note has 
   * finshed sounding before playing the next one */
  playNextNote() {
    let image = this.props.image;
    let notesLength = image.shape[0]; // Corresponds to image width
    let chordHeight = image.shape[1]; // Corresponds to image height
    let val;
    const speed = this.props.speed;

    /* Construct current chord. Reads from left to right; in other words
     * each chord is a column of the image data.
     * Array is constructed via rgba channel pixel data at coords 
     * (currentCol, pixel, channel) 
     */
    let currentChord = Array.from(
      new Array(chordHeight), 
      (x, i) => {
        let r = image.get(this.pos, i, 0), g = image.get(this.pos, i, 1), b = image.get(this.pos, i, 2), a = image.get(this.pos, i, 3);
        let pix = (r + g + b + a) / 4;

        //take average rgba value and scale from 0 to 96
        if(pix > 140) {
          return Math.ceil((chordHeight - i) / chordHeight * 96);
        }
        return 0;
      }
    );

    //remove duplicates and values not in the current scale
    currentChord = [...new Set(currentChord)];
    currentChord = currentChord.filter((value) => {
      if(value >= 12) { //octave 0
        val = value;
        if(this.scales[this.props.scale].includes(value % 12)) {
          return true;
        } 
      }
      return false;
    });

    //limit notes played according to user preference
    currentChord = currentChord.slice(0, this.numNotesOps[this.props.numNotes]);

    //make sure there is at least 1 note if something is supposed to be played
    //regardless of whether the note is in the scale or not
    if(currentChord.length === 0 && val) {
      currentChord = [val];
    }

    // Play chosen notes in the current column
    this.midiSounds.playChordNow(this.instruments[this.props.instrument], currentChord, this.speeds[speed]);
    
    this.pos += 3; //increment position by 3
    this.props.setPos(this.pos);
    if(this.pos < notesLength) {
      this.playingHandle = window.setTimeout(this.playNextNote, this.speeds[speed] * 1000);
    } else { //last note
      window.setTimeout(() => {
        this.props.setPlayPause(false);
      },
      this.speeds[speed] * 1000);
      this.pos = 0;
      this.props.setPos(this.pos);
    }
  }

  play() {
    if(!this.props.image) {
      return;
    }
    window.clearTimeout(this.playingHandle);
    this.props.setPlayPause(true);
    this.playNextNote();
  }

  /* pauses the sequence and accounts for the condition when playNextNote has
   * entered its if statement and will play a note after cancelQueue has been
   * called. */
  pause(e) {
    window.clearTimeout(this.playingHandle);
    this.props.setPlayPause(false);
    this.midiSounds.cancelQueue();
  }

  render() {
    const isPlaying = this.props.isPlaying;
    let playButton;

    //choose which button to render
    if (!isPlaying || this.props.image == null) {
      playButton = <IoIosPlay onClick={this.play} />;
    } else {
      playButton = <IoIosPause onClick={this.pause} />;
    }

    return (
        <div className="MusicComp">
          <IconContext.Provider value={{ size: "5em" }}>
            <p>{playButton}</p>
          </IconContext.Provider>
          <MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="root" instruments={[this.instruments[this.props.instrument]]} />
          <Instrument instNames={Object.keys(this.instruments)} scales={Object.keys(this.scales)} speeds={Object.keys(this.speeds)} numNotesOps={Object.keys(this.numNotesOps)} />
        </div>
    );
  }
}

//map state changes to prop(s)
const mapStateToProps = state => {
  console.log(state); // for testing state update
  const isPlaying = state.isPlaying;
  const image = state.image;
  const instrument = state.instrument;
  const speed = state.speed;
  const scale = state.scale;
  const numNotes = state.numNotes;
  return { isPlaying, image, instrument, speed, scale, numNotes };
}

//connect to redux store
export default connect(
  mapStateToProps, //subscribe to redux store
  { setPlayPause,
    setPos } //dispatch actions
)(MusicComp);