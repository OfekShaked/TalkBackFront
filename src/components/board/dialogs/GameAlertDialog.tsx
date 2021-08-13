import React,{useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface IGameDialogProps{
    handleClose: any;
    open:any;
    gameAlertDialogType:String;
}

const GameAlertDialog = (props:IGameDialogProps) =>{

  const [titleText,setTitleText] = useState("");
  const [bodyText,setBodyText] = useState("");

  useEffect(() => {
    switch(props.gameAlertDialogType){
      case "userLeft": {
        setTitleText("You win, opponent left!");
        setBodyText("opponent Left the game and you won! Congratulations!");
        break;
      } 
      case "whiteWin":{
        setTitleText("White won Good Game!");
        setBodyText("congratulations for finishing the game hail the white pieces!");
        break;
      }
      case "blackWin":{
        setTitleText("Black won Good Game!");
        setBodyText("congratulations for finishing the game hail the black pieces!");
        break;
    }
  }
  },[props.gameAlertDialogType])

    return (
        <>
        <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{titleText}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {bodyText}
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
export default GameAlertDialog;