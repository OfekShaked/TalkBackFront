import React from 'react';
import GameAlertDialog from './GameAlertDialog';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount, configure } from 'enzyme';
import { DialogTitle,Button } from '@material-ui/core';

configure({ adapter: new Adapter() });

const handleClose = jest.fn();

describe('Game Alert Dialog tests', () => {

    it("shows user left message", async()=>{
        const component = mount(
            <GameAlertDialog open={true} handleClose={handleClose} gameAlertDialogType={"userLeft"}></GameAlertDialog>
        )
        const title = component.find(DialogTitle);
        expect(title.length).toBe(1);
        expect(title.props().children).toContain("You win");
    })

    it("shows black win message", async()=>{
        const component = mount(
            <GameAlertDialog open={true} handleClose={handleClose} gameAlertDialogType={"blackWin"}></GameAlertDialog>
        )
        const title = component.find(DialogTitle);
        expect(title.length).toBe(1);
        expect(title.props().children).toContain("Black won");
    })

    it("shows white win message", async()=>{
        const component = mount(
            <GameAlertDialog open={true} handleClose={handleClose} gameAlertDialogType={"whiteWin"}></GameAlertDialog>
        )
        const title = component.find(DialogTitle);
        expect(title.length).toBe(1);
        expect(title.props().children).toContain("White won");
    })

    it("handle close should work",async()=>{
        const component = mount(
            <GameAlertDialog open={true} handleClose={handleClose} gameAlertDialogType={"whiteWin"}></GameAlertDialog>
        )
        const btn = component.find(Button);
        expect(btn.length).toBe(1);
        btn.simulate('click')
        expect(handleClose).toBeCalled();
    })

    it("should display nothing when closed",async()=>{
        const component = mount(
            <GameAlertDialog open={false} handleClose={handleClose} gameAlertDialogType={"whiteWin"}></GameAlertDialog>
        )
        const btn = component.find(Button);
        expect(btn.length).toBe(0);
        expect(handleClose).toBeCalledTimes(0);
    })


})

