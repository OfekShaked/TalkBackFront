import React from 'react';
import logo from './logo.svg';
import {SocketContext, socket} from '../src/context/socketContext';
import './App.scss';
import PageLayout from './components/page-layout/PageLayout';

function App() {
  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
      <PageLayout></PageLayout>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
