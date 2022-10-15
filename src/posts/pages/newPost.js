import React,{useContext} from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

import "./newPost.css";
import { useForm } from "../../shared/hooks/form-hook";
import {useHttpClient} from '../../shared/hooks/http-hook';
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {AuthContext} from '../../shared/context/Auth-context';
import { useHistory } from "react-router-dom";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPost = () => {  
  const {isLoading,error,sendRequest,errorHandler}=useHttpClient();
  const userId=useContext(AuthContext).userId;
  const token=useContext(AuthContext).token;
  const history=useHistory();
  const [inputHandler,formState]=useForm({
    title: {
      value: "",
      isValid: false,
    },
    description: {
      value: "",
      isValid: false,
    },
    address: {
      value: "",
      isValid: false,
    },
    image:{
      value:null,
      isValid:false,
    }
  },false);

  const postSubmitHandler = async(event) => {
    event.preventDefault();
    try{
      const formData=new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/posts/",
        "POST",
        formData,
        {
          Authorization: "Bearer " + token,
        }
      );      
      
      history.push('/'+userId+"/posts");      
    }
    catch(err){
      console.log(err);
    }

    // console.log(formState.inputs); 
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler}/>
    <form className="post-form" onSubmit={postSubmitHandler}>
      {isLoading && <LoadingSpinner asOverlay/>}
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
      <ImageUpload id="image" errorText="Please provide and image" onInput={inputHandler}/>
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
    </React.Fragment>
  );
};
export default NewPost;
