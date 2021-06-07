import React, { Component } from "react";
import axios from "axios";
import { Redirect } from 'react-router-dom';
import {backendUrlUser} from '../BackendURL';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
// import { Link } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginform: {
                contactNo: "",
                password: ""
            },
            loginformErrorMessage: {
                contactNo: "",
                password: ""
            },
            loginformValid: {
                contactNo: false,
                password: false,
                buttonActive: false
            },
            successMessage: "",
            errorMessage: "",
            loadHome: false,
            loadRegister: false,
            userId: ""
        }
    }

    handleClick = () => {
        this.setState({ loadRegister: true })
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const { loginform } = this.state;
        this.setState({
            loginform: { ...loginform, [name]: value }
        });
        this.validateField(name, value);
        // console.log(this.state.loginform[name], name);
    }

    login = () => {
        const { loginform } = this.state;
        axios.post(backendUrlUser+'/login', loginform)
            .then(response => {
                console.log(response);
                let userId = response.data.userId;
                sessionStorage.setItem("contactNo", response.data.contactNo);
                sessionStorage.setItem("userId", userId);
                sessionStorage.setItem("userName", response.data.name);;
                this.setState({ loadHome: true, userId: userId })
                
                window.location.reload();

            }).catch(error => {
                console.log(error.message);
                let errorstatus = error.message.substr(-3,);
                if(Number(errorstatus) === 406){
                    this.setState({errorMessage: "Enter correct password"})
                }else if(Number(errorstatus) === 404){
                    this.setState({errorMessage: "Enter registered contact number"})
                }
                
                sessionStorage.clear();
            })
        // console.log(this.state.loginform.contactNo, this.state.loginform.password);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.login();
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.loginformErrorMessage;
        let formValid = this.state.loginformValid;
        switch (fieldName) {
            case "contactNo":
                let cnoRegex = /^[1-9]\d{9}$/
                if (!value || value === "") {
                    fieldValidationErrors.contactNo = "Please enter your contact Number";
                    formValid.contactNo = false;
                } else if (!value.match(cnoRegex)) {
                    fieldValidationErrors.contactNo = "Contact number should be a valid 10 digit number";
                    formValid.contactNo = false;
                } else {
                    fieldValidationErrors.contactNo = "";
                    formValid.contactNo = true;
                }
                break;
            case "password":
                if (!value || value === "") {
                    fieldValidationErrors.password = "Password is manadatory";
                    formValid.password = false;
                    } else if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/) && value.match(/[!@#$%^&*]/))) {
                        fieldValidationErrors.password = "Please Enter a valid password"
                        formValid.password = false;
                } else {
                    fieldValidationErrors.password = "";
                    formValid.password = true;
                }
                break;
            default:
                break;
        }
        formValid.buttonActive = formValid.contactNo && formValid.password;
        this.setState({
            loginformErrorMessage: fieldValidationErrors,
            loginformValid: formValid,
        });
    }

    render() {
        
        if (this.state.loadHome) {return <Redirect to={'/home/' + this.state.userId} />}
        if (this.state.loadRegister === true) {return <Redirect to={'/register'} />}
        if(!sessionStorage.getItem("userId")){
        return (
            <Container component="main" maxWidth="xs">
        <CssBaseline />
        <br/>
        
        <div className="card shadow-lg"  >
                        <div className="card-body">
          <div >
              <br/><br/>
              <Typography component="h1" variant="h3">Login</Typography>
              <br/>
              
                        <form  onSubmit={this.handleSubmit}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="contactNo"
                                label="Contact Number"
                                name="contactNo"
                                autoFocus
                                onChange={this.handleChange}
                            /><br/>
                            {this.state.loginformErrorMessage.contactNo ? 
							(<span className="text-danger">
							 {this.state.loginformErrorMessage.contactNo}</span>): null}
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={this.handleChange}
                            /><br/>
                            {this.state.loginformErrorMessage.password ?
							(<span className="text-danger">
							{this.state.loginformErrorMessage.password} 
							</span>): null}
                            <p style={{textAlign:"left"}}>*
							marked feilds are mandatory </p>
                            {this.state.errorMessage ? (<span className="text-danger">
							{this.state.errorMessage} </span>): null}
                            <br/>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!this.state.loginformValid.buttonActive}
                            >
                                Login
                            </Button>
                            <br/>
                            <br/>

                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={this.handleClick} 
                            >
                                Click here to Register
                            </Button>
                            <br/>
                            <br/>
                        </form>
          </div>
          </div>
          </div>
      </Container>
              )
    }
    else{
        return <h2 style={{color:"green"}}>You are successfully logged in!</h2>
     }}
}

export default Login;