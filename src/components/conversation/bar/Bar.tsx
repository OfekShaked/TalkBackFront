import React from 'react';
import './BarStyle.scss';

const Bar = (props:any) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <h3>{props.recieverUsername}</h3>
    </div>
    <div className="rightInnerContainer">
    </div>
  </div>
);

export default Bar;