import React, { useState, useEffect } from 'react';
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import {handleError} from '../../services/errorHandling.service'
interface IMessageNotificationProps {
    notificationOpen: boolean;
    onNotificationClose: any;
    sender: String;
    text: String;
}

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const MessageNotification = (props: IMessageNotificationProps) => {

    const { notificationOpen, onNotificationClose, sender, text } = props;

    const [notificationMessage, setNotificationMessage] = useState("");
    const changeMessage = () => {
        let message = `${sender}: ${text.slice(0, 15)}...`
        setNotificationMessage(message);
    }
    useEffect(() => {
        changeMessage();
    }, [text, sender])

    useEffect(() => {        
        if(notificationOpen){
            let audio = new Audio("http://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a");
             audio.load();
            audio.muted=false;
             audio.play()
             .then(() => {
               // Audio is playing.
             })
             .catch(error => {
               handleError(error);               
             });
        }
    },[notificationOpen])
    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={notificationOpen}
            onClose={onNotificationClose}
            key={"topcenter"}
            autoHideDuration={3000}
        >
            <Alert onClose={onNotificationClose} severity="success">
                {notificationMessage}
            </Alert>
        </Snackbar>
    )

}
export default MessageNotification;