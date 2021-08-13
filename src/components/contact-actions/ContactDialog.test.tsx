import React from 'react';
import ContactDialog from './ContactDialog';
import { SocketContext } from '../../context/socketContext';
import SocketMock from 'socket.io-mock';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount, configure } from 'enzyme';
import { ListItemText } from '@material-ui/core';

configure({ adapter: new Adapter() });
let socket = new SocketMock()

const handleClose=jest.fn();

describe('contact dialog tests', () => {
    it('renders play and send message buttons', () => {
        let modalRoot = document.createElement("div")
        modalRoot.setAttribute("id", "modal-root")
        document.querySelector("body")!.appendChild(modalRoot)
        const component = mount(
            <SocketContext.Provider value={socket.socketClient}>
                <ContactDialog id={'simple-popover'} open={true} handleClose={handleClose} anchorEl={modalRoot} isSelecterUserConnected={true}></ContactDialog>
            </SocketContext.Provider>
        );
        const contactScreen = component.find(ContactDialog);
        const listItem = contactScreen.find(ListItemText);
        expect(listItem.get(0).props.primary).toBe("Send Message");
        expect(listItem.get(1).props.primary).toBe("Play");
    });

    it('renders send message buttons', () => {
        let modalRoot = document.createElement("div")
        modalRoot.setAttribute("id", "modal-root")
        document.querySelector("body")!.appendChild(modalRoot)
        const component = mount(
            <SocketContext.Provider value={socket.socketClient}>
                <ContactDialog id={'simple-popover'} open={true} handleClose={handleClose} anchorEl={modalRoot} isSelecterUserConnected={false}></ContactDialog>
            </SocketContext.Provider>
        );
        const contactScreen = component.find(ContactDialog);
        const listItem = contactScreen.find(ListItemText);
        expect(listItem.get(0).props.primary).toBe("Send Message");
        expect(listItem.length).toBe(1);
    });

})

