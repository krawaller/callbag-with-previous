const test = require('tape');
const makeMockCallbag = require('callbag-mock');
const withPrevious = require('./index');

test('it puts previous data alongside the current', t => {
  const source = makeMockCallbag(true);
  const sink = makeMockCallbag();

  withPrevious(source)(0, sink);

  source.emit(1, 'foo');
  source.emit(1, 'bar');
  source.emit(1, 'baz');

  t.deepEqual(
    sink.getReceivedData(),
    [['foo',undefined,true], ['bar','foo'], ['baz','bar']],
    'sink gets values with previous values'
  );
  source.emit(2, 'error');
  t.ok(!sink.checkConnection(), 'sink gets terminated as usual');
  t.end();
});

test('it passes requests back up', t => {
  const source = makeMockCallbag(true);
  const sink = makeMockCallbag();

  withPrevious(source)(0, sink);

  sink.emit(1);
  sink.emit(2);

  const [init, ...messages] = source.getMessages();
  t.equal(init[0], 0, 'source is initiated');
  t.deepEqual(messages, [[1,undefined],[2,undefined]], 'source gets all messages');
  t.end();
});
