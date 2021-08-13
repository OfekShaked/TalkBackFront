import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface IGameDialogProps {
  handleClose: any;
  open: any;
  player: String;
}

const GameDialog = (props: IGameDialogProps) => {

  return (
    <>
      <Dialog
        open={props.open}
        onClose={() => { props.handleClose("disagree") }}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Play backgammon ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.player} Wants to play with you do you want to join him on the greatest backgammon game?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { props.handleClose("disagree") }} color="primary">
            Disagree
          </Button>
          <Button onClick={() => { props.handleClose("agree") }} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default GameDialog;