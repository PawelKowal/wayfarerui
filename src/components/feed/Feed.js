import "./feed.css";
import Post from "../post/Post";

export default function Feed({ posts }) {
  return (
    <div>{posts && posts.map((p) => <Post key={p.postId} post={p} />)}</div>
  );
}
