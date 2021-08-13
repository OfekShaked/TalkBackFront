import React from 'react';
import renderer from 'react-test-renderer';
import Header from './Header';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount, configure } from 'enzyme';
import { IconButton } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });

const handleClose = jest.fn();
const handleOpen = jest.fn();

describe('header tests', () => {
    it('renders header component', async () => {
        const component = renderer.create(
            <Router>
                <Header open={true} handleDrawerClose={handleClose} handleDrawerOpen={handleOpen} isLoggedIn={true}></Header>
            </Router>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('click on the menu button works', async () => {
        const component = mount(
            <Router>
                <Header open={true} handleDrawerClose={handleClose} handleDrawerOpen={handleOpen} isLoggedIn={true}></Header>
            </Router>
        );
        const iconBtn = component.find(IconButton).at(0);
        iconBtn.simulate("click");
        expect(handleOpen).toBeCalled();
    });

    

})

