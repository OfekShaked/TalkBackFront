import React,{useState} from 'react';
import Modal from '@material-ui/core/Modal'
import useOpen from '../../hooks/useOpenConversation'

const ModalPopup = (props:any) =>{
    const {open, handleClose} = props;
    return (
        <div>
            <Modal 
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            >
                {props.children}
            </Modal>
        </div>
    )
}
export default ModalPopup;