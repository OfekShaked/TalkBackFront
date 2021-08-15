import React, { useState, useContext, useEffect } from 'react';
import './Board.scss';
import ModalPopup from '../modal/ModalPopup';
import BoardPieces from './board-pieces/BoardPieces';
import { Close, Games } from '@material-ui/icons';
import { Button, CircularProgress, Badge,Avatar } from '@material-ui/core';
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'
import { SocketContext } from '../../context/socketContext'
import GameAlertDialog from './dialogs/GameAlertDialog'
import { handleError } from '../../services/errorHandling.service';

export interface IIsOptionVisible {
    dice1: number;
    dice2: number;
    position: number;

}

interface IBoardProps {
    handleClose: any;
    open: any;
}

const Board = (props: IBoardProps) => {
    const socket = useContext(SocketContext)
    let reactDice1: any;
    let reactDice2: any;
    const [userColor, setUserColor] = useState<String>("");
    //optional moves
    const [isOptionalVisible, setIsOptionalVisible] = useState<null | IIsOptionVisible>(null);
    const [isGameStarted, setIsGameStarted] = useState(false);
    //dialogs
    const [openGameAlertDialog, setOpenGameAlertDialog] = useState(false);
    const [gameAlertDialogType, setGameAlertDialogType] = useState("")
    const [isTurn, setIsTurn] = useState(false);
    const [isDiceRolled, setIsDiceRolled] = useState(false);
    const [numTurnsLeft, setNumTurnsLeft] = useState(0);
    const [gameMessage, setGameMessage] = useState("");
    const [isRollDisabled, setIsRollDisabled] = useState(true);
    const [currentUserColor, setCurrentUserColor] = useState("");

    const handleGameAlertDialogClose = () => {
        try {
            setOpenGameAlertDialog(false);
            props.handleClose();
        } catch (err) {
            handleError(err)
        }
    }
    const rollDoneCallback = (num: number) => {
        setIsDiceRolled(true);
    }
    const rollAll = () => {
        try {
            reactDice1.rollAll();
            reactDice2.rollAll();
            setIsRollDisabled(true);
        } catch (err) {
            handleError(err);
        }
    }
    //Show optional moves or not
    const showOptions = (position: number) => {
        try {
            if (isTurn && isDiceRolled) {
                setIsOptionalVisible({ ...{ dice1: reactDice1.state.totalValue, dice2: reactDice2.state.totalValue, position: position } });
            } else {
                setIsOptionalVisible(null);
            }
        } catch (error) {
            handleError(error);
        }
    }
    //set who turn it is
    const setTurn = (color: String, assignedUserColor: String) => {
        try{
        if (assignedUserColor === color) {
            setIsTurn(true);
            setIsRollDisabled(false);
        }
        else {
            setIsTurn(false);
            setIsRollDisabled(true);
        }
    }catch(error){
        handleError(error);
    }
    }

    //socket handler
    useEffect(() => {
        try {
            const socketGet = async () => {
                await socket.on("startGame", (res: any) => {
                    setIsDiceRolled(false);
                    setUserColor(res.color);
                    setCurrentUserColor(res.color);
                    setTurn(res.startColor, res.color)
                    setIsGameStarted(true);
                })

                await socket.on("userLeftGame", (username: any) => {
                    setOpenGameAlertDialog(true);
                    setGameAlertDialogType("userLeft");
                })

                await socket.on("changeTurn", (currentTurnColor: any) => {
                    setIsDiceRolled(false);
                    setTurn(currentTurnColor, currentUserColor);
                    setIsOptionalVisible(null);

                })
            }
            socketGet();
        } catch (err) {
            handleError(err);

        }
    }, [currentUserColor])

    //alert dialog opener
    useEffect(() => {
        try{
        if (gameAlertDialogType !== "") {
            setOpenGameAlertDialog(true);
        }
    }catch (error) {
        handleError(error);
    }
    }, [gameAlertDialogType])


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
                                <CircularProgress />
                            </div>
                        </>
                        :
                        <>
                            <div className="topContainer">
                                <div className="leftContainer">
                                    <Button onClick={props.handleClose}><Close className="fillIcon" /></Button>
                                    <Button variant="contained" color="primary" onClick={rollAll} disabled={isRollDisabled}>Roll Dice</Button>
                                    <div className={currentUserColor.toString()}></div>
                                </div>
                                {isTurn ?
                                    <div className="rightContainer">
                                        <span className="message">{gameMessage}</span>
                                        <Badge badgeContent={numTurnsLeft} color="primary" className="turnsLeft">
                                            <Games />
                                        </Badge>
                                    </div>
                                    : <></>
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
                                <BoardPieces showOptions={showOptions} userColor={userColor} isOptionalVisible={isOptionalVisible} setGameMessage={setGameMessage} setNumTurnsLeft={setNumTurnsLeft} isTurn={isTurn} setGameAlertDialogType={setGameAlertDialogType} />


                            </div>
                        </>
                    }
                </div>
            </ModalPopup>
            <GameAlertDialog open={openGameAlertDialog} handleClose={handleGameAlertDialogClose} gameAlertDialogType={gameAlertDialogType} />
        </>
    );
}
export default Board;