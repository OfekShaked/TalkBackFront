import React from 'react';
import {AppBar, IconButton, Typography,Toolbar} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import useStyles from './HeaderStyles';
import clsx from 'clsx';
import HamburgerMenu from '../hamburger-menu/HamburgerMenu';
import { useTheme } from '@material-ui/core';


const Header = (props:any) =>{
    const theme = useTheme();
    const classes = useStyles(theme);
    return (
      <>
              <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: props.open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, props.open && classes.hide)}
          >
            <Menu/>
          </IconButton>
          <Typography variant="h6" noWrap>
            Persistent drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <HamburgerMenu open={props.open} handleDrawerClose={props.handleDrawerClose}></HamburgerMenu>
      </>
    );
}
export default Header;