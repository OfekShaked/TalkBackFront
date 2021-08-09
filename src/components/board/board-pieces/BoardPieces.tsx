import React, { useEffect, useState, useContext } from 'react';
import BoardPiece from '../board-piece/BoardPiece';
import { SocketContext } from '../../../context/socketContext';
import { getCurrentUser } from '../../../services/auth.service';



interface IBoardPiecesProps {
    showOptions: any;
    userColor: any;
    isOptionalVisible: any;
    setGameMessage: any;
    setNumTurnsLeft: any;
    isTurn: any;
}

interface IPosition {
    piecesCount: number,
    color: String
}


const BoardPieces = (props: IBoardPiecesProps) => {
    const socket = useContext(SocketContext);
    const { showOptions, userColor, isOptionalVisible } = props;
    const [optionPieces, setOptionPieces] = useState<any>([])
    const [standbyPieces, setStandbyPieces] = useState<any>([]);
    const [outPieces, setOutPieces] = useState<any>([]);

    const [whiteOut, setWhiteOut] = useState(0);
    const [blackOut, setBlackOut] = useState(0);
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



    const mapPositions = (position: IPosition, index: number) => {
        let positionsToShow = []
        if (position.piecesCount !== 0) {
            for (let i = 1; i <= position.piecesCount; i++) {
                if (i === 5 && position.piecesCount > 5) {
                    positionsToShow.push(<BoardPiece position={index + 1} row={i} color={position.color} isDead={false} onClick={userColor === position.color ? () => showOptions(index + 1) : null} isOptional={false}>
                        <span className="aboveFive">{position.piecesCount - i + 1}</span>
                    </BoardPiece>);
                    break;
                }
                positionsToShow.push(<BoardPiece position={index + 1} row={i} color={position.color} isDead={false} onClick={i === position.piecesCount && userColor === position.color ? () => showOptions(index + 1) : null} isOptional={false} />);
            }
        }
        return positionsToShow;
    }

    const handlePositionChosen = (oldPosition: number, newPosition: number, color: String, currentTurnsUsed: number) => {
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
    }

    const isAbleToTakePiecesOut = (color: String): Boolean => {
        if (whiteStandby !== 0 || blackStandby !== 0) return false;
        if (color === "white") {

            for (let i = 18; i > 0; i--) {
                if (currentPositions[i - 1].color === "white") return false;
            }
        }
        else {
            for (let i = 7; i <= 24; i++) {
                if (currentPositions[i - 1].color === "black") return false;
            }
        }
        return true;
    }

    const handleOptionalPosition = (position: number, move: number, color: String, currentTurnsUsed: number) => {
        let positionConfig;
        const isAllowedToTakePiecesOut = isAbleToTakePiecesOut(color);
        if (position + move > 24) {
            positionConfig = {
                position: 25,
                row: 1,
                onClick: () => handlePositionChosen(position, position + move, color, currentTurnsUsed),
                isDead: !isAllowedToTakePiecesOut
            }
        } else if (position + move < 1) {
            positionConfig = {
                position: 0,
                row: 1,
                onClick: () => handlePositionChosen(position, position + move, color, currentTurnsUsed),
                isDead: !isAllowedToTakePiecesOut
            }
        }
        else {
            positionConfig = {
                position: position + move,
                row: (currentPositions[position + move - 1].piecesCount + 1) > 5 ? 5 : (currentPositions[position + move - 1].piecesCount + 1),
                onClick: () => handlePositionChosen(position, position + move, color, currentTurnsUsed),
                isDead: !(currentPositions[position + move - 1].color === color || currentPositions[position + move - 1].color === "" || currentPositions[position + move - 1].piecesCount <= 1)
            }
        }
        return positionConfig;
    }

    const getOptionalPositionsInner = (position: number, dice1: number, dice2: number) => {
        let optionConfig = { color: userColor, isOptional: true }
        let option1, option2, option3, option4;
        if (userColor === "white") {
            if (dice1 !== dice2) {
                option1 = { ...handleOptionalPosition(position, dice1, "white", 1), ...optionConfig }
                option2 = { ...handleOptionalPosition(position, dice2, "white", 2), ...optionConfig }
                option3 = { ...handleOptionalPosition(position, dice1 + dice2, "white", 3), ...optionConfig }
                return { option1: option1, option2: option2, option3: option3 }
            } else {
                option1 = { ...handleOptionalPosition(position, dice1, "white", 1), ...optionConfig }
                option2 = { ...handleOptionalPosition(position, dice1 * 2, "white", 2), ...optionConfig }
                option3 = { ...handleOptionalPosition(position, dice1 * 3, "white", 3), ...optionConfig }
                option4 = { ...handleOptionalPosition(position, dice1 * 4, "white", 4), ...optionConfig }
                return { option1: option1, option2: option2, option3: option3, option4: option4 }
            }
        }
        else {
            if (dice1 !== dice2) {
                option1 = { ...handleOptionalPosition(position, 0 - dice1, "black", 1), ...optionConfig }
                option2 = { ...handleOptionalPosition(position, 0 - dice2, "black", 2), ...optionConfig }
                option3 = { ...handleOptionalPosition(position, 0 - dice1 - dice2, "black", 3), ...optionConfig }
                return { option1: option1, option2: option2, option3: option3 }
            } else {
                option1 = { ...handleOptionalPosition(position, 0 - dice1, "black", 1), ...optionConfig }
                option2 = { ...handleOptionalPosition(position, 0 - dice1 * 2, "black", 2), ...optionConfig }
                option3 = { ...handleOptionalPosition(position, 0 - dice1 * 3, "black", 3), ...optionConfig }
                option4 = { ...handleOptionalPosition(position, 0 - dice1 * 4, "black", 4), ...optionConfig }
                return { option1: option1, option2: option2, option3: option3 }
            }
        }
    }

    const getOptionalPositions = (position: number, dice1: number, dice2: number) => {
        let optionPositions = getOptionalPositionsInner(position, dice1, dice2);
        if (userColor === "white") {
            if (optionPositions.option4) {
                if (optionPositions.option4.position > 24 && optionPositions.option3.position > 24) optionPositions.option4.isDead = true;
                if (optionPositions.option3.position > 24 && optionPositions.option2.position > 24) optionPositions.option3.isDead = true;
                if (optionPositions.option2.position > 24 && optionPositions.option1.position > 24) optionPositions.option2.isDead = true;
            } else {
                if (optionPositions.option3.position > 24 && optionPositions.option2.position > 24) optionPositions.option3.isDead = true;
            }
        }else{
            if (optionPositions.option4) {
                if (optionPositions.option4.position < 1 && optionPositions.option3.position < 1 ) optionPositions.option4.isDead = true;
                if (optionPositions.option3.position < 1  && optionPositions.option2.position < 1 ) optionPositions.option3.isDead = true;
                if (optionPositions.option2.position < 1  && optionPositions.option1.position < 1 ) optionPositions.option2.isDead = true;
            } else {
                if (optionPositions.option3.position < 1  && optionPositions.option2.position < 1 ) optionPositions.option3.isDead = true;
            }
        }
        return optionPositions;
    }

    const isOptionalMovesPossible = (): Boolean => {
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
    }

    const finishTurn = () => {
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
    }
    useEffect(() => {

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
                    <BoardPiece {...optionPositions.option1} />,
                    <BoardPiece {...optionPositions.option2} />,
                    <BoardPiece {...optionPositions.option3} />
                ]
                if (optionPositions.option4) {
                    optionals.push(<BoardPiece {...optionPositions.option4} />)
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
    }, [isOptionalVisible, turnsUsed])

    useEffect(() => {
        if (isOptionalVisible) {
            let currentUser = getCurrentUser();
            if (isOptionalVisible.dice1 === isOptionalVisible.dice2 && turnsUsed === 4) {
                finishTurn();
            } else if (turnsUsed > 2) {
                finishTurn();
            }
        }
    }, [turnsUsed])

    useEffect(() => {
        let standbyPiecesToShow = [
            <BoardPiece color="white" position={26} row={100} onClick={null} isOptional={false} isDead={whiteStandby === 0}><span>{whiteStandby}</span></BoardPiece>,
            <BoardPiece color="black" position={26} row={101} onClick={null} isOptional={false} isDead={blackStandby === 0}><span>{blackStandby}</span></BoardPiece>,
        ]
        setStandbyPieces(standbyPiecesToShow);
    }, [blackStandby, whiteStandby])

    useEffect(() => {
        let outPiecesToShow = [
            <BoardPiece color="white" position={26} row={2} onClick={null} isOptional={false} isDead={whiteOut === 0}><span>{whiteOut}</span></BoardPiece>,
            <BoardPiece color="black" position={0} row={2} onClick={null} isOptional={false} isDead={blackOut === 0}><span>{blackOut}</span></BoardPiece>,
        ]
        setOutPieces(outPiecesToShow);
    }, [blackOut, whiteOut])


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
            console.log(err);

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
