import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import PostItem from "./PostItem";
import "./PostList.css";

const PostList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="post-list center">
        <Card>
          <h2>No Post Found</h2>
          <Button to='/posts/new'>Share Post</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="post-list">
      {props.items.map((post) => (
        <PostItem
          title={post.title}
          id={post.id}
          key={post.id}
          image={post.imageUrl}
          description={post.description}
          address={post.address}
          coordinates={post.location}
          creator={post.creator}
          onDelete={props.onDeletePost}
        />
      ))}
    </ul>
  );
};

export default PostList;
