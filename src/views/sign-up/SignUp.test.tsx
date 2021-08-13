import React from 'react';
import renderer from 'react-test-renderer';
import SignUp from './SignUp';
import { SocketContext } from '../../context/socketContext';
import SocketMock from 'socket.io-mock';
import { register } from '../../services/auth.service'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount, configure } from 'enzyme';

configure({adapter: new Adapter()});

jest.mock('../../services/auth.service', () => {
    return {
        register: jest.fn((userData:any) => {
            return true;
        })
    }
});


let socket = new SocketMock()

describe("signup component", () => {
    it('renders signup page', () => {
        const component = renderer.create(
            <SignUp></SignUp>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('signup page inputs to start empty', () => {
        const component = renderer.create(
            <SocketContext.Provider value={socket.socketClient}>
                <SignUp></SignUp>
            </SocketContext.Provider>,
        );
        const testInstance = component.root;
        const usernameInput = testInstance.findAllByType('input')[0];
        const passwordInput = testInstance.findAllByType('input')[1];
        expect(usernameInput.props.value).toEqual('');
        expect(passwordInput.props.value).toEqual('');
    });

    it('signup succesfull', () => {

        const wrapper = mount(
            <SocketContext.Provider value={socket.socketClient}>
                <SignUp></SignUp>
            </SocketContext.Provider>
        );
        const loginWrapper = wrapper.find('SignUp');
        expect(loginWrapper.length).toBe(1);
        const form = loginWrapper.find('form');
        form.simulate('submit');
        expect(register).toBeCalled();
    });

})

