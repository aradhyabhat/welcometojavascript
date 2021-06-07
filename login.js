import React, { Component } from "react";
import axios from "axios";
import { Redirect } from 'react-router-dom';
import {backendUrlUser} from '../BackendURL';
import { ProgressSpinner } from 'primereact/progressspinner';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';

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
            userId: "",
            show:true
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
    componentWillMount() {
        window.scrollTo(0, 0)
    }
    login = () => {
        const { loginform } = this.state;
        // console.log(this.state.loginform)
        axios.post(backendUrlUser+'/login', loginform)
            .then(response => {
                console.log(response);
                let userId = response.data.userId;
                sessionStorage.setItem("contactNo", response.data.contactNo);
                sessionStorage.setItem("userId", userId);
                sessionStorage.setItem("userName", response.data.name);;
                this.setState({ loadHome: true, userId: userId,errorMessage:"" ,show:false})
                window.location.reload();
             

            }).catch((error) => {
         
               this.setState({errorMessage:error.response.data.message})
            //  this.errorMessage = error.message;
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
                    } else if (!((value.match(/[a-z]/) && value.match(/[0-9]/) && value.match(/\W/) && value.match(/[A-Z]/)))) {
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
            successMessage: ""
        });
    }

    render() {
        if (this.state.loadHome === true) return <Redirect to={'/home/' + this.state.userId} />
        else if (this.state.loadRegister === true) return <Redirect to={'/register'} />
        else{
        return (
            <div>
                  {/* {
                this.state.show ?
                    <div id="details" className="details-section">

                        <div className="text-center">
                            <ProgressSpinner></ProgressSpinner>
                        </div>
                    </div> : null
            } */}
            <div className="loginSection"> 
                <section id="" >    {/* *ngIf="!registerPage"  */}
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-4 offset-4 ">
                                
                                <form className="form bg-light shadow-lg p-4 mb-4 bg-white rounded-lg" onSubmit={this.handleSubmit}> {/* [formGroup]="loginForm" (ngSubmit)="login()" */}
                                <h1>Login</h1>
                                    <div className="form-group  ml-2 mr-2">
                                        <label htmlFor="uContactNo">Contact Number<span className="text-danger">*</span></label>
                                        <input
                                            type="number"
                                            value={this.state.loginform.contactNo}
                                            onChange={this.handleChange}
                                            id="uContactNo"
                                            name="contactNo"
                                            className="form-control"
                                        />
                                    </div>
                                    {this.state.loginformErrorMessage.contactNo ? (<span className="text-danger">
                                        {this.state.loginformErrorMessage.contactNo}
                                    </span>)
                                        : null}

                                    <div className="form-group  ml-2 mr-2">
                                        <label htmlFor="uPass">Password<span className="text-danger">*</span></label>
                                        <input
                                            type="password"
                                            value={this.state.loginform.password}
                                            onChange={this.handleChange}
                                            id="uPass"
                                            name="password"
                                            className="form-control"
                                        />
                                    </div>
                                    {this.state.loginformErrorMessage.password ? (<span className="text-danger">
                                        {this.state.loginformErrorMessage.password}
                                    </span>)
                                        : null}
                                    <br/><span><span className="text-danger">*</span> marked fields are mandatory</span>
                                    <br />
                                    <div className="form-group  ml-2 mr-2">
                                        <div className="text-danger">
                                            <h6>{this.state.errorMessage }</h6>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!this.state.loginformValid.buttonActive}
                                        className="btn btn-primary btn-block"
                                    >
                                        Login
                                    </button>
                                
                                <br />
                                <br/>
                                {/* <!--can be a button or a link based on need --> */}
                                <button className="btn btn-primary btn-block" onClick={this.handleClick} >Click here to Register</button>
                               <br/>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
                {/* <div * ngIf= "!registerPage" >
            <router-outlet></router-outlet>
            </div > */}
                {/* *ngIf="!registerPage" */}
                {/* </div > */}
            </div>
            </div>

        )
    }
}
}

export default Login;