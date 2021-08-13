import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import { Send, SportsEsports } from '@material-ui/icons'

interface IContactDialogProps{
  open:boolean;
  handleClose:any;
  id:any;
  anchorEl:any;
  isSelecterUserConnected:any;
}

const ContactDialog = (props: IContactDialogProps) => {
  const { open, handleClose, id , anchorEl,isSelecterUserConnected} = props;

  const handleListItemClick = (value: string) => {
    handleClose(value);
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleListItemClick}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}>
      <List>
        <ListItem autoFocus button onClick={() => handleListItemClick('sendMessage')}>
          <ListItemAvatar>
            <Avatar>
              <Send />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Send Message" />
        </ListItem>
        {isSelecterUserConnected?
        <ListItem autoFocus button onClick={() => handleListItemClick('play')}>
          <ListItemAvatar>
            <Avatar>
              <SportsEsports />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Play" />
        </ListItem>
        :<></>}
      </List>
    </Popover>
  );
}

export default ContactDialog;