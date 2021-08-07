import React, { useState } from 'react';

const useOpenBoard = () => {
  const [openBoard, setOpenBoard] = useState<Boolean>(false);

  const handleBoardOpen = (): void => {
    setOpenBoard(true);
  };

  const handleBoardClose = (): void => {
    setOpenBoard(false);
  };

  return {
    openBoard,
    handleBoardOpen,
    handleBoardClose,
  }
}
export default useOpenBoard;