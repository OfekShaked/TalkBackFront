import React from 'react';
import renderer from 'react-test-renderer';
import ContactScreen from './ContactScreen';
import { SocketContext } from '../../context/socketContext';
import { screen, render } from '@testing-library/react'
import SocketMock from 'socket.io-mock';
import { act } from 'react-dom/test-utils';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount, configure } from 'enzyme';
import { DataGrid } from '@material-ui/data-grid';

configure({ adapter: new Adapter() });
let socket = new SocketMock()


describe('contact screen tests', () => {
    it('renders contact screen view', () => {
        const component = renderer.create(
            <ContactScreen ></ContactScreen>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders grid columns', () => {
        const component = mount(
            <SocketContext.Provider value={socket.socketClient}>
                <ContactScreen ></ContactScreen>
            </SocketContext.Provider>
        );
        const contactScreen = component.find(ContactScreen);
        const grid = contactScreen.find(DataGrid);
        expect(grid.get(0).props.columns.length).toBe(3);
    });

    it("renders grid rows", async () => {  
         let component = await mount(
            <SocketContext.Provider value={socket.socketClient}>
                <ContactScreen ></ContactScreen>
            </SocketContext.Provider>
        );   
        await act(async()=>{
            await socket.emit("getUsers", {offlines:[{ username: "ofek123" }, { username: "ofek141" }, { username: "ofek43" }, { username: "o23fek" }, { username: "ofe21k" }],onlines:[{ username: "ofek123" }, { username: "ofek141" }, { username: "ofek43" }, { username: "o23fek" }, { username: "ofe21k" }]});
        })
        await component.update();
        const contactScreen = await component.find(ContactScreen);
        const grid = await contactScreen.find(DataGrid);
        expect(grid.at(0).props().rows.length).toBe(5);
        expect(grid.at(1).props().rows.length).toBe(5);

    })

})

