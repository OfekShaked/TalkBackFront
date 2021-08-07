import React, { useState } from 'react';

const useOpenConversation = () => {
  const [openConversation, setOpenConversation] = useState<Boolean>(false);

  const handleConversationOpen = (): void => {
    setOpenConversation(true);
  };

  const handleConversationClose = (): void => {
    setOpenConversation(false);
  };

  return {
    openConversation,
    handleConversationOpen,
    handleConversationClose,
  }
}
export default useOpenConversation;