import React from 'react';
import renderer from 'react-test-renderer';
import Message from './Message'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount, configure } from 'enzyme';

configure({ adapter: new Adapter() });

const messages = [{text:"Hello there!",sender:"george",conversationId:"123"},{text:"Hello there!",sender:"ofek",conversationId:"123"},{text:"Hello there!",sender:"george",conversationId:"123"},{text:"Hello there!",sender:"george",conversationId:"123"},{text:"Hello there!",sender:"george",conversationId:"123"}]

describe('messages tests', () => {

    it('renders messages component', async () => {
        const component = renderer.create(
                <Message name={"ofek"} message={messages[0]}></Message>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders message from another sender', async () => {
        const component = mount(
            <Message name={"ofek"} message={messages[0]}></Message>
            );
        const messageSent = component.find('.colorWhite');
        const messageRecieved = component.find('.colorDark');
        expect(messageRecieved).toHaveLength(1);
        expect(messageSent).toHaveLength(0);
    });

    it('renders message that user sent', async () => {
        const component = mount(
            <Message name={"ofek"} message={messages[1]}></Message>
            );
        const messageSent = component.find('.colorWhite');
        const messageRecieved = component.find('.colorDark');
        expect(messageRecieved).toHaveLength(0);
        expect(messageSent).toHaveLength(1);
    });
    

    

})

