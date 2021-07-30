import React from 'react';
import './Board.scss';

const Board = () => {
    return (
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
            <div className="piece_black top_row_1 column_1" draggable="true"></div>
            <div className="piece_black top_row_2 column_1" draggable="true"></div>
            <div className="piece_black top_row_3 column_1" draggable="true"></div>
            <div className="piece_black top_row_4 column_1" draggable="true"></div>
            <div className="piece_black top_row_5 column_1" draggable="true"></div>
            <div className="piece_black top_row_1 column_2" draggable="true"></div>
            <div className="piece_black top_row_1 column_3" draggable="true"></div>
            <div className="piece_black top_row_1 column_4" draggable="true"></div>
            <div className="piece_black top_row_1 column_5" draggable="true"></div>
            <div className="piece_black top_row_1 column_6" draggable="true"></div>
            <div className="piece_black top_row_1 column_7" draggable="true"></div>
            <div className="piece_black top_row_1 column_8" draggable="true"></div>
            <div className="piece_black top_row_1 column_9" draggable="true"></div>
            <div className="piece_black top_row_1 column_10" draggable="true"></div>
            <div className="piece_black top_row_1 column_11" draggable="true"></div>
            <div className="piece_black top_row_1 column_12" draggable="true"></div>
            <div className="piece_black bottom_row_1 column_12" draggable="true"></div>
            <div className="piece_black bottom_row_2 column_12" draggable="true"></div>
            <div className="piece_black bottom_row_3 column_12" draggable="true"></div>
            <div className="piece_black bottom_row_4 column_12" draggable="true"></div>
            <div className="piece_white bottom_row_5 column_12" draggable="true"></div>


        </div>

    );
}
export default Board;