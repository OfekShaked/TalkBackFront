import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import ContactDialog from './ContactDialog';


const ContactScreen = () => {

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
    };
    const handleRowSelection = (e:any) => {
        handleClickOpen();
        setSelected(e.selectionModel);
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'username',
            headerName: 'User Name',
            width: 150,
            editable: false,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            editable: false,
        }
    ];

    return (
        <>
            <DataGrid
                rows={[]}
                columns={columns}
                pageSize={5}
                autoHeight
                disableSelectionOnClick
                onRowClick={handleRowSelection}
            />
            <ContactDialog open={open} onClose={handleClose} />
        </>

    );
}
export default ContactScreen;