import React, { useState,useContext } from 'react';
import {SocketContext} from '../context/socketContext';

const useOpenBoard = () => {
  const [openBoard, setOpenBoard] = useState<Boolean>(false);
  const socket = useContext(SocketContext);
  const [boardPlayers,setBoardPlayers] = useState({senderUsername:"", recieverUsername:""})

  const handleBoardOpen = (senderUsername:any,recieverUsername:any): void => {
    setBoardPlayers({senderUsername:senderUsername,recieverUsername:recieverUsername})
    setOpenBoard(true);
    socket.emit("joinGame",{ senderUsername, recieverUsername})
  };

  const handleBoardClose = (): void => {
    window.location.reload()
    setOpenBoard(false);
    socket.emit("leaveGame",{ ...boardPlayers})

  };

  return {
    openBoard,
    handleBoardOpen,
    handleBoardClose,
  }
}
export default useOpenBoard;