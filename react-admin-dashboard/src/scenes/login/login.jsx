import React, { useState } from "react";
import { auth , googleProvider,db} from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signInWithPopup, signOut } from "firebase/auth";

import {
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  textField: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  button: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
}));

function Login() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


const navigate = useNavigate();

    console.log(auth?.currentUser?.email);
  const signIn = async () => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        console.log(res.user.uid);
        var userDocRef = doc(db, "users", res.user.uid);
        const userDoc = await getDoc(userDocRef);
    
        if (userDoc.exists()) {
     
          console.log("User logged in successfully!");
          console.log(res);
          userDocRef = doc(db, "users", res.user.uid);
          console.log("here",res.user);
          await updateDoc(userDocRef,{phoneNumber:res.user.phoneNumber ,role:"admin",name:res.user.displayName});
          navigate("/dashboard")
        } else {
          console.log("Invalid UID or user not found.");
        }
      } catch (err) {
        console.error(err);
      }
  };


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.container}>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            className={classes.textField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            className={classes.textField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={signIn}
          >
            Login
          </Button>
          {/* <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={logOut}
          >
            Logout
          </Button> */}
        </div>
      </div>
    </Container>
  );
}

export default Login;
