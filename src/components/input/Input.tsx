import React from 'react';
import {Button} from '@material-ui/core'

import './InputStyle.scss';

const Input = (props: any) => {
    const { setMessage, sendMessage, message } = props;
    return (
        <form className="form">
            <input
                className="input"
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={({ target: { value } }) => setMessage(value)}
                onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
            />
            <Button className="sendButton" onClick={e => sendMessage(e)}>Send</Button>
        </form>
    )
}

export default Input;