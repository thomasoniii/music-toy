import React from 'react';

import SlowInput from './SlowInput';

import './Modifier.css';

const NO_OP = () => {};

export default ({label, value, type, validate, onChange }) => {
  return (
    <div className='modifier-container'>
      <div className='modifier-label'>{ label }</div>
      <div className='modifier-input'>
        <SlowInput
          className = 'form-control'
          validate  = { validate }
          onChange  = { onChange }
          value     = { value }
          //condition = { 'bad' }
          type      = { type }
        />
      </div>
    </div>
  )
}
