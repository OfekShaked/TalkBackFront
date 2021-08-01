import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {Send,SportsEsports} from '@material-ui/icons'

const ContactDialog =(props: any) => {
    const { onClose, selectedValue, open } = props;
  
    const handleClose = () => {
      onClose(selectedValue);
    };
  
    const handleListItemClick = (value: string) => {
      onClose(value);
    };
  
    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
        <List>
          <ListItem autoFocus button onClick={() => handleListItemClick('sendMessage')}>
            <ListItemAvatar>
              <Avatar>
                <Send />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add account" />
          </ListItem>
          <ListItem autoFocus button onClick={() => handleListItemClick('play')}>
            <ListItemAvatar>
              <Avatar>
                <SportsEsports />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Play" />
          </ListItem>
        </List>
      </Dialog>
    );
  }

  export default ContactDialog;