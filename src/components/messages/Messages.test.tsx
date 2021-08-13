import React from 'react';
import renderer from 'react-test-renderer';
import Messages from './Messages';
import Message from './message/Message'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount, configure } from 'enzyme';

configure({ adapter: new Adapter() });

const messages = [{text:"Hello there!",sender:"george",conversationId:"123"},{text:"Hello there!",sender:"george",conversationId:"123"},{text:"Hello there!",sender:"george",conversationId:"123"},{text:"Hello there!",sender:"george",conversationId:"123"},{text:"Hello there!",sender:"george",conversationId:"123"}]

describe('messages tests', () => {

    it('renders messages component', async () => {
        const component = renderer.create(
                <Messages name={"ofek"} messages={messages}></Messages>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders all messages', async () => {
        window.HTMLElement.prototype.scrollIntoView = function() {}; //mocking a scrollIntoView cause its not implemented
        const component = mount(
            <Messages name={"ofek"} messages={messages}></Messages>
            );
        const messagesInDiv = component.find(Message);
        expect(messagesInDiv).toHaveLength(5);
    });

    it('has not messages',async()=>{
        window.HTMLElement.prototype.scrollIntoView = function() {}; //mocking a scrollIntoView cause its not implemented
        const component = mount(
            <Messages name={"ofek"} messages={[]}></Messages>
            );
        const messagesInDiv = component.find(Message);
        expect(messagesInDiv).toHaveLength(0);
    })
    

    

})

