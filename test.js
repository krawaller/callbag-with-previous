const test = require('tape');
const makeMockCallbag = require('callbag-mock');
const withPrevious = require('./index');

test('it puts previous data alongside the current', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const source = makeMockCallbag('source', true);
  const sink = makeMockCallbag('sink', report);

  withPrevious(source)(0, sink);

  source.emit(1, 'foo');
  source.emit(1, 'bar');
  source.emit(1, 'baz');
  source.emit(2, 'error');

  t.deepEqual(history, [
    ['sink', 'body', 1, ['foo', undefined, true]],
    ['sink', 'body', 1, ['bar', 'foo']],
    ['sink', 'body', 1, ['baz', 'bar']],
    ['sink', 'body', 2, 'error'],
  ], 'sink gets terminations and values are coupled with previous values');

  t.end();
});

test('it passes requests back up', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const source = makeMockCallbag('source', report, true);
  const sink = makeMockCallbag('sink', report);

  withPrevious(source)(0, sink);

  sink.emit(1);
  sink.emit(2);

  t.deepEqual(history, [
    ['source', 'talkback', 1, undefined],
    ['source', 'talkback', 2, undefined],
  ], 'source gets requests from sink');

  t.end();
});
