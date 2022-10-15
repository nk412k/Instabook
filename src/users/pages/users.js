import React, {useEffect, useState} from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import UserList from "../components/userList";

const Users=()=>{
    const [users,setUsers]=useState([]);
    const {isLoading,error,sendRequest,errorHandler}=useHttpClient();
    useEffect(()=>{
      const fetchUser=async()=>{
        try{
          const response =await sendRequest(process.env.REACT_APP_BACKEND_URL+"/users/");
          // console.log(response.users);
          setUsers(response.users);

        }
        catch(error){
          console.log(error);
        }
      }
      fetchUser();
    },[])
    return(
      <React.Fragment>
        {isLoading && <LoadingSpinner asOverlay classNmae='center'/>}
        <ErrorModal error={error} onClear={errorHandler}/>
        {!isLoading && <UserList items={users}/>}
      </React.Fragment>
    )
}

export default Users;