import React from 'react';
import renderer from 'react-test-renderer';
import ModalPopup from './ModalPopup';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount, configure } from 'enzyme';
import { Typography } from '@material-ui/core';

configure({ adapter: new Adapter() });

describe('modal popup tests', () => {

    it('pop up children is shown when open', async () => {
        const component = mount(
            <ModalPopup open={true}><Typography>Hello</Typography></ModalPopup>
        );
        const typography = component.find(Typography);
        expect(typography.at(0).props().children).toBe("Hello");
    });

    it('pop up children is not shown when close', async () => {
        const component = mount(
            <ModalPopup open={false}><Typography>Hello</Typography></ModalPopup>
        );
        const typography = component.find(Typography);
        expect(typography.length).toBe(0);
    });

    

})

