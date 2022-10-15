import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import "./PostItem.css";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../shared/context/Auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const PostItem = (props) => {
  const [showMap, setShowMap] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);
  const closeMapHandler = () => setShowMap(false);
  const openMapHandler = () => setShowMap(true);
  const {isLoading,error,sendRequest,errorHandler}=useHttpClient();
  const auth=useContext(AuthContext);

  const openDeleteModalHandler = () => setDeleteModal(true);
  const closeDeleteModalHandler = () => setDeleteModal(false);
  const confirmDeleteModalHandler = async() => {
    try{
      setDeleteModal(false);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/posts/" + props.id,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
    }
    catch(err){
      console.log(err);
    }
  };


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <Modal
        show={showMap}
        header={props.address}
        onCancel={closeMapHandler}
        contentClass="post-item__modal-content"
        footerClass="post-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={17} />
        </div>
      </Modal>
      <Modal
        show={showDeleteModal}
        header="Are you sure?"
        onCancel={closeDeleteModalHandler}
        // contentClass="post-item__modal-content"
        footerClass="post-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={closeDeleteModalHandler}>
              Cancel
            </Button>
            <Button danger onClick={confirmDeleteModalHandler}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Are you sure you want to proceed and delete the post? Later it cannot
          be undone
        </p>
      </Modal>
      <li className="post-item">
        <Card className=".post-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="post-item__image">
            <img
              src={process.env.REACT_APP_ASSET_URL+`/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="post-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="post-item__actions">
            <Button inverse onClick={openMapHandler}>
              View on Map
            </Button>
            {auth.userId === props.creator && (
              <Button to={`/posts/${props.id}`}>Edit</Button>
            )}
            {auth.userId === props.creator && (
              <Button danger onClick={openDeleteModalHandler}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PostItem;
