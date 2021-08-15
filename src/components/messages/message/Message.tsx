import React from 'react';

import './MessageStyle.scss';

interface IMessageProps {
  name: String;
  message: any;
}

const Message = (props: IMessageProps) => {
  let isSentByCurrentUser = false;
  const { name, message } = props;

  const trimmedName = name.trim().toLowerCase();

  if (message.sender.trim().toLowerCase() === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{trimmedName}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{message.text}</p>
          </div>
        </div>
      )
      : (
        <div className="messageContainer justifyStart">
          <div className="messageBox backgroundLight">
            <p className="messageText colorDark">{message.text}</p>
          </div>
          <p className="sentText pl-10 ">{message.user}</p>
        </div>
      )
  );
}

export default Message;