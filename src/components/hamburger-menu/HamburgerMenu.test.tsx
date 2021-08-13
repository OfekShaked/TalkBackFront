import React from 'react';
import renderer from 'react-test-renderer';
import HamburgerMenu from './HamburgerMenu';
import SocketMock from 'socket.io-mock';
import { act } from 'react-dom/test-utils';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount, configure } from 'enzyme';
import { ListItemText, ListItem } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });

const handleClose = jest.fn();

describe('hamburger menu tests', () => {
    it('renders hamburger menu component', async () => {
        const component = renderer.create(
            <Router>
                <HamburgerMenu open={true} handleDrawerClose={handleClose} isLoggedIn={true}></HamburgerMenu>
            </Router>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("should have 2 links for logged in user", async () => {
        const component = mount(
            <Router>
                <HamburgerMenu open={true} handleDrawerClose={handleClose} isLoggedIn={true}></HamburgerMenu>
            </Router>
        );
        const links = component.find(ListItem);
        expect(links.length).toBe(2);
    });
    it("should render logged in user actions", async () => {
        const component = mount(
            <Router>
                <HamburgerMenu open={true} handleDrawerClose={handleClose} isLoggedIn={true}></HamburgerMenu>
            </Router>
        );
        const links = component.find(ListItemText);
        expect(links.at(0).props().primary).toBe("Open");
        expect(links.at(1).props().primary).toBe("Logout");
    });
    it("should have 2 links for guests", async () => {
        const component = mount(
            <Router>
                <HamburgerMenu open={true} handleDrawerClose={handleClose} isLoggedIn={false}></HamburgerMenu>
            </Router>
        );
        const links = component.find(ListItem);
        expect(links.length).toBe(2);
    });
    it("should render guests actions", async () => {
        const component = mount(
            <Router>
                <HamburgerMenu open={true} handleDrawerClose={handleClose} isLoggedIn={false}></HamburgerMenu>
            </Router>
        );
        const links = component.find(ListItemText);
        expect(links.at(0).props().primary).toBe("Sign-In");
        expect(links.at(1).props().primary).toBe("Register");
    });
})

