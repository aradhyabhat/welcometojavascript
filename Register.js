import React, { Component} from "react";
import axios from "axios";
import { Redirect } from 'react-router-dom';
import {backendUrlUser} from '../BackendURL';
// import Login from './login'
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
import { Link } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
class Register extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            loginform: {
                name: "",
                emailid:"",
                contactNo: "",
                password: ""
            },
            loginformErrorMessage: {
                name: "",
                emailid:"",
                contactNo: "",
                password: ""
            },
            loginformValid: {
                name: false,
                emailid:false,
                contactNo: false,
                password: false,
                buttonActive: false
            },
            successMessage: "",
            errorMessage: "",
            loadSuccessPage: false,
            loadlogin: false,
        }
    }
    
    handleClick = () => {
        this.setState({ loadlogin: true ,loadSuccessPage : false})
        console.log(String(this.state.loadlogin));
        
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

    register = () => {
        const { loginform } = this.state;
        axios.post(backendUrlUser+'/register', loginform)
            .then(response => {
                this.setState({ loadSuccessPage: true , successMessage : response.data})

            }).catch(error => {
                console.log(error);
                let errorstatus = error.message.substr(-3,);
                if(Number(errorstatus) === 406){
                    this.setState({errorMessage: "THe contact No. has already been registered"})
                }
                else{
                this.setState({errorMessage:"Registration failed! Please try again" })
            }})
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.register();
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.loginformErrorMessage;
        let formValid = this.state.loginformValid;
        switch (fieldName) {
            case "name":
                let nameRegex = /^[A-z]([A-z \s]+)[A-z]$/
                if(!value || value === ""){
                    fieldValidationErrors.name = "Please enter your name";
                    formValid.name = false;
                }else if(!value.match(nameRegex)){
                    fieldValidationErrors.name = "Name should contain only alphabets and space";
                    formValid.name = false;
                }else{
                    fieldValidationErrors.name = "";
                    formValid.name = true;
                }
                break;
            case "emailid":
                let emailRegex = /^([a-z 0-9]+)@([a-z]+)(\.com)$/
                if(!value || value === ""){
                    fieldValidationErrors.emailid = "Please enter your Email ID";
                    formValid.emailid = false;
                }else if(!value.match(emailRegex)){
                    fieldValidationErrors.emailid = "Email ID should be in the format example@emp.com";
                    formValid.emailid = false;
                }else{
                    fieldValidationErrors.emailid = "";
                    formValid.emailid = true;
                }
                break;
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
        formValid.buttonActive = formValid.contactNo && formValid.password && formValid.name && formValid.emailid; 
        this.setState({
            loginformErrorMessage: fieldValidationErrors,
            loginformValid: formValid
        });
    }

    render() {
        if (this.state.loadSuccessPage === true) {
            return <Typography>
            <h3 style={{color:"green"}}>{this.state.successMessage}</h3>
            <Link href="#" onClick={this.handleClick} color="primary" >Click here to login</Link>
        </Typography>}
        else if (this.state.loadlogin === true){ 
            return  <Redirect to={'/login'} />
        }
        else{
       return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className="card shadow-lg"  >
                        <div className="card-body">
          <div >
              
              <Typography component="h1" variant="h3">Join Us</Typography>
              <form  onSubmit={this.handleSubmit}>
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      name="name"
                      autoComplete="name"
                      autoFocus
                      onChange={this.handleChange}
                  />
                  {this.state.loginformErrorMessage.name ? (<span className="text-danger">{this.state.loginformErrorMessage.name}</span>): null}
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Id"
                      name="emailid"
                      autoComplete="email"
                      onChange={this.handleChange}
                  />
                  {this.state.loginformErrorMessage.emailid ? (<span className="text-danger">{this.state.loginformErrorMessage.emailid} </span>) : null}
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="contactNo"
                      label="Contact Number"
                      name="contactNo"
                      onChange={this.handleChange}
                  />
                  {this.state.loginformErrorMessage.contactNo ? (<span className="text-danger">{this.state.loginformErrorMessage.contactNo}</span>): null}
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
                  />
                  {this.state.loginformErrorMessage.password ? (<span className="text-danger">{this.state.loginformErrorMessage.password} </span>): null}
                  <p style={{textAlign:"left"}}>* marked feilds are mandatory </p><br/>
                  {this.state.errorMessage ? (<span className="text-danger">{this.state.errorMessage} </span>): null}<br/>
                  <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!this.state.loginformValid.buttonActive}
                  >
                     REGISTER
                  </Button>
              </form>
              <br/><br/>
          </div></div></div>
      </Container>
       );
    }
}
}

export default Register;