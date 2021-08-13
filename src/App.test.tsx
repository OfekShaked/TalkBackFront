import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';
import SocketMock from 'socket.io-mock';

test('renders app page', () => {
  const component = renderer.create(
    <App ></App>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

describe('Fast and isolated socket tests', ()=>{
  it('Sockets should be able to talk to each other without a server', ()=> {
      let socket = new SocketMock();

      socket.on('message',  (message:any) =>{
          expect(message).toBe('Hello World!');
      });
      socket.socketClient.emit('message', 'Hello World!');
  });
});
