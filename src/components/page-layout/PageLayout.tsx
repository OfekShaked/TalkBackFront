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
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { isAuthorized } from '../../services/auth.service'
import { SocketContext } from '../../context/socketContext'


export default function PageLayout() {
  const [currentPage, setCurrentPage] = useState("");
  const socket = useContext(SocketContext);
  const theme = useTheme();
  const classes = useStyles(theme);
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);

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
      console.log(err);

    }
  }, [])

  useEffect(() => {
    try {
      if (isLoggedIn) {
        socket.emit("user_online", localStorage.getItem("username"));
        setCurrentPage("/contact");
      }
      else {
        setCurrentPage("/signin");
      }
    }catch (err) {
      console.log(err);

    }
  }, [isLoggedIn])


  return (
    <div className={classes.root}>
      <CssBaseline />
      <BrowserRouter>
        <Header handleDrawerOpen={handleDrawerOpen} open={open} handleDrawerClose={handleDrawerClose} isLoggedIn={isLoggedIn}></Header>

        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <Route path="/" render={() => {
            return (<Redirect to={currentPage} />)
          }} />
          <Route path="/signin" component={() => isLoggedIn? <ContactScreen />:<Login setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="/register" component={isLoggedIn? ContactScreen : SignUp} />
          <Route path="/contact" component={ContactScreen} />
          <Route path="/logout" component={() => <Logout setIsLoggedIn={setIsLoggedIn} />}/>
    
        </main>
      </BrowserRouter>
    </div>
  );
}