import React,{useState} from 'react';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useStyles from './PageLayoutStyle';
import Header from '../header/Header';

export default function PageLayout() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header handleDrawerOpen={handleDrawerOpen} open={open} handleDrawerClose={handleDrawerClose}></Header>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        Hello
      </main>
    </div>
  );
}