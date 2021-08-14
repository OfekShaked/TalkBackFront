import React,{useState,useContext} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import useStyles from './LoginStyle';
import { useTheme } from '@material-ui/core/styles';
import useInput from '../../hooks/useInput';
import {login} from '../../services/auth.service'
import { useHistory } from "react-router-dom";
import {SocketContext} from '../../context/socketContext';
import {handleError} from '../../services/errorHandling.service';

const Login = (props:any) => {
    const socket = useContext(SocketContext);
    const theme = useTheme();
    const classes = useStyles(theme);
    const history = useHistory();

    const usernameRecieved = useInput('');
    const password = useInput('');
    const [credentialError,setCredentialError] = useState("")

    const onSubmit = async (e:any) => {
        try{
        e.preventDefault();
        const userData:any = { "username":usernameRecieved.value, "password":password.value};        
        if(await login(userData,setCredentialError)){
            await socket.emit("user_online",userData.username);
            props.setIsLoggedIn(true);
            history.push("/contact")
        }
    }catch(error){
        handleError(error)
    }
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <form className={classes.form} method="post" onSubmit={onSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="string"
                                {...usernameRecieved}
                                error={credentialError!==""}
                                helperText={credentialError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                {...password}
                                error={credentialError!==""}
                                helperText={credentialError}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Log In
                    </Button>
                </form>
            </div>
        </Container>
    );
}

export default Login;