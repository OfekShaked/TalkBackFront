import React, { useEffect, useState, useContext } from 'react';
import BoardPiece from '../board-piece/BoardPiece';
import { SocketContext } from '../../../context/socketContext';
import { getCurrentUser } from '../../../services/auth.service';
import { handleError } from '../../../services/errorHandling.service';
import { mapPositions, checkAndHandleUserWin, changeOldPosition, setNewPosition, showOptionalPositionsOnPieceClick } from '../../../services/backgammon.service';

interface IBoardPiecesProps {
    showOptions: any;
    userColor: any;
    isOptionalVisible: any;
    setGameMessage: any;
    setNumTurnsLeft: any;
    isTurn: any;
    setGameAlertDialogType: any;
}

interface IPosition {
    piecesCount: number,
    color: String
}


const BoardPieces = (props: IBoardPiecesProps) => {

    const socket = useContext(SocketContext);
    const { showOptions, userColor, isOptionalVisible } = props;

    //pieces eaten, pieces taken out and optional moves
    const [optionPieces, setOptionPieces] = useState<any>([])
    const [standbyPieces, setStandbyPieces] = useState<any>([]);
    const [outPieces, setOutPieces] = useState<any>([]);

    //pieces taken out from board
    const [whiteOut, setWhiteOut] = useState(0);
    const [blackOut, setBlackOut] = useState(0);
    //pieces eaten
    const [whiteStandby, setWhiteStandby] = useState(0);
    const [blackStandby, setBlackStandby] = useState(0);
    const [turnsUsed, setTurnsUsed] = useState(0);
    const [isOptionalPaused, setIsOptionalPaused] = useState(false);

    const positions: Array<IPosition> = [
        { piecesCount: 2, color: "white" },
        { piecesCount: 0, color: "" },
        { piecesCount: 0, color: "" },
        { piecesCount: 0, color: "" },
        { piecesCount: 0, color: "" },
        { piecesCount: 5, color: "black" },
        { piecesCount: 0, color: "" },
        { piecesCount: 3, color: "black" },
        { piecesCount: 0, color: "" },
        { piecesCount: 0, color: "" },
        { piecesCount: 0, color: "" },
        { piecesCount: 5, color: "white" },
        { piecesCount: 5, color: "black" },
        { piecesCount: 0, color: "" },
        { piecesCount: 0, color: "" },
        { piecesCount: 0, color: "" },
        { piecesCount: 3, color: "white" },
        { piecesCount: 0, color: "" },
        { piecesCount: 5, color: "white" },
        { piecesCount: 0, color: "" },
        { piecesCount: 0, color: "" },
        { piecesCount: 0, color: "" },
        { piecesCount: 0, color: "" },
        { piecesCount: 2, color: "black" },
    ]
    const [currentPositions, setCurrentPositions] = useState(positions);


    //handles the click on an optional move of a piece
    const handlePositionChosen = async (oldPosition: number, newPosition: number, color: String, currentTurnsUsed: number) => {
        try {
            setIsOptionalPaused(true);
            setTimeout(() => {
                setIsOptionalPaused(false);
            }, 1000);
            changeOldPosition(currentPositions, oldPosition, setWhiteStandby, setBlackStandby, whiteStandby, blackStandby, setCurrentPositions);
            setNewPosition(newPosition, setWhiteOut, setBlackOut, currentPositions, color, setWhiteStandby, setBlackStandby, setCurrentPositions);
            setTurnsUsed(turnsUsed + currentTurnsUsed)
            const boardDataToSend = {
                positions: currentPositions,
                whiteOut: whiteOut,
                blackOut: blackOut,
                whiteStandby: whiteStandby,
                blackStandby: blackStandby
            }
            const currentUser = getCurrentUser();
            await socket.emit("sendBoard", { board: boardDataToSend, senderUsername: currentUser });
        } catch (error) {
            handleError(error);
        }
    }
    //finishes user turn and moves the next user
    const finishTurn = () => {
        try {
            setTurnsUsed(0);
            let currentUser = getCurrentUser();
            const boardDataToSend = {
                positions: currentPositions,
                whiteOut: whiteOut,
                blackOut: blackOut,
                whiteStandby: whiteStandby,
                blackStandby: blackStandby
            }
            socket.emit("sendBoard", { board: boardDataToSend, senderUsername: currentUser });
            socket.emit("finishTurn", { username: currentUser, colorFinished: userColor })
        } catch (error) {
            handleError(error);
        }
    }
    //handles the optional positions when clicking on a piece
    useEffect(() => {
        try {
            showOptionalPositionsOnPieceClick(blackStandby, whiteStandby, currentPositions, userColor, handlePositionChosen, isOptionalVisible, turnsUsed, props, setOptionPieces, finishTurn);
        } catch (error) {
            handleError(error);
        }
    }, [isOptionalVisible, turnsUsed])

    //checks if turn is finished
    useEffect(() => {
        try {
            if (isOptionalVisible) {
                if (isOptionalVisible.dice1 === isOptionalVisible.dice2 && turnsUsed === 4) {
                    finishTurn();
                } else if (turnsUsed > 2 && isOptionalVisible.dice1 !== isOptionalVisible.dice2) {
                    finishTurn();
                }
            }
        } catch (error) {
            handleError(error);
        }
    }, [turnsUsed])

    //set the pieces shown when eaten
    useEffect(() => {
        try {
            let standbyPiecesToShow = [
                <BoardPiece color="white" position={26} row={100} onClick={null} isOptional={false} isDead={whiteStandby === 0} keyValue={10001}><span>{whiteStandby}</span></BoardPiece>,
                <BoardPiece color="black" position={26} row={101} onClick={null} isOptional={false} isDead={blackStandby === 0} keyValue={10002}><span>{blackStandby}</span></BoardPiece>,
            ]
            setStandbyPieces(standbyPiecesToShow);
        } catch (error) {
            handleError(error);
        }
    }, [blackStandby, whiteStandby])

    //shows the pieces when taken out
    useEffect(() => {
        try {
            let outPiecesToShow = [
                <BoardPiece color="white" position={26} row={2} onClick={null} isOptional={false} isDead={whiteOut === 0} keyValue={10003}><span>{whiteOut}</span></BoardPiece>,
                <BoardPiece color="black" position={0} row={2} onClick={null} isOptional={false} isDead={blackOut === 0} keyValue={10004}><span>{blackOut}</span></BoardPiece>,
            ]
            setOutPieces(outPiecesToShow);
            checkAndHandleUserWin(blackOut, whiteOut, props, currentPositions);
        } catch (err) {
            handleError(err);
        }
    }, [blackOut, whiteOut])

    //socket handling
    useEffect(() => {
        try {
            const socketGet = async () => {
                await socket.on("getBoard", (board: any) => {
                    setCurrentPositions(board.positions);
                    setBlackOut(board.blackOut);
                    setWhiteOut(board.whiteOut);
                    setWhiteStandby(board.whiteStandby);
                    setBlackStandby(board.blackStandby);
                })
            }
            socketGet();
        } catch (err) {
            handleError(err);

        }
    }, [])


    return (
        <>
            {currentPositions.map((object, i) => mapPositions(object, i, userColor, showOptions))}
            {props.isTurn && !isOptionalPaused ? optionPieces : <></>}
            {standbyPieces}
            {outPieces}
        </>
    )
}
export default BoardPieces;