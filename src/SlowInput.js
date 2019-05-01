import React, {Component} from 'react';

const GOOD = 'good';
const WARN = 'warning';
const BAD  = 'bad';

const DEFAULT_VALIDATE = () => true;
const DEFAULT_ONCHANGE = () => {};

export default class SlowInput extends Component {

  state = {
    value     : this.props.value || '',
    condition : this.props.condition || GOOD,
  }

  static defaultProps = {
    type     : 'text',
    validate : DEFAULT_VALIDATE,
    onChange : DEFAULT_ONCHANGE,
  }

  constructor(props) {
    super(props);
    this.keepSlowly = this.keepSlowly.bind(this);
    this.keyDown    = this.keyDown.bind(this);
    this.swallow    = this.swallow.bind(this);

    this.onBlur     = this.onBlur.bind(this);
    this.onClick    = this.onClick.bind(this);
    this.keyDown    = this.keyDown.bind(this);
  }

  swallow(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  onClick(e) {
    this.swallow(e);
    if (this.state.condition === BAD ) {
      this.setState( { condition : WARN } );
    }
  }

  onBlur(e) {
    if (this.state.value) {
      if (this.state.condition === WARN) {
        this.setState( { condition: BAD } );
      }
      else {
        this.props.onChange( this.state.value );
      }
    }
  }

  keepSlowly(e) {
    this.swallow(e);
    const value = e.target.value;
console.log("KEEPS SLOWLY : ", value);
    var newState = { value, condition : GOOD };

    if (!this.props.validate(value)) {
      newState.condition = WARN;
    }
console.log("KS : ", value, this.props.validate(value), newState);
    this.setState( newState, (s) => {console.log('callback:',this.state)} );
  }

  keyDown(e) {
    if (e.keyCode === 13 && this.state.value) {
      this.enter();
    }
  }

  enter() {
    if (this.state.value) {
      if (this.state.condition === WARN) {
        this.setState( { condition: BAD } );
      }
      else {
        this.props.onChange( this.state.value );
      }
    }
  }

  render() {

    const value = this.state.value;

    var bgColor = '';
    var fgColor = 'black';

    if ( this.state.condition === WARN ) {
      bgColor = '#CCCC00';
    }
    else if ( this.state.condition === BAD ) {
      bgColor = '#CC0000';
      fgColor = 'white';
    }
console.log("BG/FG:", bgColor, fgColor, this.state);
    return (
      <input
        value       = { value }
        onClick     = { this.onClick    }
        onChange    = { this.keepSlowly }
        onBlur      = { this.onBlur     }
        onKeyDown   = { this.keyDown    }
        onInput     = { this.keepSlowly }
        className   = { this.props.className }
        style       = { {backgroundColor : bgColor, color : fgColor} }
        placeholder = { this.props.placeholder }
        id          = { this.props.id }
        type        = { this.props.type }
        //ref={ (input) => { console.log("IF :", input); this.inputField = input } }
        onFocus     = { (e) => { if (this.props.autoSelect) {e.target.select()}} }
        autoFocus   = { this.props.autoFocus }
        {...this.props.inputProps}
        />
    );
  }
}
