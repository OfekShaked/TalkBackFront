import React from 'react';
import Modal from '@material-ui/core/Modal'

interface IModalPopupProps {
    open: boolean;
    handleClose?: any;
    children: any;
}

const ModalPopup = (props: IModalPopupProps) => {
    const { open, handleClose } = props;
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