import PostList from "../components/PostList";
import {useParams} from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";


const UserPosts=()=>{
    const userId=useParams().userId;
    const [userPosts,setUserPosts]=useState([]);
    const {isLoading,error,sendRequest,errorHandler} =useHttpClient();
    useEffect(()=>{
      const fetchData=async()=>{
        try{
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL+"/posts/user/" + userId
          );
        setUserPosts(responseData.posts);
        }
        catch(error){
          console.log(error);
        }        
      }
      fetchData();
    },[sendRequest,userId]);

    const postDeleteHandler=(postId)=>{
      setUserPosts(prevPosts=>prevPosts.filter(p=>p.id!==postId));
    }
    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={errorHandler} />
        {isLoading && <LoadingSpinner asOverlay className="center" />}
        {!isLoading && userPosts && (
          <PostList items={userPosts} onDeletePost={postDeleteHandler} />
        )}
      </React.Fragment>
    );
};

export default UserPosts;