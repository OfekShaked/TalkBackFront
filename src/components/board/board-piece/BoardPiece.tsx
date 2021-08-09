import React, { useState, useEffect } from 'react';

interface BoardPieceProps{
    color:String;
    position:number;
    isDead:Boolean;
    row:number;
    onClick:any|null;
    isOptional:Boolean;
    children?: JSX.Element;
}

const BoardPiece = (props: BoardPieceProps) => {
    const { color, position, isDead,row,isOptional } = props;
    //position can be 0-24 where 0 is outside(eaten)
    const [topOrBottom,setTopOrBottom] = useState<String>("");

    const [column, setColumn] = useState<number>();

    useEffect(() => {        
        handleColumn();        
    },[position])


    const handleColumn = (): void => {        
        setTopOrBottom(position>12?"top":"bottom");
        if (position > 12) {
            let columnNum:number;
            switch(position){
                case 13: columnNum=12; break;
                case 14: columnNum=11; break;
                case 15: columnNum=10; break;
                case 16: columnNum=9; break;
                case 17: columnNum=8; break;
                case 18: columnNum=7; break;
                case 19: columnNum=6; break;
                case 20: columnNum=5; break;
                case 21: columnNum=4; break;
                case 22: columnNum=3; break;
                case 23: columnNum=2; break;
                case 24: columnNum=1; break;
                default: columnNum=0; break;

            }
            if(position<=0){
                columnNum=0;
            }
            setColumn(columnNum);
        }
        else {
            setColumn(position);
        }
    }

    return (
        <>
        {!isDead?
            <div className={`piece_${color} ${topOrBottom}_row_${row} column_${column} ${isOptional?"optional":""} ${props.onClick?"canBeMoved":""}`} draggable="true" onClick={props.onClick}>
                {props.children}
            </div>
        :<></>}
        </>
    )
}
export default BoardPiece;