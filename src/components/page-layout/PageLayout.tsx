import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useStyles from './PageLayoutStyle';
import Header from '../header/Header';
import SignUp from '../../views/sign-up/SignUp';
import Login from '../../views/log-in/Login';
import Logout from '../log-out/Logout';
import ContactScreen from '../../views/contact-screen/ContactScreen';
import WebsiteDown from '../../views/website-down/WebsiteDown';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { isAuthorized } from '../../services/auth.service'
import { SocketContext } from '../../context/socketContext'
import { handleError } from '../../services/errorHandling.service'

export default function PageLayout() {
  const [currentPage, setCurrentPage] = useState("");
  const socket = useContext(SocketContext);
  const theme = useTheme();
  const classes = useStyles(theme);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);
  const [isServerOnline,setIsServerOnline] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    try {      
      const getAuth = async () => {
        setIsLoggedIn(await isAuthorized());
      }
      getAuth();
    } catch (err) {
      handleError(err);
    }
  }, [])

  useEffect(() => {
    try {
      if (isLoggedIn) {
        socket.emit("user_online", localStorage.getItem("username"));
        setCurrentPage("/contact");
      }
      else {
        socket.emit("logout");
        setCurrentPage("/signin");
      }
    } catch (err) {
      handleError(err);
    }
  }, [isLoggedIn])

  useEffect(()=>{
    setIsServerOnline(socket.connected);
    socket.on("connect",()=>{
      setIsServerOnline(socket.connected);      
    })
  },[socket])


  return (
    <div className={classes.root}>
      <CssBaseline />
      <BrowserRouter>
      <Switch>
        <Header handleDrawerOpen={handleDrawerOpen} open={open} handleDrawerClose={handleDrawerClose} isLoggedIn={isLoggedIn}></Header>

        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          {isServerOnline?<>
          <Route path="/signin" component={() => isLoggedIn ? <ContactScreen /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" component={() => isLoggedIn ? <ContactScreen /> : <SignUp/>}/>
          <Route path="/contact" component={ContactScreen} />
          <Route path="/logout" component={() => <Logout setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="*" component={() => isLoggedIn ? <ContactScreen /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          </>:
          <Route component={() =><WebsiteDown/>} />
          }
        </main>
        </Switch>
      </BrowserRouter>
    </div>
  );
}