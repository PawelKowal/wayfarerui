import Bar from "../../components/bar/Bar";
import Feed from "../../components/feed/Feed";
import Map from "../../components/map/Map";
import Share from "../../components/share/Share";
import "./home.css";
import axios from "../../api/axios";
import { useEffect, useState, useContext } from "react";
import { Button } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

export default function Home() {
  const [posts, setPosts] = useState(null);
  const [displayedPosts, setDisplayedPosts] = useState(null);
  const [followedOnly, setFollowedOnly] = useState(false);
  const { user } = useContext(AuthContext);

  const getAllPostsApi = async () => {
    try {
      const response = await axios.get("/posts");
      const sortedPosts = response.data.sort(function (a, b) {
        return new Date(b.publicationDate) - new Date(a.publicationDate);
      });
      setPosts(sortedPosts);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllPostsApi();
  }, []);

  useEffect(() => {
    getAllPostsApi();
  }, [followedOnly]);

  useEffect(() => {
    followedOnly
      ? setDisplayedPosts(posts.filter(followFilter))
      : setDisplayedPosts(posts);
  }, [posts]);

  const handleFilterButton = () => {
    followedOnly ? setFollowedOnly(false) : setFollowedOnly(true);
  };

  const followFilter = (post) => {
    return user.following.includes(post.userId);
  };

  return (
    <div>
      <Bar />
      <div className="homeContainer">
        <div className="leftHomeContainer">
          <Share refreshPosts={getAllPostsApi} />
          <div className="homeFilterButton">
            <Button
              variant="contained"
              style={{ backgroundColor: "#2fd138" }}
              onClick={handleFilterButton}
            >
              {followedOnly ? "Show all posts" : "Show followed users posts"}
            </Button>
          </div>
          <Feed posts={displayedPosts} />
        </div>
        <Map />
      </div>
    </div>
  );
}
