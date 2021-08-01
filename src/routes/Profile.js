import { authService } from "fbase";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj }) => {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
    window.location.reload();
  };
  useEffect(() => {
    document.getElementById("root").style.backgroundColor =
      "rgba(255, 255, 255, 0)";
    document.getElementById("root").style.opacity = "100%";
    document.getElementById("root").style.transition =
      "background-color 1s, opacity 1s";
  }, []);

  return (
    <div className="profile_div">
      <img className="profile_image" src={userObj.photoURL} />
      <br />
      <h2>{userObj.name}</h2>
      <br />
      <div className="profile_btns">
        <button>닉네임 변경</button>
        <button>프로필 사진 변경</button>
        <button onClick={onLogOutClick}>로그아웃</button>
        <button
          onClick={() => {
            history.push("/");
          }}
        >
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default Profile;
