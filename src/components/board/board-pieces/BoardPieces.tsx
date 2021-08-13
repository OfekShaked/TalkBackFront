import React, { useEffect, useState, useContext } from 'react';
import BoardPiece from '../board-piece/BoardPiece';
import { SocketContext } from '../../../context/socketContext';
import { getCurrentUser } from '../../../services/auth.service';
import { handleError } from '../../../services/errorHandling.service';


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


    //map the pieces on the board
    const mapPositions = (position: IPosition, index: number) => {
        try {
            let positionsToShow = []

            if (position.piecesCount !== 0) {
                for (let i = 1; i <= position.piecesCount; i++) {
                    if (i === 5 && position.piecesCount > 5) {
                        positionsToShow.push(<BoardPiece keyValue={positionsToShow.length + 1} position={index + 1} row={i} color={position.color} isDead={false} onClick={userColor === position.color ? () => showOptions(index + 1) : null} isOptional={false}>
                            <span className="aboveFive">{position.piecesCount - i + 1}</span>
                        </BoardPiece>);
                        break;
                    }
                    positionsToShow.push(<BoardPiece keyValue={positionsToShow.length + 1} position={index + 1} row={i} color={position.color} isDead={false} onClick={i === position.piecesCount && userColor === position.color ? () => showOptions(index + 1) : null} isOptional={false} />);
                }
            }
            return positionsToShow;
        } catch (error) {
            handleError(error);
            return [];
        }
    }
    //handles the click on an optional move of a piece
    const handlePositionChosen = (oldPosition: number, newPosition: number, color: String, currentTurnsUsed: number) => {
        try {
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
            socket.emit("sendBoard", { board: boardDataToSend, senderUsername: currentUser });
        } catch (error) {
            handleError(error);
        }
    }
    //checks if all the pieces of the same color are in the last quarter
    const isAbleToTakePiecesOut = (color: String): Boolean => {
        try {
            if (color === "white") {
                if (whiteStandby !== 0) return false;
                for (let i = 18; i > 0; i--) {
                    if (currentPositions[i - 1].color === "white") return false;
                }
            }
            else {
                if (blackStandby !== 0) return false;
                for (let i = 7; i <= 24; i++) {
                    if (currentPositions[i - 1].color === "black") return false;
                }
            }
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }
    //set the optional moves of a position on the board 
    const handleOptionalPosition = (position: number, move: number, color: String, currentTurnsUsed: number, prevIsDead: Boolean) => {
        try {
            let positionConfig;
            const isAllowedToTakePiecesOut = isAbleToTakePiecesOut(color);
            if (position + move > 24) {
                positionConfig = {
                    position: 25,
                    row: 1,
                    onClick: () => handlePositionChosen(position, position + move, color, currentTurnsUsed),
                    isDead: !isAllowedToTakePiecesOut || prevIsDead
                }
            } else if (position + move < 1) {
                positionConfig = {
                    position: 0,
                    row: 1,
                    onClick: () => handlePositionChosen(position, position + move, color, currentTurnsUsed),
                    isDead: !isAllowedToTakePiecesOut || prevIsDead
                }
            } else if (position === 0 || position === 25) {
                positionConfig = {
                    position: position + move,
                    row: (currentPositions[position + move - 1].piecesCount + 1) > 5 ? 5 : (currentPositions[position + move - 1].piecesCount + 1),
                    onClick: () => handlePositionChosen(position, position + move, color, currentTurnsUsed),
                    isDead: !(currentPositions[position + move - 1].color === color || currentPositions[position + move - 1].color === "" || currentPositions[position + move - 1].piecesCount <= 1) || !(Math.abs(move) <= 6) || prevIsDead
                }
            }
            else {
                positionConfig = {
                    position: position + move,
                    row: (currentPositions[position + move - 1].piecesCount + 1) > 5 ? 5 : (currentPositions[position + move - 1].piecesCount + 1),
                    onClick: () => handlePositionChosen(position, position + move, color, currentTurnsUsed),
                    isDead: !(currentPositions[position + move - 1].color === color || currentPositions[position + move - 1].color === "" || currentPositions[position + move - 1].piecesCount <= 1) || prevIsDead
                }
            }
            return positionConfig;
        } catch (error) {
            handleError(error);
            return {
                position: position + move,
                row: (currentPositions[position + move - 1].piecesCount + 1) > 5 ? 5 : (currentPositions[position + move - 1].piecesCount + 1),
                onClick: () => handlePositionChosen(position, position + move, color, currentTurnsUsed),
                isDead: !(currentPositions[position + move - 1].color === color || currentPositions[position + move - 1].color === "" || currentPositions[position + move - 1].piecesCount <= 1) || prevIsDead
            }
        }
    }
    //return all the options for a move of a piece
    const getOptionalPositionsInner = (position: number, dice1: number, dice2: number) => {
        try {
            let optionConfig = { color: userColor, isOptional: true }
            let option1, option2, option3, option4;
            if (userColor === "white") {
                if (dice1 !== dice2) {
                    option1 = { ...handleOptionalPosition(position, dice1, "white", 1, false), ...optionConfig }
                    option2 = { ...handleOptionalPosition(position, dice2, "white", 2, false), ...optionConfig }
                    option3 = { ...handleOptionalPosition(position, dice1 + dice2, "white", 3, option1.isDead && option2.isDead), ...optionConfig }
                    return { option1: option1, option2: option2, option3: option3 }
                } else {
                    option1 = { ...handleOptionalPosition(position, dice1, "white", 1, false), ...optionConfig }
                    option2 = { ...handleOptionalPosition(position, dice1 * 2, "white", 2, option1.isDead), ...optionConfig }
                    option3 = { ...handleOptionalPosition(position, dice1 * 3, "white", 3, option2.isDead), ...optionConfig }
                    option4 = { ...handleOptionalPosition(position, dice1 * 4, "white", 4, option3.isDead), ...optionConfig }
                    return { option1: option1, option2: option2, option3: option3, option4: option4 }
                }
            }
            else {
                if (dice1 !== dice2) {
                    option1 = { ...handleOptionalPosition(position, 0 - dice1, "black", 1, false), ...optionConfig }
                    option2 = { ...handleOptionalPosition(position, 0 - dice2, "black", 2, false), ...optionConfig }
                    option3 = { ...handleOptionalPosition(position, 0 - dice1 - dice2, "black", 3, option1.isDead && option2.isDead), ...optionConfig }
                    return { option1: option1, option2: option2, option3: option3 }
                } else {
                    option1 = { ...handleOptionalPosition(position, 0 - dice1, "black", 1, false), ...optionConfig }
                    option2 = { ...handleOptionalPosition(position, 0 - dice1 * 2, "black", 2, option1.isDead), ...optionConfig }
                    option3 = { ...handleOptionalPosition(position, 0 - dice1 * 3, "black", 3, option2.isDead), ...optionConfig }
                    option4 = { ...handleOptionalPosition(position, 0 - dice1 * 4, "black", 4, option3.isDead), ...optionConfig }
                    return { option1: option1, option2: option2, option3: option3, option4: option4 }
                }
            }
        } catch (error) {
            handleError(error);
            return { option1: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } }, option2: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } }, option3: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } }, option4: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } } }
        }
    }
    //fixed positions and show dead ones
    const getOptionalPositions = (position: number, dice1: number, dice2: number) => {
        try {
            let optionPositions = getOptionalPositionsInner(position, dice1, dice2);
            if (userColor === "white") {
                if (optionPositions.option4) {
                    if (optionPositions.option4.position > 24 && optionPositions.option3.position > 24) optionPositions.option4.isDead = true;
                    if (optionPositions.option3.position > 24 && optionPositions.option2.position > 24) optionPositions.option3.isDead = true;
                    if (optionPositions.option2.position > 24 && optionPositions.option1.position > 24) optionPositions.option2.isDead = true;
                } else {
                    if (optionPositions.option3.position > 24 && optionPositions.option2.position > 24) optionPositions.option3.isDead = true;
                }
            } else {
                if (optionPositions.option4) {
                    if (optionPositions.option4.position < 1 && optionPositions.option3.position < 1) optionPositions.option4.isDead = true;
                    if (optionPositions.option3.position < 1 && optionPositions.option2.position < 1) optionPositions.option3.isDead = true;
                    if (optionPositions.option2.position < 1 && optionPositions.option1.position < 1) optionPositions.option2.isDead = true;
                } else {
                    if (optionPositions.option3.position < 1 && optionPositions.option2.position < 1) optionPositions.option3.isDead = true;
                }
            }
            return optionPositions;
        } catch (error) {
            handleError(error);
            return { option1: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } }, option2: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } }, option3: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } }, option4: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } } }
        }
    }
    //checks if a user has any moves possible
    const isOptionalMovesPossible = (): Boolean => {
        try {
            let optionPositions;
            for (let i = 0; i < currentPositions.length; i++) {
                if (currentPositions[i].color === userColor) {
                    if (whiteStandby !== 0 && userColor === "white") {
                        optionPositions = getOptionalPositions(0, isOptionalVisible.dice1, isOptionalVisible.dice2);
                    }
                    else if (blackStandby !== 0 && userColor === "black") {
                        optionPositions = getOptionalPositions(25, isOptionalVisible.dice1, isOptionalVisible.dice2);
                    }
                    else {
                        optionPositions = getOptionalPositions((i + 1), isOptionalVisible.dice1, isOptionalVisible.dice2);
                    }
                    if (optionPositions.option4) {
                        if (optionPositions.option1.isDead === false || optionPositions.option2.isDead === false || optionPositions.option3.isDead === false || optionPositions.option4.isDead === false) {
                            return true;
                        }
                    } else if (optionPositions.option1.isDead === false || optionPositions.option2.isDead === false || optionPositions.option3.isDead === false) {
                        return true;
                    }

                }
            };
            return false;
        } catch (error) {
            handleError(error);
            return false;
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

    const checkAndHandleUserWin = () => {
        try {
            if (whiteOut === 15) { props.setGameAlertDialogType("whiteWin"); }

            if (blackOut === 15) { props.setGameAlertDialogType("blackWin"); }
        } catch (error) {
            handleError(error);
        }

    }
    //compares pieces by their position on the board
    const comparePieces = (a: any, b: any) => {
        if (a.props.color === "white") {
            return b.props.position - a.props.position;
        }
        return a.props.position - b.props.position;
    }
    //handles the optional positions when clicking on a piece
    useEffect(() => {
        try {
            if (isOptionalVisible !== null) {
                let optionPositions;
                if (whiteStandby !== 0 && userColor === "white") {
                    optionPositions = getOptionalPositions(0, isOptionalVisible.dice1, isOptionalVisible.dice2);
                }
                else if (blackStandby !== 0 && userColor === "black") {
                    optionPositions = getOptionalPositions(25, isOptionalVisible.dice1, isOptionalVisible.dice2);
                }
                else {
                    if (currentPositions[isOptionalVisible.position - 1].piecesCount > 0) {
                        optionPositions = getOptionalPositions(isOptionalVisible.position, isOptionalVisible.dice1, isOptionalVisible.dice2);
                    } else {
                        optionPositions = null;
                    }
                }
                if (optionPositions) {
                    let optionals = [
                        <BoardPiece {...optionPositions.option1} keyValue={10007} />,
                        <BoardPiece {...optionPositions.option2} keyValue={10008} />,
                        <BoardPiece {...optionPositions.option3} keyValue={10009} />
                    ]
                    if (optionPositions.option4) {
                        optionals.push(<BoardPiece {...optionPositions.option4} keyValue={10011} />)
                        for (let index = 0; index < turnsUsed; index++) {
                            optionals.pop();
                        }
                        props.setNumTurnsLeft(4 - turnsUsed);

                    } else {
                        props.setNumTurnsLeft(2)
                        if (turnsUsed === 1) {
                            optionals.splice(0, 1);
                            optionals.splice(1, 1);
                            props.setNumTurnsLeft(1)
                        }
                        else if (turnsUsed === 2) {
                            optionals.splice(1, 1);
                            optionals.splice(1, 1);
                            props.setNumTurnsLeft(1)
                        }
                        else if (turnsUsed > 2) {
                            optionals = [];
                            props.setNumTurnsLeft(0)
                        }
                    }
                    optionals.sort(comparePieces);
                    setOptionPieces([...optionals]);
                }
                else {
                    setOptionPieces([]);
                }
                if (!isOptionalMovesPossible()) {
                    props.setGameMessage("No possible moves turn is over");
                    props.setNumTurnsLeft(0);
                    setTimeout(() => {
                        finishTurn();
                        props.setGameMessage("");
                    }, 5000);
                }
            }
            else {
                setOptionPieces([]);
            }
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
                } else if (turnsUsed > 2) {
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
            checkAndHandleUserWin();
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
            {currentPositions.map((object, i) => mapPositions(object, i))}
            {props.isTurn ? optionPieces : <></>}
            {standbyPieces}
            {outPieces}
        </>
    )
}
export default BoardPieces;

function setNewPosition(newPosition: number, setWhiteOut: any, setBlackOut: any, currentPositions: IPosition[], color: String, setWhiteStandby: any, setBlackStandby: any, setCurrentPositions: any) {
    const positions = currentPositions;
    if (newPosition > 24) {
        setWhiteOut((prevState: number) => prevState + 1);
    }
    else if (newPosition < 1) {
        setBlackOut((prevState: number) => prevState + 1);
    }
    else if (positions[newPosition - 1].color !== color && positions[newPosition - 1].color !== "") {
        if (positions[newPosition - 1].color === "white")
            setWhiteStandby((prevState: number) => prevState + 1);
        else if (positions[newPosition - 1].color === "black")
            setBlackStandby((prevState: number) => prevState + 1)
        positions[newPosition - 1].color = color;
    }
    else {
        positions[newPosition - 1].piecesCount += 1;
        positions[newPosition - 1].color = color;
    }
    setCurrentPositions(...[positions]);
}

function changeOldPosition(currentPositions: IPosition[], oldPosition: number, setWhiteStandby: any, setBlackStandby: any, whiteStandby: any, blackStandby: any, setCurrentPositions: any) {
    const positions = currentPositions;
    if (oldPosition === 0) {
        setWhiteStandby(whiteStandby - 1)
    }
    else if (oldPosition === 25) {
        setBlackStandby(blackStandby - 1)
    } else {
        positions[oldPosition - 1].piecesCount = positions[oldPosition - 1].piecesCount - 1;
        if (positions[oldPosition - 1].piecesCount === 0) {
            positions[oldPosition - 1].color = "";
        }
        setCurrentPositions(...[positions]);
    }
}
