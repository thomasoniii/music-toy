import React, { Component } from 'react';
import Tone from 'tone';
import _ from 'lodash';

import ToneButton from "./ToneButton";
import DurationSelector from "./DurationSelector";
import Modifier from './Modifier';

import { calculateNoteWidth, noteIDAtTime } from './utilities';

import './ToneBoard.css';

export default class BigToneBoard extends Component {

  state = {
    note_duration   : this.props.note_duration,
    piece_duration  : this.props.piece_duration,
    stuck           : {}
  }

  static defaultProps = {
    note_duration  : 8,
    piece_duration : 3,
    piece_speed    : 1,
    width          : 32,
  }

  constructor(props) {
    super(props);

    this.onClick                = this.onClick.bind(this);
    this.onChangeDuration       = this.onChangeDuration.bind(this);
    this.onChangePieceDuration  = this.onChangePieceDuration.bind(this);
    this.clearNotes             = this.clearNotes.bind(this);
  }

  onChangeDuration(e) {
    this.setState( { note_duration : parseInt(e.target.value, 10) } );
  }

  onChangePieceDuration(m) {
    console.log("PIECE IS NOW : ", m);
    this.setState( { piece_duration : parseInt(m, 10) } );
    this.part.loopEnd = `${m}m`;
  }

  clearNotes() {
    if (window.confirm("Really clear all notes?")) {
      this.part.removeAll();
      this.setState( { stuck : {} } );
    }
  }

  determineGridTemplateColumns() {
    const noteWidth = calculateNoteWidth( this.props.width, this.state.note_duration );

    const beats    = this.state.note_duration;
    const num_cols = this.state.piece_duration * beats;

    return [`repeat(${num_cols + 1}, ${noteWidth}px)`].join(' ');
  }

  componentDidMount() {

    //this.synth = new Tone.Synth().toMaster();
    this.synth = new Tone.PolySynth(24, Tone.Synth).toMaster();

    this.part = new Tone.Part(
      (time, note) => {
        console.log("PART IS : ", `${this.state.note_duration}n`);
        this.synth.triggerAttackRelease(note, `${this.state.note_duration}n`, time);
      },
      []
    );

    this.part.loop          = true;
    this.part.playbackRate  = this.props.piece_speed;
    this.part.loopEnd       = `${this.state.piece_duration}m`;
    this.part.start();

    Tone.Transport.start();
  }

  componentWillUnmount() {
    Tone.Transport.stop();
  }

  onClick(note, time, isStuck, duration) {
    console.log("CLICK IT AND STICK IT", note, time, isStuck, duration);

    //const time = `0:0:${2 * id}`;

    const event = this.part.at(time);
    let tones = event !== null
      ? event.value
      : [];
console.log("TONES AT TIME : ", time, tones);

    let newStuck = { ...this.state.stuck };

    if (isStuck) {
      tones = _.uniq( [ ...tones, note ] );
      newStuck[ noteIDAtTime(note, time) ] = true;
    }
    else {
      tones = _.remove(tones, n => n !== note);
      newStuck[ noteIDAtTime(note, time) ] = false;
    }

    console.log(time, tones, note, isStuck);

    this.part.at(time, tones);

    this.setState( { stuck : newStuck } );



  }

  render() {

    let tones = [
      'C1', 'D1', 'E1', 'F1', 'G1', 'A1', 'B1',
      'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2',
      'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3'
    ].reverse();

    const style = {
      gridTemplateColumns : this.determineGridTemplateColumns(),
    }

    const beats = this.state.note_duration;
console.log("MODIFIER PIECE DURATION : ", this.state.piece_duration);

    const num_cols = this.state.piece_duration * beats;
console.log("NUM COLS : ", num_cols);
    return (
      <div className='big-tone-board-container'>
        <DurationSelector
          value    = { this.state.note_duration }
          onChange = { this.onChangeDuration }
        />
        <Modifier
          label = '# of measures: '
          value = { this.state.piece_duration }
          type  = 'number'
          onChange = { this.onChangePieceDuration }
        />
        <button
          className = 'btn btn-danger'
          onClick= { this.clearNotes }
          >
            Clear all notes
        </button>
        <div className='big-tone-board' style={style}>
          { tones.map( t => {
            let output = [<div key={t}>{t}</div>];
            for (let i = 1; i <= num_cols; i++) {

              //console.log("BEATS : ", beats);
              const time = `${Math.floor( (16 / beats) * (i - 1) / 16)}:0:${( (16 / beats) * (i - 1)) % 16}`;

              output.push(
                <ToneButton
                  note     = {`${t}`}
                  duration = { this.state.note_duration }
                  key      = {`${t}-${i}`}
                  sticky   = { true }
                  isStuck  = { this.state.stuck[ noteIDAtTime(t, time) ] }
                  onClick  = { this.onClick }
                  time     = { time }
                />
              )
            }
            return output;
          })}
        </div>
      </div>
    )
  }
}
