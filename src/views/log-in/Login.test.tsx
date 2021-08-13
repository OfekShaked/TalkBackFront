import React from 'react';
import renderer from 'react-test-renderer';
import Login from './Login';
import { SocketContext } from '../../context/socketContext';
import SocketMock from 'socket.io-mock';
import { login } from '../../services/auth.service'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount, configure } from 'enzyme';

configure({adapter: new Adapter()});

jest.mock('../../services/auth.service', () => {
    return {
        login: jest.fn((userData:any) => {
            return true;
        })
    }
});


let socket = new SocketMock()
const isLoggedIn = jest.fn();

describe("login component", () => {
    it('renders login page', () => {
        const component = renderer.create(
            <Login setIsLoggedIn={null}></Login>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('log in page inputs to start empty', () => {
        const component = renderer.create(
            <SocketContext.Provider value={socket.socketClient}>
                <Login setIsLoggedIn={isLoggedIn}></Login>
            </SocketContext.Provider>,
        );
        const testInstance = component.root;
        const usernameInput = testInstance.findAllByType('input')[0];
        const passwordInput = testInstance.findAllByType('input')[1];
        expect(usernameInput.props.value).toEqual('');
        expect(passwordInput.props.value).toEqual('');
    });

    it('log in succesfull', () => {

        socket.on("user_online",async(username:any)=>{
            expect(username).toBe("");
        })

        const wrapper = mount(
            <SocketContext.Provider value={socket.socketClient}>
                <Login setIsLoggedIn={isLoggedIn}></Login>
            </SocketContext.Provider>
        );
        const loginWrapper = wrapper.find('Login');
        expect(loginWrapper.length).toBe(1);
        const form = loginWrapper.find('form');
        form.simulate('submit');
        expect(login).toBeCalled();
    });

})

