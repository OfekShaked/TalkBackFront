import React from 'react';
import Board from './Board';
import BoardPiece from './board-piece/BoardPiece'
import { SocketContext } from '../../context/socketContext';
import SocketMock from 'socket.io-mock';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount, configure, ReactWrapper } from 'enzyme';
import { CircularProgress,Button } from '@material-ui/core';
import {act} from 'react-dom/test-utils';
import ReactDice from 'react-dice-complete'

configure({adapter: new Adapter()});

let socket = new SocketMock()
const handleClose = jest.fn();

describe("Board component", () => {
    let component:ReactWrapper

    beforeEach(()=>{
         component = mount(
            <SocketContext.Provider value={socket.socketClient}>
                <Board open={true} handleClose={handleClose}></Board>
            </SocketContext.Provider>
        );
    })
    it('Board should wait for other user to join', async() => {
        const waiting = component.find(CircularProgress);
        expect(waiting.length).toBe(1);
        
    });
    describe("game started",()=>{

    beforeEach(async()=>{
        await act(async()=>{
            await socket.emit("startGame",{color:"white",startColor:"white"});
        })
        component.update();
    });

    it('Board should get rid of loading circle when game starts', async() => {
        const waiting = component.find(CircularProgress);
        expect(waiting.length).toBe(0);
        
    });
    describe("dices tests",()=>{
        it('Board should start with 2 dices', async() => {
            const dices = component.find(ReactDice);
            expect(dices.length).toBe(2);
        });
    })

    describe("Board pieces",()=>{
        it("should display 30 board pieces at start",async()=>{
            const pieces = component.find(BoardPiece);
            const visiblePieces = pieces.findWhere(p=>p.props().isDead===false)
            expect(visiblePieces.length).toBe(30);
        })

        it("should have 15 black pieces",async()=>{
            const pieces = component.find(BoardPiece);
            const visiblePieces = pieces.findWhere(p=>p.props().isDead===false&&p.props().color==="black")
            expect(visiblePieces.length).toBe(15);
        })

        it("should have 15 white pieces",async()=>{
            const pieces = component.find(BoardPiece);
            const visiblePieces = pieces.findWhere(p=>p.props().isDead===false&&p.props().color==="white")
            expect(visiblePieces.length).toBe(15);
        })

    })
});
})

