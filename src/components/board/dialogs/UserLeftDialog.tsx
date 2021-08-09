import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface IGameDialogProps{
    handleClose: any;
    open:any;
}

const UserLeftDialog = (props:IGameDialogProps) =>{

    return (
        <>
        <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"You win, opponent left!"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            opponent Left the game and you won! Congratulations!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
        </>
    )
}
export default UserLeftDialog;