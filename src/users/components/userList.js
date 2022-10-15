import Card from "../../shared/components/UIElements/Card";
import UserItem from "./userItem";
import "./userList.css";

const UserList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No user found</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {props.items.map((user) => {
        return (
          <UserItem
            key={user.id}
            id={user.id}
            name={user.name}
            image={user.image}
            totalPosts={user.posts.length}
          />
        );
      })}
    </ul>
  );
};

export default UserList;
