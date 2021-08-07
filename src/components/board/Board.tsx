import React,{useState} from 'react';
import './Board.scss';
import ModalPopup from '../modal/ModalPopup';
import BoardPieces from './board-pieces/BoardPieces';
import BoardPiece from './board-piece/BoardPiece';
import {Close} from '@material-ui/icons';
import {Button} from '@material-ui/core';
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'

const Board = (props: any) => {

    let reactDice1:any;
    let reactDice2:any;
    const [move,setMove] = useState(null);
    const [userColor,setUserColor] = useState("white");
    const [isOptionalVisible,setIsOptionalVisible] = useState<null|any>(null);

    const rollDoneCallback = (num:number) =>{
        console.log("You rolled : " + num);
        
    }
    const rollAll = () =>{
        reactDice1.rollAll();
        reactDice2.rollAll();
    }

    const showOptions = (position:number) =>{        
        setIsOptionalVisible({dice1:reactDice1.state.totalValue, dice2:reactDice2.state.totalValue,position:position});        
    }

    return (
        <ModalPopup open={props.open}>
            <div className="frame">
                <div className="leftContainer">
                <Button onClick={props.handleClose}><Close className="fillIcon"/></Button>
                <Button variant="contained" color="primary" onClick={rollAll}>Roll Dice</Button>
                </div>
                <div className="centerContainer">
                <ReactDice
                    numDice={1}
                    rollDone={rollDoneCallback}
                    ref={(dice:any) => {reactDice1 = dice}}
                    disableIndividual={true}
                    dieSize={30}
                    faceColor="#000000"
                    dotColor="#fffff"
                />
                <ReactDice
                numDice={1}
                rollDone={rollDoneCallback}
                ref={(dice:any) => {reactDice2 = dice}}
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
                    <BoardPieces move={move} setMove={setMove} showOptions={showOptions} userColor={userColor} isOptionalVisible={isOptionalVisible}/>


                </div>
            </div>
        </ModalPopup>
    );
}
export default Board;