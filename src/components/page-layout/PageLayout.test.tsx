import React from 'react';
import renderer from 'react-test-renderer';
import PageLayout from './PageLayout';
import { SocketContext } from '../../context/socketContext';
import SocketMock from 'socket.io-mock';
import { isAuthorized } from '../../services/auth.service'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount, configure } from 'enzyme';
import {act} from 'react-dom/test-utils';

configure({adapter: new Adapter()});

jest.mock('../../services/auth.service', () => ({
      isAuthorized: jest.fn(),
      getCurrentUser: jest.fn(()=>{return "ofek"})
}));


let socket = new SocketMock()

describe("page layout component", () => {
    it('renders PageLayout component', async() => {
        (isAuthorized as jest.Mock).mockImplementation(()=>{return false;})
        const component = renderer.create(
            <PageLayout></PageLayout>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('is not authorized', async () => {
        (isAuthorized as jest.Mock).mockImplementation(()=>{return false;})
        const component = await mount(
            <SocketContext.Provider value={socket.socketClient}>
                <PageLayout></PageLayout>
            </SocketContext.Provider>
        );
        expect(component.text()).toContain("Sign In")
    });

    it('is authorized', async () => {
        (isAuthorized as jest.Mock).mockImplementation(()=>{return true;})
        let component:any ;
        await act(async ()=>{
            component = await mount(
            <SocketContext.Provider value={socket.socketClient}>
                <PageLayout></PageLayout>
            </SocketContext.Provider>
        )
        });
        if (!component) {
            throw new Error("User is null");
          }
        expect(component).toBeDefined()
        expect(component.text()).toContain("Status")
        
    });

})

