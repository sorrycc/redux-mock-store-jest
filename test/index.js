import expect from 'expect';
import sinon from 'sinon';
import mockMiddleware from './mock/middleware';
import configureStore from '../src/index';

const mockStore = configureStore([]);

describe('Redux mockStore', () => {

  it('throws an error if expectedActions is not an array', () => {
    expect(() => mockStore({}, {}))
    .toThrow(/expectedActions/);
  });

  it('throws an error if done is not a function or undefined', () => {
    expect(() => mockStore({}, [], {}))
    .toThrow(/done/);
  });

  it('returns the store if done is valid', () => {
    const store = mockStore({}, [], () => {});

    expect(store).toExist();
  });

  it('calls getState if it is a function', () => {
    const getState = sinon.spy();
    const store = mockStore(getState, [], () => {});

    store.getState();
    expect(getState.called).toBe(true);
  });

  it('returns the initial state', () => {
    const initialState = { items: [], count: 0 };
    const store = mockStore(initialState, [], () => {});

    expect(store.getState()).toBe(initialState);
  });

  it('should return if the tests is successful', (done) => {
    const action = { type: 'ADD_ITEM' };
    const store = mockStore({}, [action], done);

    store.dispatch(action);
  });

  it('should call the middleware', (done) => {
    const spy = sinon.spy();
    const middlewares = [mockMiddleware(spy)];
    const mockStoreWithMiddleware = configureStore(middlewares);
    const action = { type: 'ADD_ITEM' };

    const store = mockStoreWithMiddleware({}, [action], done);
    store.dispatch(action);
    expect(spy.called).toBe(true);
  });
});
