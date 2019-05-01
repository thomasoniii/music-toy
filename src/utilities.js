export const calculateNoteWidth = ( width, duration ) => {
  switch( duration ) {
    case 1 :
      return 1.75 * width;
    case 2 :
      return 1.5 * width;
    case 4 :
      return 1.25 * width;
    case 8 :
      return 1 * width;
    case 16 :
      return .9 * width;
    case 32 :
      return .8 * width;
    default :
      return width;
  }
}

export const noteIDAtTime = (note, time) => {
  return `${note}-${time}`;
}
