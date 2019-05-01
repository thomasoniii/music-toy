import React, { Component } from 'react';

import Tone from 'tone';

import { calculateNoteWidth } from './utilities';

import './ToneButton.css';

export default class ToneButton extends Component {

  static defaultProps = {
    sticky      : false,
    isStuck     : false,
    time        : null,
    displayNote : false,
    width       : 32,
    height      : 32,
    duration    : '8n',
  }

  constructor(props) {
    super(props);

    this.playTone   = this.playTone.bind(this);
    this.renderNote = this.renderNote.bind(this);
  }

  componentDidMount() {
    this.synth = new Tone.Synth().toMaster();
  }

  renderNote() {
    if (this.props.displayNote) {
      return this.props.note;
    }
    else {
      return null;
    }
  }

  playTone() {

    const { note, duration } = this.props;

    if (this.props.sticky) {

      const isStuck = !this.props.isStuck;

      if ( this.props.onClick ) {
        this.props.onClick( note, this.props.time, isStuck, duration );
      }

    }
    else {
      this.synth.triggerAttackRelease( note, `${duration}n` );
    }
  }

  render() {

    const className = this.props.sticky && this.props.isStuck
      ? 'btn-primary'
      : 'btn-secondary'
    ;

    const style = {
      width  : calculateNoteWidth( this.props.width, this.props.duration ),
      height : this.props.height,
    }

    return (
      <button
        onClick   = { this.playTone }
        className = {`btn ${className} tone-button`}
        style     = { style }
        >
        { this.renderNote() }
      </button>
    )
  }
}
