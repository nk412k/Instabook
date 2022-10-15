import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import React, { useContext, useState } from "react";
import "./Auth.css";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/Auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const { sendRequest, error, errorHandler, isLoading } = useHttpClient();

  const auth = useContext(AuthContext);

  const [inputHandler, formState, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image:undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image:{
            value:null,
            isValid:false,
          }
        },
        false
      );
    }
    setIsLogin((prevState) => !prevState);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLogin) {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signin",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(response.userId,response.token);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const formData=new FormData();
        formData.append('name', formState.inputs.name.value);
        formData.append("image", formState.inputs.image.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );

        auth.login(response.userId,response.token);
      } catch (err) {

        console.log(err);
      }
    }
    
    // console.log(formState.inputs);
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
        {isLoading && <LoadingSpinner asOverlay />}
      <Card className="authentication">
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={formSubmitHandler}>
          {!isLogin && (
            <Input
              element="input"
              type="text"
              id="name"
              label="Your Name"
              onInput={inputHandler}
              errorText="Please enter a name."
              validators={[VALIDATOR_REQUIRE()]}
            />
          )}
          {!isLogin && <ImageUpload id='image' center onInput={inputHandler} errorText="Please provied an image"/>}
          <Input
            element="input"
            type="text"
            id="email"
            label="E-mail"
            onInput={inputHandler}
            errorText="Please enter a valid email address."
            validators={[VALIDATOR_EMAIL()]}
          />
          <Input
            element="input"
            type="password"
            id="password"
            label="Password"
            onInput={inputHandler}
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLogin ? "Login" : "SignUp"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          Switch to {isLogin ? "SignUp" : "Login"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
