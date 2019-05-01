import React, { Component } from 'react';

import ToneButton       from "./ToneButton";
import DurationSelector from "./DurationSelector";

import { calculateNoteWidth } from './utilities';

import './ToneBoard.css';

const MAX_TONES = 8;

export default class ToneBoard extends Component {

  state = {
    duration : this.props.duration
  }

  static defaultProps = {
    duration : 8,
    width    : 32,
  }

  constructor(props) {
    super(props);

    this.onChangeDuration = this.onChangeDuration.bind(this);
  }

  onChangeDuration(e) {
    this.setState( { duration : parseInt(e.target.value, 10) } );
  }

  determineGridTemplateColumns() {
    const noteWidth = calculateNoteWidth( this.props.width, this.state.duration );
    console.log("NW : ", noteWidth);
    return [`${this.props.width}px`, `repeat(${MAX_TONES}, ${noteWidth}px)`].join(' ');
  }

  renderToneLabels() {
    let output = [];

    for (let i = 1; i <= MAX_TONES; i++) {
      output.push(<div key={i}>{i}</div>);
    }

    return output;
  }

  render() {

    //let notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].reverse();
    let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].reverse();

    const style = {
      gridTemplateColumns : this.determineGridTemplateColumns(),
    }
console.log("STYLE : ", style, this.state.duration);
    return (
      <div className='tone-board-container'>
        <DurationSelector
          value    = { this.state.duration }
          onChange = { this.onChangeDuration }
        />
        <div className='tone-board' style={style}>
          { this.renderToneLabels() }
          { notes.map( n => {
            let output = [
              <div key='note'>{n}</div>
            ];
            for (let i = 1; i <= MAX_TONES; i++) {
              output.push(
                <ToneButton note={`${n}${i}`} duration={ this.state.duration } key={`${n}-${i}`} />
              )
            }
            return output;
          })}
        </div>
      </div>
    )
  }
}
