import { authService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "styles/Profile.css";

const Profile = ({ userObj }) => {
  const history = useHistory();
  const [newNickname, setNewNickname] = useState(userObj.name);
  const [image, setImage] = useState("");
  const [fileName, setFileName] = useState("");

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
    window.location.reload();
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNickname(value);
  };
  const onFileChange = async (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    setFileName(theFile.name);
    if (theFile) {
      const reader = new FileReader();
      reader.onloadend = (finishedEvent) => {
        const {
          currentTarget: { result },
        } = finishedEvent;
        setImage(result);
      };
      reader.readAsDataURL(theFile);
    } else {
      setImage("");
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (image === "") return;
    let imageUrl = "";
    if (image !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${fileName}`);
      const response = await attachmentRef.putString(image, "data_url");
      imageUrl = await response.ref.getDownloadURL();
    }
    await authService.currentUser
      .updateProfile({ photoURL: imageUrl })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });

    setImage("");
    setFileName("");
  };
  const onClearAttachment = () => setImage(null);

  const onChangeNickname = async (event) => {
    event.preventDefault();
    if (newNickname === "") return;
    await authService.currentUser
      .updateProfile({ displayName: newNickname })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
    setNewNickname("");
  };
  useEffect(() => {
    document.getElementById("root").style.backgroundColor =
      "rgba(255, 255, 255, 0)";
    document.getElementById("root").style.opacity = "100%";
    document.getElementById("root").style.transition =
      "background-color 1s, opacity 1s";
  }, []);

  return (
    <div className="profile_container">
      <div className="profile_div">
        <img
          className="profile_image"
          alt="profile_image"
          src={userObj.photoURL}
        />
        <br />
        <h2 className="nickname">{userObj.name}</h2>
        <br />
        <div className="profile_btns">
          <button
            id="change_nickname_btn"
            onClick={(event) => {
              event.target.style.display = "none";
              document.getElementById("change_nickname").style.display =
                "inline-block";
            }}
            className="profile_btn"
          >
            ????????? ??????
          </button>
          <div id="change_nickname">
            <form className="profile_form" onSubmit={onChangeNickname}>
              <input
                onChange={onChange}
                value={newNickname}
                className="new_nickname"
                type="text"
                placeholder="??? ???????????? ???????????????"
              />
              <input type="submit" value="??????" className="profile_btn" />
            </form>
            <button
              className="profile_btn"
              onClick={(event) => {
                document.getElementById("change_nickname").style.display =
                  "none";
                document.getElementById("change_nickname_btn").style.display =
                  "inline-block";
              }}
            >
              ??????
            </button>
          </div>
          <br />
          <button
            id="change_image_btn"
            class="profile_btn"
            onClick={(event) => {
              event.target.style.display = "none";
              document.getElementById("change_image").style.display =
                "inline-block";
            }}
          >
            ????????? ?????? ??????
          </button>
          <div id="change_image">
            <form className="profile_form" onSubmit={onSubmit}>
              <label className="new_image" htmlFor="new_image">
                {image ? `${fileName}` : "?????? ??????"}
                <input id="new_image" type="file" onChange={onFileChange} />
              </label>
              <input type="submit" value="??????" className="profile_btn" />
            </form>
            <button
              className="profile_btn"
              onClick={(event) => {
                document.getElementById("change_image").style.display = "none";
                document.getElementById("change_image_btn").style.display =
                  "inline-block";
                onClearAttachment();
              }}
            >
              ??????
            </button>
          </div>
          <br />
          <button onClick={onLogOutClick} className="profile_btn">
            ????????????
          </button>
          <button
            onClick={() => {
              history.push("/");
            }}
            class="profile_btn"
          >
            ????????????
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
