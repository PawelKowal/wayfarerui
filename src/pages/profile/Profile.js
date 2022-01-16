import "./profile.css";
import Bar from "../../components/bar/Bar";
import Post from "../../components/post/Post";
import Map from "../../components/map/Map";
import User from "../../components/user/User";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [userToShow, setUserToShow] = useState({});
  const [mapCenterLat, setMapCenterLat] = useState(null);
  const [mapCenterLng, setMapCenterLng] = useState(null);
  const id = useParams().id;

  const getUserApi = async () => {
    try {
      const response = await axios.get(`/users/${id}`);
      response.data.posts = response.data.posts.sort(function (a, b) {
        return new Date(b.publicationDate) - new Date(a.publicationDate);
      });
      setUserToShow(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id === null || user.userId === id) {
      setUserToShow(user);
    } else {
      getUserApi();
    }
  }, [user, id]);

  return (
    <div>
      <Bar />
      <div className="profileContainer">
        <div className="leftProfileContainer">
          <User user={userToShow} refreshUser={getUserApi} />
          {userToShow &&
            userToShow.posts &&
            userToShow.posts.map((p) => (
              <Post
                key={p.postId}
                post={p}
                setMapCenterLat={setMapCenterLat}
                setMapCenterLng={setMapCenterLng}
              />
            ))}
        </div>
        <Map
          refresh={getUserApi}
          posts={userToShow.posts}
          mapCenterLat={mapCenterLat}
          mapCenterLng={mapCenterLng}
        />
      </div>
    </div>
  );
}
