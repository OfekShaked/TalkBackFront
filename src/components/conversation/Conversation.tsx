import React, { useState, useContext, useEffect } from 'react';
import Messages from '../messages/Messages';
import Input from '../input/Input';
import { SocketContext } from '../../context/socketContext';
import ModalPopup from '../modal/ModalPopup';
import Bar from './bar/Bar';
import './ConversationStyle.scss';
import { handleError } from '../../services/errorHandling.service'

interface ConversationProps {
    senderUsername: String;
    recieverUsername: String;
    open: any;
    handleClose: any;
}

const Conversation = (props: ConversationProps) => {

    const { recieverUsername, senderUsername, open, handleClose } = props;
    const socket = useContext(SocketContext)
    const [name, setName] = useState(senderUsername);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any>([]);

    useEffect(() => {
        try {
            const activateSocket = async () => {
                socket.on("getMessages", (messages: any) => {
                    setMessages(messages);
                })
                socket.on("getNewMessage", (message: any) => {
                    setMessages((currentState: any) => [...currentState, message]);
                })
            }
            activateSocket();
        } catch (err) {
            handleError(err);
        }
    }, [])

    useEffect(() => {
        try {
            const activateSocket = async () => {
                socket.emit("conv_joined", { senderUsername, recieverUsername })
            }
            activateSocket();
        } catch (err) {
            handleError(err);
        }
    }, [recieverUsername])

    const sendMessage = (event: any) => {
        try {
            event.preventDefault();
            if (message) {
                socket.emit("sendMessage", { senderUsername, recieverUsername, message });
                setMessages((currentState: any) => [...currentState, { text: message, sender: senderUsername }]);
                setMessage('');
            }
        } catch (error) {
            handleError(error);
        }
    }


    return (
        <ModalPopup open={open} handleClose={handleClose}>
            <div className="container">
                <Bar recieverUsername={recieverUsername} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </ModalPopup>
    )
}

export default Conversation;