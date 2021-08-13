import React from 'react';
import renderer from 'react-test-renderer';
import Input from './Input';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount, configure } from 'enzyme';
import { Button } from '@material-ui/core';

configure({ adapter: new Adapter() });

const sendMessage = jest.fn();
const setMessage = jest.fn();

describe('input tests', () => {
    it('renders input component', async () => {
        const component = renderer.create(
                <Input sendMessage={sendMessage} setMessage={setMessage} message={""}></Input>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('click on the send message button works', async () => {
        const component = mount(
            <Input sendMessage={sendMessage} setMessage={setMessage} message={""}></Input>
        );
        const btn = component.find(Button);
        btn.simulate("click");
        expect(sendMessage).toBeCalled();
    });

    it('click enter sends a message',async()=>{
        const component = mount(
            <Input sendMessage={sendMessage} setMessage={setMessage} message={""}></Input>
        );
        const input = component.find('input');
        input.simulate('keyPress', {
            key: 'Enter',
            keyCode: 13,
            which: 13,
        });
        expect(sendMessage).toBeCalled();
    })
    it('text change works',async()=>{
        const component = mount(
            <Input sendMessage={sendMessage} setMessage={setMessage} message={""}></Input>
        );
        const input = component.find('input');
        input.simulate('change', { target: { value: 'Hello' } })
        expect(setMessage).toBeCalledWith("Hello");
    })
    

})

