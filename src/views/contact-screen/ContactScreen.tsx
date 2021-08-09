import React, { useState, useEffect, useContext } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import GridColDefs from './GridColDef'
import ContactDialog from '../../components/contact-actions/ContactDialog';
import './ContactScreenStyle.scss';
import Conversation from '../../components/conversation/Conversation';
import { SocketContext } from '../../context/socketContext';
import { getCurrentUser } from '../../services/auth.service';
import useOpenConversation from '../../hooks/useOpenConversation';
import useOpenBoard from '../../hooks/useOpenBoard';
import Board from '../../components/board/Board';
import GameDialog from '../../components/game-dialog/GameDialog';

const ContactScreen = () => {
    const socket = useContext(SocketContext);
    const [selectedUsername, setSelectedUsername] = useState<String>("");
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [users, setUsers] = useState<Array<any>>([]);
    const { openConversation, handleConversationOpen,handleConversationClose} = useOpenConversation();
    const [openGameDialog,setOpenGameDialog] = useState(false);
    const [playerAsking,setPlayerAsking] = useState("");
    const {openBoard,handleBoardOpen,handleBoardClose} = useOpenBoard();
    const handleDialogClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleDialogClose = (value: string) => {
        setAnchorEl(null);
        if(value==="sendMessage"){            
            handleConversationOpen();
        }else if(value==="play"){
            handleBoardOpen(getCurrentUser(),selectedUsername);
        }
        
    };
    const handleRowSelection = (e: any) => {
        setSelectedUsername(e.row.username);
    }
    const handleGameDialogClose = (status:any)=>{
        setOpenGameDialog(false);
        let senderUsername=getCurrentUser();
        if(status!=="agree"){
            socket.emit("leaveGame",{ senderUsername, selectedUsername});
        }
        else{            
            handleBoardOpen(senderUsername,selectedUsername);
        }
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
            await socket.on("askToJoinGame",(username:any)=>{                
                setPlayerAsking(username);
                setSelectedUsername(username);
                setOpenGameDialog(true);
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
            <Conversation open={openConversation} handleClose={handleConversationClose} senderUsername={getCurrentUser()} recieverUsername={selectedUsername}/>
            <Board open={openBoard} handleClose={handleBoardClose}/>
            <GameDialog open={openGameDialog} handleClose={handleGameDialogClose} player={playerAsking}/>

        </>

    );
}
export default ContactScreen;