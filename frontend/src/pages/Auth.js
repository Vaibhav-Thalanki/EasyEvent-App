import React, { useState, useRef } from "react";
import "./Auth.css";
import {useUserContext} from '../context/auth-context'
const AuthPage = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const authContext=useUserContext()
  const [logIn, setLogIn] = useState(true);
  const [signInSuccess,setSignInSuccess] = useState(null)
 

  const submitHandler = () => {
    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;
    

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    // backend req
    let requestBody = {
      query: `
            query Login($email: String!, $password: String!){
                login(email:$email, password:$password){
                    userId
                    token
                    tokenExpiration
                }
            }`,
        variables:{
          email,password
        }
    };
    if (!logIn) {
      requestBody = {
        query: `
                mutation CreateUser($email: String!, $password: String!){
                    createUser(userInput:{email:$email, password:$password}){
                        _id email
                    }
                }`,
                variables:{
                  email,password
                }
      };
    }

    fetch("https://easy-event-app.vercel.app/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        if(resData.data.login && resData.data.login.token){
            authContext.setUser(prev=>({...prev,token:resData.data.login.token,userId:resData.data.login.userId,tokenExpiration:resData.data.login.tokenExpiration}))
        }
        else{
          setSignInSuccess(resData)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  const switchModeHandler = () => {
    setLogIn(!logIn);
  };

  return (
    <>
      <div
        style={{
          textAlign: "center",
          marginBottom: "-10px",
          marginTop: "100px",
        }}
      >
        {logIn ? <h2>Login</h2> : <h2>SignUp</h2>}
        {signInSuccess? <p>Success!, Go Login</p>:null}
      </div>

      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          submitHandler();
        }}
      >
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={emailInputRef} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={passwordInputRef} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={switchModeHandler}>
            Switch to {logIn ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AuthPage;
