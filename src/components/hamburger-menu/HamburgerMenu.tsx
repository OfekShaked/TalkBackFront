import React from 'react';
import { Drawer,IconButton,Divider,List,ListItem,ListItemIcon,ListItemText} from '@material-ui/core';
import {ChevronLeft,ChevronRight,Inbox,Mail} from '@material-ui/icons';
import useStyles from './HamburgerStyle';
import { useTheme } from '@material-ui/core';


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
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <Inbox /> : <Mail />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
    );
}
export default HamburgerMenu;