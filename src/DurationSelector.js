import React from 'react';

export default ( { value, onChange = () => {} }) => {

  const notes = [
    { label : 'whole note',         n : 1 },
    { label : 'half note',          n : 2 },
    { label : 'quarter note',       n : 4 },
    { label : 'eighth note',        n : 8 },
    { label : 'sixteenth note',     n : 16 },
    { label : 'thirty-second note', n : 32 },
  ];

  return (
    <select className='form-control' value={value} onChange={ onChange } >
      { notes.map( note => <option value={note.n} key={note.n}>{note.label}</option> )}
    </select>
  )
}
