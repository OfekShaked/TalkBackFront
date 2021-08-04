import Message from './message/Message';

import './MessagesStyle.scss';

import AlwaysScrollToBottom from '../AlwaysScrollToBottom';

interface IMessages{
  messages:any,
  name:String|null
}

const Messages = ( props:IMessages ) => {

  return (
  <div className="messages">
    {props.messages.map((message:any, i:any) => <div key={i}><Message message={message} name={props.name} /></div>)}
    <AlwaysScrollToBottom/>
  </div>)
};

export default Messages;