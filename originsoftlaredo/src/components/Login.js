import React, { useState } from 'react'
import { Grid, Container, Paper, Avatar, Typography, TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import background from '../resources/bluebackground.jpg'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const useStyles = makeStyles(theme => ({
  root: {
    backgroundImage: `url(${background})`,
    height: "100vh",
    backgroundSize: "cover",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: "center"
  },
  container: {
    height: "60%",
    opacity: "80%",
    marginTop: theme.spacing(10),
    [theme.breakpoints.down(400 + theme.spacing(2) + 2)]: {
      marginTop: 0,
      width: '100%',
      height: '100%'
    },
  },
  div: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const Login = () => {
  const navigate = useNavigate();

  const classes = useStyles();
  const [body, setBody] = useState({ username: '', password: '' });
  const handleChange = e => {
    setBody({
      ...body,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = () => {

    axios.post('http://localhost:4000/api/login', body)
      .then(({ data }) => {
        localStorage.setItem("auth", "yes")
        localStorage.setItem("loggedUser", data.username)
        navigate('/app')
      })
      .catch(({ response }) => {
         console.log(response)
      })
  }

  return (
    <Grid container component='main' className={classes.root}>
      <Container component={Paper} elevation={5} maxWidth="xs" className={classes.container}>
        <div className={classes.div}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>Sign In</Typography>
          <form className={classes.form}>
            <TextField
              fullWidth
              autoFocus
              corot='primary'
              margin='normal'
              variant='outlined'
              label='Nickname'
              value={body.username}
              name='username'
              onChange={handleChange}
            />
            <TextField
              fullWidth
              type='password'
              corot='primary'
              margin='normal'
              variant='outlined'
              label='Password'
              value={body.password}
              name='password'
              onChange={handleChange}
            />
            <Button fullWidth variant='contained' color='secondary' className={classes.button} onClick={onSubmit}>
              Sign In
            </Button>
          </form>
        </div>
      </Container >
    </Grid>
  )
}

export default Login
