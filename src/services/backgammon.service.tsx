import { handleError } from './errorHandling.service';
import BoardPiece from '../components/board/board-piece/BoardPiece';

interface IPosition {
    piecesCount: number,
    color: String
}

 //map the pieces on the board
export const mapPositions = (position: IPosition, index: number,userColor:any,showOptions:any) => {
    try {
        let positionsToShow = []
        if (position.piecesCount !== 0) {
            for (let i = 1; i <= position.piecesCount; i++) { //show for each position in the board
                if (i === 5 && position.piecesCount > 5) { //show for each row in each position
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

//checks if all the pieces of the same color are in the last quarter
export const isAbleToTakePiecesOut = (color: String,blackStandby:any,whiteStandby:any,currentPositions:any): Boolean => {
    try {
        if (color === "white") {
            if (whiteStandby !== 0) return false;
            for (let i = 18; i > 0; i--) { //checks if white is only in the last quarter
                if (currentPositions[i - 1].color === "white") return false;
            }
        }
        else {
            if (blackStandby !== 0) return false;
            for (let i = 7; i <= 24; i++) { //checks if black is only in the last quarter
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
    export const handleOptionalPosition = (position: number, move: number, color: String, currentTurnsUsed: number, prevIsDead: Boolean,blackStandby:any,whiteStandby:any,currentPositions:any,handlePositionChosen:any) => {
        try {
            let positionConfig;
            const isAllowedToTakePiecesOut = isAbleToTakePiecesOut(color,blackStandby,whiteStandby,currentPositions);
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

    export function tuple<T extends any[]>(...a: T) { return a;}
    //return all the options for a move of a piece
    export const getOptionalPositionsInner = (position: number, dice1: number, dice2: number,blackStandby:any,whiteStandby:any,currentPositions:any,userColor:any,handlePositionChosen:any) => {
        try {
            let optionConfig = { color: userColor, isOptional: true }
            let stateConfig = tuple(blackStandby,whiteStandby,currentPositions,handlePositionChosen)
            let option1, option2, option3, option4;
            if (userColor === "white") {
                if (dice1 !== dice2) {
                    option1 = { ...handleOptionalPosition(position, dice1, "white", 1, false,...stateConfig), ...optionConfig }
                    option2 = { ...handleOptionalPosition(position, dice2, "white", 2, false,...stateConfig), ...optionConfig }
                    option3 = { ...handleOptionalPosition(position, dice1 + dice2, "white", 3, option1.isDead && option2.isDead,...stateConfig), ...optionConfig }
                    return { option1: option1, option2: option2, option3: option3 }
                } else {
                    option1 = { ...handleOptionalPosition(position, dice1, "white", 1, false,...stateConfig), ...optionConfig }
                    option2 = { ...handleOptionalPosition(position, dice1 * 2, "white", 2, option1.isDead,...stateConfig), ...optionConfig }
                    option3 = { ...handleOptionalPosition(position, dice1 * 3, "white", 3, option2.isDead,...stateConfig), ...optionConfig }
                    option4 = { ...handleOptionalPosition(position, dice1 * 4, "white", 4, option3.isDead,...stateConfig), ...optionConfig }
                    return { option1: option1, option2: option2, option3: option3, option4: option4 }
                }
            }
            else { //black pieces options
                if (dice1 !== dice2) {
                    option1 = { ...handleOptionalPosition(position, 0 - dice1, "black", 1, false,...stateConfig), ...optionConfig }
                    option2 = { ...handleOptionalPosition(position, 0 - dice2, "black", 2, false,...stateConfig), ...optionConfig }
                    option3 = { ...handleOptionalPosition(position, 0 - dice1 - dice2, "black", 3, option1.isDead && option2.isDead,...stateConfig), ...optionConfig }
                    return { option1: option1, option2: option2, option3: option3 }
                } else {
                    option1 = { ...handleOptionalPosition(position, 0 - dice1, "black", 1, false,...stateConfig), ...optionConfig }
                    option2 = { ...handleOptionalPosition(position, 0 - dice1 * 2, "black", 2, option1.isDead,...stateConfig), ...optionConfig }
                    option3 = { ...handleOptionalPosition(position, 0 - dice1 * 3, "black", 3, option2.isDead,...stateConfig), ...optionConfig }
                    option4 = { ...handleOptionalPosition(position, 0 - dice1 * 4, "black", 4, option3.isDead,...stateConfig), ...optionConfig }
                    return { option1: option1, option2: option2, option3: option3, option4: option4 }
                }
            }
        } catch (error) {
            handleError(error);
            return { option1: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } }, option2: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } }, option3: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } }, option4: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } } }
        }
    }

    //fixed positions and show dead ones for pieces out
    export const getOptionalPositions = (position: number, dice1: number, dice2: number,blackStandby:any,whiteStandby:any,currentPositions:any,userColor:any,handlePositionChosen:any) => {
        try {
            let optionPositions = getOptionalPositionsInner(position, Math.max(dice1,dice2), Math.min(dice2,dice1),blackStandby,whiteStandby,currentPositions,userColor,handlePositionChosen);
                if (optionPositions.option4) {
                    if (optionPositions.option4.position > 24 && optionPositions.option3.position > 24) optionPositions.option4.isDead = true;
                    if (optionPositions.option3.position > 24 && optionPositions.option2.position > 24) optionPositions.option3.isDead = true;
                    if (optionPositions.option2.position > 24 && optionPositions.option1.position > 24) optionPositions.option2.isDead = true;
                    if (optionPositions.option4.position < 1 && optionPositions.option3.position < 1) optionPositions.option4.isDead = true;
                    if (optionPositions.option3.position < 1 && optionPositions.option2.position < 1) optionPositions.option3.isDead = true;
                    if (optionPositions.option2.position < 1 && optionPositions.option1.position < 1) optionPositions.option2.isDead = true;
                } else {
                    if (optionPositions.option3.position > 24 && optionPositions.option2.position > 24) optionPositions.option3.isDead = true;
                    if (optionPositions.option1.position > 24 || optionPositions.option2.position > 24) optionPositions.option3.isDead = true;
                    if (optionPositions.option3.position < 1 && optionPositions.option2.position < 1) optionPositions.option3.isDead = true;
                    if (optionPositions.option1.position < 1 || optionPositions.option2.position < 1) optionPositions.option3.isDead = true;
                } 
            return optionPositions;
        } catch (error) {
            handleError(error);
            return { option1: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } }, option2: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } }, option3: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } }, option4: { isDead: true, position: 0, color: "white", row: 1, isOptional: false, onClick: () => { } } }
        }
    }
    //checks if a user has any moves possible
    export const isOptionalMovesPossible = (currentPositions:any,userColor:any,whiteStandby:any,blackStandby:any,isOptionalVisible:any,handlePositionChosen:any): Boolean => {
        try {
            let optionPositions;
            let stateConfig = tuple(blackStandby,whiteStandby,currentPositions,userColor,handlePositionChosen);
            for (let i = 0; i < currentPositions.length; i++) {
                if (currentPositions[i].color === userColor) {
                    if (whiteStandby !== 0 && userColor === "white") {
                        optionPositions = getOptionalPositions(0, isOptionalVisible.dice1, isOptionalVisible.dice2,...stateConfig);
                    }
                    else if (blackStandby !== 0 && userColor === "black") {
                        optionPositions = getOptionalPositions(25, isOptionalVisible.dice1, isOptionalVisible.dice2,...stateConfig);
                    }
                    else {
                        optionPositions = getOptionalPositions((i + 1), isOptionalVisible.dice1, isOptionalVisible.dice2,...stateConfig);
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
    //checks if any user won the game and announce it
    export const checkAndHandleUserWin = (blackOut:any,whiteOut:any,props:any,currentPositions:any) => {
        try {
            if (whiteOut === 15) { props.setGameAlertDialogType("whiteWin"); return;}

            if (blackOut === 15) { props.setGameAlertDialogType("blackWin"); return;}

            let blackShown = false;
            let whiteShown = false;
            for (let index = 0; index < currentPositions.length; index++) {
                if(currentPositions[index].color==="white") whiteShown=true;
                if(currentPositions[index].color==="black") blackShown=true;
                if(blackShown&&whiteShown) return;
            }
            if(whiteShown){
                props.setGameAlertDialogType("blackWin"); 
                return;
            }
            else{
                props.setGameAlertDialogType("whiteWin"); 
                return;
            }
        } catch (error) {
            handleError(error);
        }

    }
    //compares pieces by their position on the board
    export const comparePieces = (a: any, b: any) => {
        if (a.props.color === "white") {
            return b.props.position - a.props.position;
        }
        return a.props.position - b.props.position;
    }

    //change the position of a piece that is inside the board when clicking on an optional piece
    export const changeOldPosition =(currentPositions: IPosition[], oldPosition: number, setWhiteStandby: any, setBlackStandby: any, whiteStandby: any, blackStandby: any, setCurrentPositions: any) =>{
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
    //change the position of a piece that is outside the board when clicking on an optional piece
    export const setNewPosition = (newPosition: number, setWhiteOut: any, setBlackOut: any, currentPositions: IPosition[], color: String, setWhiteStandby: any, setBlackStandby: any, setCurrentPositions: any) => {
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
    
    export const  showOptionalPositionsOnPieceClick = (blackStandby: number, whiteStandby: number, currentPositions: IPosition[], userColor: any, handlePositionChosen: (oldPosition: number, newPosition: number, color: String, currentTurnsUsed: number) => Promise<void>, isOptionalVisible: any, turnsUsed: number, props: any, setOptionPieces: React.Dispatch<any>, finishTurn: () => void) => {
        let stateConfig = tuple(blackStandby, whiteStandby, currentPositions, userColor, handlePositionChosen);
        if (isOptionalVisible !== null) {
            let optionPositions;
            if (whiteStandby !== 0 && userColor === "white") {
                optionPositions = getOptionalPositions(0, isOptionalVisible.dice1, isOptionalVisible.dice2, ...stateConfig);
            }
            else if (blackStandby !== 0 && userColor === "black") {
                optionPositions = getOptionalPositions(25, isOptionalVisible.dice1, isOptionalVisible.dice2, ...stateConfig);
            }
            else {
                if (currentPositions[isOptionalVisible.position - 1].piecesCount > 0) {
                    optionPositions = getOptionalPositions(isOptionalVisible.position, isOptionalVisible.dice1, isOptionalVisible.dice2, ...stateConfig);
                } else {
                    optionPositions = null;
                }
            }
            if (optionPositions) {
                let optionals = [
                    <BoardPiece {...optionPositions.option1} keyValue={10007} />,
                    <BoardPiece {...optionPositions.option2} keyValue={10008} />,
                    <BoardPiece {...optionPositions.option3} keyValue={10009} />
                ];
                if (optionPositions.option4) { //turns for double dices
                    optionals.push(<BoardPiece {...optionPositions.option4} keyValue={10011} />);
                    for (let index = 0; index < turnsUsed; index++) {
                        optionals.pop();
                    }
                    props.setNumTurnsLeft(4 - turnsUsed);
    
                } else { //turns for normal dice
                    props.setNumTurnsLeft(2);
                    if (turnsUsed === 1) {
                        optionals.splice(0, 1);
                        optionals.splice(1, 1);
                        props.setNumTurnsLeft(1);
                    }
                    else if (turnsUsed === 2) {
                        optionals.splice(1, 1);
                        optionals.splice(1, 1);
                        props.setNumTurnsLeft(1);
                    }
                    else if (turnsUsed > 2) {
                        optionals = [];
                        props.setNumTurnsLeft(0);
                    }
                }
                optionals.sort(comparePieces); //sort options by the largest move to lowest
                setOptionPieces([...optionals]);
            }
            else {
                setOptionPieces([]);
            }
            //check if there are any optional moves at all and set turn over if there arent any
            if (!isOptionalMovesPossible(currentPositions, userColor, whiteStandby, blackStandby, isOptionalVisible, handlePositionChosen)) {
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
    }
    
    