import React from 'react';
import { Drawer,IconButton,Divider,List,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';
import {ChevronLeft,ChevronRight,AccountCircle,Add,Launch,ExitToApp} from '@material-ui/icons';
import useStyles from './HamburgerStyle';
import { useTheme } from '@material-ui/core';
import {NavLink} from 'react-router-dom';


const HamburgerMenu = (props:any) =>{
  const theme = useTheme();
  const classes = useStyles(theme);
  
    return (
      <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={props.open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={props.handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </div>
      <Divider />
      <List>
        {!props.isLoggedIn ? (
          <>
          <ListItem button
          key="Sign-In"
          component={NavLink} to="/signin">
          <ListItemIcon><AccountCircle></AccountCircle></ListItemIcon>
          <ListItemText primary="Sign-In"></ListItemText>
        </ListItem>
        <ListItem button
          key="Register"
          component={NavLink} to="/register">
          <ListItemIcon><Add></Add></ListItemIcon>
          <ListItemText primary="Register"></ListItemText>
        </ListItem>
        </>):<>
        <ListItem button
          key="Open"
          component={NavLink} to="/contact">
          <ListItemIcon><Launch></Launch></ListItemIcon>
          <ListItemText primary="Open"></ListItemText>
        </ListItem><ListItem button
          key="Logout"
          component={NavLink} to="/Logout">
          <ListItemIcon><ExitToApp></ExitToApp></ListItemIcon>
          <ListItemText primary="Logout"></ListItemText>
        </ListItem></>}

      </List>
    </Drawer>
    );
}
export default HamburgerMenu;