import React, { useState,useContext,useEffect } from 'react';
import './Board.scss';
import ModalPopup from '../modal/ModalPopup';
import BoardPieces from './board-pieces/BoardPieces';
import { Close,Games } from '@material-ui/icons';
import { Button,CircularProgress,Badge } from '@material-ui/core';
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'
import {SocketContext} from '../../context/socketContext'
import UserLeftDialog from './dialogs/UserLeftDialog'


export interface IIsOptionVisible {
    dice1: number;
    dice2: number;
    position: number;

}

const Board = (props: any) => {
    const socket = useContext(SocketContext)
    let reactDice1: any;
    let reactDice2: any;
    const [userColor, setUserColor] = useState<String>("");
    const [isOptionalVisible, setIsOptionalVisible] = useState<null | IIsOptionVisible>(null);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [openLeftDialog,setOpenLeftDialog] = useState(false);
    const [isTurn,setIsTurn] = useState(false);
    const [isDiceRolled,setIsDiceRolled] = useState(false);
    const [numTurnsLeft,setNumTurnsLeft] = useState(0);
    const [gameMessage,setGameMessage] = useState("");
    const [isRollDisabled,setIsRollDisabled] = useState(true);
    const [currentUserColor,setCurrentUserColor] = useState("");

    const handleUserLeftDialogClose = () =>{
        setOpenLeftDialog(false);
        props.handleClose();
    }
    const rollDoneCallback = (num: number) => {

    }
    const rollAll = () => {
        reactDice1.rollAll();
        reactDice2.rollAll();
        setIsDiceRolled(true);
        setIsRollDisabled(true);
    }

    const showOptions = (position: number) => {
        if(isTurn&&isDiceRolled){            
        setIsOptionalVisible({ ...{ dice1: reactDice1.state.totalValue, dice2: reactDice2.state.totalValue, position: position } });
        }else {
            setIsOptionalVisible(null);
        }
    }

    const setTurn = (color:String,assignedUserColor:String) =>{        
        if(assignedUserColor===color){
            setIsTurn(true);
            setIsRollDisabled(false);
        }
        else{
            setIsTurn(false);
            setIsRollDisabled(true);
        }
    }

    useEffect(()=>{
        try {
            const socketGet = async () =>{
            await socket.on("startGame", (res: any) => { 
                setIsDiceRolled(false);                                               
                setUserColor(res.color); 
                setCurrentUserColor(res.color);               
                setTurn(res.startColor,res.color)
                setIsGameStarted(true);                
            })

            await socket.on("userLeftGame",(username: any)=>{
                setOpenLeftDialog(true);
            })
            
            await socket.on("changeTurn",(currentTurnColor:any)=>{
                setIsDiceRolled(false);
                setTurn(currentTurnColor,currentUserColor);
                setIsOptionalVisible(null);
                
            })
        }
        socketGet();
        } catch (err) {
            console.log(err);

        }
    },[currentUserColor])


    return (
        <>
        <ModalPopup open={props.open}>
                <div className="frame">
                {!isGameStarted ?
                <>
                <div className="leftContainer">
                <Button onClick={props.handleClose}><Close className="fillIcon" /></Button>
                </div>
                <div className="loading">
                <CircularProgress/>
                </div>
                </>
                :
                <>
                <div className="topContainer">
                    <div className="leftContainer">
                        <Button onClick={props.handleClose}><Close className="fillIcon" /></Button>                        
                        <Button variant="contained" color="primary" onClick={rollAll} disabled={isRollDisabled}>Roll Dice</Button>
                    </div>
                    {isTurn?
                    <div className="rightContainer">
                        <span className="message">{gameMessage}</span>
                        <Badge badgeContent={numTurnsLeft} color="primary" className="turnsLeft">
                            <Games/>
                        </Badge>
                        
                    </div>
                    :<></>
                    }
                    </div>
                    <div className="centerContainer">
                        <ReactDice
                            numDice={1}
                            rollDone={rollDoneCallback}
                            ref={(dice: any) => { reactDice1 = dice }}
                            disableIndividual={true}
                            dieSize={30}
                            faceColor="#000000"
                            dotColor="#fffff"
                        />
                        <ReactDice
                            numDice={1}
                            rollDone={rollDoneCallback}
                            ref={(dice: any) => { reactDice2 = dice }}
                            disableIndividual={true}
                            dieSize={30}
                            faceColor="#000000"
                            dotColor="#fffff"
                        />
                    </div>
                    <div className="board">
                        <div className="left-bin">
                            <div className="top-row">
                                <div className="arrow-down odd"></div>
                                <div className="arrow-down even"></div>
                                <div className="arrow-down odd"></div>
                                <div className="arrow-down even"></div>
                                <div className="arrow-down odd"></div>
                                <div className="arrow-down even"></div>
                            </div>

                            <div className="bottom-row">
                                <div className="arrow-up odd"></div>
                                <div className="arrow-up even"></div>
                                <div className="arrow-up odd"></div>
                                <div className="arrow-up even"></div>
                                <div className="arrow-up odd"></div>
                                <div className="arrow-up even"></div>
                            </div>
                        </div>

                        <div className="middle-bar"></div>

                        <div className="right-bin">
                            <div className="top-row">
                                <div className="arrow-down odd"></div>
                                <div className="arrow-down even"></div>
                                <div className="arrow-down odd"></div>
                                <div className="arrow-down even"></div>
                                <div className="arrow-down odd"></div>
                                <div className="arrow-down even"></div>
                            </div>

                            <div className="bottom-row">
                                <div className="arrow-up odd"></div>
                                <div className="arrow-up even"></div>
                                <div className="arrow-up odd"></div>
                                <div className="arrow-up even"></div>
                                <div className="arrow-up odd"></div>
                                <div className="arrow-up even"></div>
                            </div>
                        </div>
                        <BoardPieces showOptions={showOptions} userColor={userColor} isOptionalVisible={isOptionalVisible} setGameMessage={setGameMessage} setNumTurnsLeft={setNumTurnsLeft} isTurn={isTurn}/>


                    </div>
                    </>
                    }
                </div>
        </ModalPopup>
        <UserLeftDialog open={openLeftDialog} handleClose={handleUserLeftDialogClose}/>
                    </>
    );
}
export default Board;