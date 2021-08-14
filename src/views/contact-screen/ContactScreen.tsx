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
import MessageNotification from '../../components/message-notification/MessageNotification';
import {handleError} from '../../services/errorHandling.service';

const ContactScreen = () => {
    const socket = useContext(SocketContext);
    const [selectedUsername, setSelectedUsername] = useState<String>("");
    const [isSelecterUserConnected,setIsSelecterUserConnected] = useState(true)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<Array<any>>([]);
    const [offlineUsers, setOfflineUsers] = useState<Array<any>>([]);
    const { openConversation, handleConversationOpen,handleConversationClose} = useOpenConversation();
    const [openGameDialog,setOpenGameDialog] = useState(false);
    const [playerAsking,setPlayerAsking] = useState("");
    const {openBoard,handleBoardOpen,handleBoardClose} = useOpenBoard();
    const [openMessageNotification,setOpenMessageNotification] = useState(false);
    const [senderName,setSenderName] = useState("");
    const [messageText,setMessageText] = useState("");
    const handleDialogClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const messageNotificationClose = (event?: React.SyntheticEvent, reason?: string)=>{
        if (reason === 'clickaway') {
            return;
          }
          setOpenMessageNotification(false);
          setSenderName("");
          setMessageText("");
    }
    const handleDialogClose = (value: string) => {
        try{
        setAnchorEl(null);
        if(value==="sendMessage"){            
            handleConversationOpen();
        }else if(value==="play"){
            handleBoardOpen(getCurrentUser(),selectedUsername);
        }
    }catch (err) {
        handleError(err)
    }
    };
    const handleRowSelection = (e: any) => {
        try{
        setSelectedUsername(e.row.username);
        setIsSelecterUserConnected(e.row.status==="online");
        }catch(error){
            handleError(error)
        }
    }
    const handleGameDialogClose = (status:any)=>{
        try{
        setOpenGameDialog(false);
        let senderUsername=getCurrentUser();
        if(status!=="agree"){
            socket.emit("leaveGame",{ senderUsername, selectedUsername});
        }
        else{            
            handleBoardOpen(senderUsername,selectedUsername);
        }
    }catch (err) {
        handleError(err)
    }
    }
    const dialogOpen = Boolean(anchorEl);
    const id = dialogOpen ? 'simple-popover' : undefined;
    const columns = GridColDefs({handleClick:handleDialogClick});

    useEffect(() => {
        try {
            const socketGet = async () =>{
            await socket.on("getUsers", (users: any) => {     
                const onlineUsers = users.onlines.filter((user:any)=>{return user.username!==getCurrentUser()})         
                const userRows = onlineUsers.map((user: any,index:any) => ({id:index, username: user.username, status: "online" }))
                const offlineUserRows = users.offlines.map((user: any,index:any) => ({id:index, username: user.username, status: "offline" }))
                setOnlineUsers(userRows);           
                setOfflineUsers(offlineUserRows);
            })
            await socket.on("askToJoinGame",(username:any)=>{                
                setPlayerAsking(username);
                setSelectedUsername(username);
                setOpenGameDialog(true);
            })

            await socket.on("getNewMessage",(messsageData:any)=>{
                setMessageText(messsageData.text);
                setSenderName(messsageData.sender);
                setOpenMessageNotification(true);                
            })
        }
        socketGet();
        } catch (err) {
            handleError(err)
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
            handleError(err)
        }
    }, []);

    

    return (
        <>
            <DataGrid
                className="paper"
                rows={onlineUsers}
                columns={columns.columns}
                pageSize={5}
                rowsPerPageOptions={[5,4,3]}
                autoHeight
                disableExtendRowFullWidth={true}
                onRowClick={handleRowSelection}
            />
            <DataGrid
                className="paper"
                rows={offlineUsers}
                columns={columns.columns}
                pageSize={5}
                rowsPerPageOptions={[5,4,3]}
                autoHeight
                disableExtendRowFullWidth={true}
                onRowClick={handleRowSelection}
            />
            <ContactDialog open={dialogOpen} handleClose={handleDialogClose} id={id} anchorEl={anchorEl} isSelecterUserConnected={isSelecterUserConnected}/>
            <Conversation open={openConversation} handleClose={handleConversationClose} senderUsername={getCurrentUser()} recieverUsername={selectedUsername}/>
            <Board open={openBoard} handleClose={handleBoardClose}/>
            <GameDialog open={openGameDialog} handleClose={handleGameDialogClose} player={playerAsking} />
            <MessageNotification notificationOpen={openMessageNotification} sender={senderName} text={messageText} onNotificationClose={messageNotificationClose}/>
        </>

    );
}
export default ContactScreen;