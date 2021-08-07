import React,{useEffect, useState} from 'react';
import BoardPiece from '../board-piece/BoardPiece';

interface IBoardPiecesProps{
    move:any, 
    setMove:any,
    showOptions:any;
    userColor:any
    isOptionalVisible:any
}

interface IPosition{
    piecesCount:number,
    color:String
}

const BoardPieces = (props:IBoardPiecesProps) => {

    const {move,setMove,showOptions,userColor,isOptionalVisible} = props;
    const [optionPieces,setOptionPieces] = useState<any>([])

    const positions:Array<IPosition> = [
        {piecesCount:2,color:"white"},
        {piecesCount:0,color:""},
        {piecesCount:0,color:""},
        {piecesCount:0,color:""},
        {piecesCount:0,color:""},
        {piecesCount:5,color:"black"},
        {piecesCount:0,color:""},
        {piecesCount:3,color:"black"},
        {piecesCount:0,color:""},
        {piecesCount:0,color:""},
        {piecesCount:0,color:""},
        {piecesCount:5,color:"white"},
        {piecesCount:5,color:"black"},
        {piecesCount:0,color:""},
        {piecesCount:0,color:""},
        {piecesCount:0,color:""},
        {piecesCount:3,color:"white"},
        {piecesCount:0,color:""},
        {piecesCount:5,color:"white"},
        {piecesCount:0,color:""},
        {piecesCount:0,color:""},
        {piecesCount:0,color:""},
        {piecesCount:0,color:""},
        {piecesCount:2,color:"black"},
    ]

    const whiteOut:number = 0
    const blackOut:number=0;

    const [currentPositions,setCurrentPositions] = useState(positions);

    const mapPositions = (position:IPosition, index:number) =>{
        let positionsToShow=[]
        if(position.piecesCount!==0){
            for (let i = 1; i <= position.piecesCount; i++) {
                positionsToShow.push(<BoardPiece position={index+1} row={i} color={position.color} isDead={false} onClick={i===position.piecesCount&&userColor===position.color?()=>showOptions(index+1):null} isOptional={false}/>);
            }
        }
        return positionsToShow;
    }

    const movePiece = () =>{
        if(move){
            const piece = positions[move.index];
            positions[move.index]={piecesCount:positions[move.index].piecesCount-1,color:positions[move.index].color};
            if(piece.color==="white"){
                positions[move.index+move.first+move.second]={piecesCount:positions[move.index+move.first+move.second].piecesCount+1,color:piece.color};
            }
            else if(piece.color==="black"){
                positions[move.index+move.first+move.second]={piecesCount:positions[move.index-move.first-move.second].piecesCount+1,color:piece.color};
            }
            setCurrentPositions(positions);
        }
        setMove(null);
    }

    const handlePositionChosen = (oldPosition:number,newPosition:number) =>{

    }

    const handleOptionalPosition=(position:number,move:number,color:String)=>{
        let positionConfig;
        if(position+move>24){
            positionConfig={
            position:25,
            row:1,
            onClick:()=>handlePositionChosen(position,position+move),
            isDead:false
            }
        }else if(position+move<1){
            positionConfig={
                position:0,
                row:1,
                onClick:()=>handlePositionChosen(position,position+move),
                isDead:false
            }
        }
        else{
            positionConfig={
                position:position+move,
                row:(currentPositions[position+move-1].piecesCount+1)>5?5:(currentPositions[position+move-1].piecesCount+1),
                onClick:()=>handlePositionChosen(position,position+move),
                isDead:!(currentPositions[position+move-1].color===color||currentPositions[position+move-1].color==="")
                }
        }
        return positionConfig;
    }

    const getOptionalPositions = (position:number,dice1:number,dice2:number) =>{
        let optionConfig = {color:userColor,isOptional:true}
        let option1,option2,option3;
        if(userColor==="white"){                        
                option1={...handleOptionalPosition(position,dice1,"white"),...optionConfig}
                option2={...handleOptionalPosition(position,dice2,"white"),...optionConfig} 
                option3={...handleOptionalPosition(position,dice1+dice2,"white"),...optionConfig}
                return {option1:option1,option2:option2,option3:option3}
        }
        else{
            option1={...handleOptionalPosition(position,0-dice1,"black"),...optionConfig}
            option2={...handleOptionalPosition(position,0-dice2,"black"),...optionConfig} 
            option3={...handleOptionalPosition(position,0-dice1-dice2,"black"),...optionConfig}
            return {option1:option1,option2:option2,option3:option3}
        }
    }

    useEffect(() => {
        movePiece();
    },[move])

    useEffect(()=>{
        
        if(isOptionalVisible!==null){
            const optionPositions = getOptionalPositions(isOptionalVisible.position,isOptionalVisible.dice1,isOptionalVisible.dice2);
                let optionals=[
                    <BoardPiece {...optionPositions.option1}/>,
                    <BoardPiece {...optionPositions.option2}/>,
                    <BoardPiece {...optionPositions.option3}/>
                ]        
                setOptionPieces(optionals);
            }
    },[isOptionalVisible])

    return (
        <> 
        {currentPositions.map((object,i)=>mapPositions(object,i))}
        {optionPieces}
        </>
    )
}
export default BoardPieces;