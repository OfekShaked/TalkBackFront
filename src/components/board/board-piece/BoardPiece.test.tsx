import React from 'react';
import renderer from 'react-test-renderer';
import BoardPiece from './BoardPiece';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { mount, configure } from 'enzyme';

configure({ adapter: new Adapter() });

const onClick = jest.fn();

describe('Board piece tests', () => {
    it('renders BoardPiece component', async () => {
        const component = renderer.create(
                <BoardPiece color={"white"} position={21} isDead={false} row={1} onClick={onClick} isOptional={false} keyValue={1}></BoardPiece>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('displays white color piece', async () => {
        const component = mount(
            <BoardPiece color={"white"} position={21} isDead={false} row={1} onClick={onClick} isOptional={false} keyValue={1}></BoardPiece>
            );
        const piece = component.find('div');
        expect(piece.props().className).toContain("white");
    });

    it('displays black color piece', async () => {
        const component = mount(
            <BoardPiece color={"black"} position={21} isDead={false} row={1} onClick={onClick} isOptional={false} keyValue={1}></BoardPiece>
            );
        const piece = component.find('div');
        expect(piece.props().className).toContain("black");
    });
    
    it('correct column for piece position over 12', async () => {
        const component = mount(
            <BoardPiece color={"white"} position={21} isDead={false} row={1} onClick={onClick} isOptional={false} keyValue={1}></BoardPiece>
            );
        const piece = component.find('div');
        expect(piece.props().className).toContain("column_4");
    });
    
    it('correct column for piece position under 12', async () => {
        const component = mount(
            <BoardPiece color={"white"} position={11} isDead={false} row={1} onClick={onClick} isOptional={false} keyValue={1}></BoardPiece>
            );
        const piece = component.find('div');
        expect(piece.props().className).toContain("column_11");
    });

    it('clicking on piece is working', async () => {
        const component = mount(
            <BoardPiece color={"white"} position={11} isDead={false} row={1} onClick={onClick} isOptional={false} keyValue={1}></BoardPiece>
            );
        const piece = component.find('div');
        piece.simulate("click")
        expect(onClick).toBeCalled();
    });

    it('dead piece should not display', async () => {
        const component = mount(
            <BoardPiece color={"white"} position={11} isDead={true} row={1} onClick={onClick} isOptional={false} keyValue={1}></BoardPiece>
            );
        const piece = component.find('div');
        expect(piece.length).toBe(0);
    });

    it('optional piece should display', async () => {
        const component = mount(
            <BoardPiece color={"white"} position={11} isDead={false} row={1} onClick={onClick} isOptional={true} keyValue={1}></BoardPiece>
            );
        const piece = component.find('div');
        expect(piece.props().className).toContain("optional");
    });
})

