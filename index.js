const withPrevious = source => (start, sink) => {
  if (start !== 0) return;
  let hasPrevious = false;
  let previous;
  source(0, (t, d) => {
    let data = d;
    if (t === 1){
      data = hasPrevious ? [d, previous] : [d, undefined, true];
      previous = d;
      hasPrevious = true;
    }
    sink(t, data);
  });
};

export default withPrevious;
