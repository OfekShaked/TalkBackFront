import React, { useState, useEffect, useContext } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import GridColDefs from './GridColDef'
import ContactDialog from '../../components/contact-actions/ContactDialog';
import './ContactScreenStyle.scss';
import Conversation from '../../components/conversation/Conversation';
import { SocketContext } from '../../context/socketContext';
import { getCurrentUser } from '../../services/auth.service';
import useOpen from '../../hooks/useOpen';

const ContactScreen = () => {
    const socket = useContext(SocketContext);
    const [selectedUsername, setSelectedUsername] = useState<String>("");
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [users, setUsers] = useState<Array<any>>([]);
    const { open, handleClose,handleOpen} = useOpen();
    const handleDialogClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleDialogClose = (value: string) => {
        setAnchorEl(null);
        if(value==="sendMessage"){            
            handleOpen();
        }
        
    };
    const handleRowSelection = (e: any) => {
        setSelectedUsername(e.row.username);
    }
    const dialogOpen = Boolean(anchorEl);
    const id = dialogOpen ? 'simple-popover' : undefined;
    const columns = GridColDefs({handleClick:handleDialogClick});

    useEffect(() => {
        try {
            const socketGet = async () =>{
            await socket.on("getUsers", (users: any) => {
                const userRows = users.map((user: any,index:any) => ({id:index, username: user.username, status: "online" }))
                setUsers(userRows);
            })
        }
        socketGet();
        } catch (err) {
            console.log(err);

        }
    }, []);

    useEffect(() => {
        try {
            const socketSend = async () =>{
                await socket.emit("ask_for_users", getCurrentUser());
            }
            socketSend();
        }
        catch (err) {
            console.log(err);
        }
    }, []);

    

    return (
        <>
            <DataGrid
                className="paper"
                rows={users}
                columns={columns.columns}
                pageSize={5}
                autoHeight
                disableExtendRowFullWidth={true}
                onRowClick={handleRowSelection}
            />
            <ContactDialog open={dialogOpen} handleClose={handleDialogClose} id={id} anchorEl={anchorEl} />
            <Conversation open={open} handleClose={handleClose} senderUsername={getCurrentUser()} recieverUsername={selectedUsername}/>
        </>

    );
}
export default ContactScreen;