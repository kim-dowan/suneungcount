import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "styles/Home.css";
import google from "styles/images/google.png";
import chat_img from "styles/images/chat.png";
import Chat from "./Chat";

const Home = ({ userObj, isLoggedIn }) => {
  const history = useHistory();
  const [init, setInit] = useState(false);
  const [time, setTime] = useState([]);
  const [query, setQuery] = useState("");
  const [isChatting, setIsChatting] = useState(false);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setQuery(value);
  };

  const timeFormatter = (num) => {
    if (num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  };

  const countDown = () => {
    const now = new Date();
    const dDay = new Date("2021-11-18 08:40:00");
    const second = (dDay - now) / 1000;
    const minute = second / 60;
    const hour = minute / 60;
    const day = hour / 24;
    setTime([
      Math.floor(day),
      timeFormatter(Math.floor(hour % 24)),
      timeFormatter(Math.floor(minute % 60)),
      timeFormatter(Math.floor(second % 60)),
    ]);
  };

  const onLoginClick = () => {
    if (isLoggedIn) {
      history.push("/profile");
    } else {
      history.push("/auth");
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const dest = "https://www.google.com/search?q=";
    if (String(query).indexOf(".") !== -1) {
      if (String(query).indexOf("http") !== -1) {
        window.open(query, "_blank");
      } else {
        window.open(`https://${query}`, "_blank");
      }
    } else {
      window.open(dest + String(query), "_blank");
    }
  };

  const onChatClick = () => {
    setIsChatting((prev) => !prev);
  };

  useEffect(() => {
    document.getElementById("searchBar").focus();
    countDown();
    document.getElementById("root").style.backgroundColor =
      "rgba(255, 255, 255, 0.2)";
    document.getElementById("root").style.opacity = "100%";
    document.getElementById("root").style.transition =
      "background-color 1s, opacity 1s";
    setInterval(() => {
      countDown();
    }, 1000);
    setInit(true);
    setTimeout(() => {
      document.getElementById("searchBar").focus();
    }, 500);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="container">
        <div className="nav_bar">
          <a
            rel="noreferrer"
            href="https://mail.google.com/"
            target="_blank"
            className="gmail"
          >
            Gmail
          </a>
          <img
            src={userObj.photoURL}
            className="profile_img"
            onClick={onLoginClick}
            alt="profile_image"
          />
        </div>
        {init ? (
          <div className="countdown">
            {/* <h1 className="title_time" id="title_time">
              수능까지 남은 시간
            </h1> */}
            <div className="times">
              <div className="time_group">
                <div className="time_div_date">
                  <strong className="time">{time[0]}</strong>
                  <strong className="time_des">일</strong>
                </div>
                <div className="time_div">
                  <strong className="time">{time[1]}</strong>
                  <strong className="time_des">시간</strong>
                </div>
              </div>
              <div className="time_group">
                <div className="time_div">
                  <strong className="time">{time[2]}</strong>
                  <strong className="time_des">분</strong>
                </div>
                <div className="time_div">
                  <strong className="time">{time[3]}</strong>
                  <strong className="time_des">초</strong>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <form onSubmit={onSubmit}>
          <div className="bar">
            <a href="https://www.google.com">
              <img className="google_img" src={google} alt="google_image" />
            </a>
            <input
              className="searchbar"
              id="searchBar"
              type="text"
              title="Search"
              placeholder="Google에서 검색하거나 URL을 입력하세요."
              value={query}
              onChange={onChange}
            />
          </div>
        </form>
        <img
          src={chat_img}
          className="chat_btn"
          onClick={onChatClick}
          width="30px"
          height="30px"
          alt="chat_image"
        />
        {isChatting ? (
          <Chat
            userObj={userObj}
            setIsChatting={setIsChatting}
            isLoggedIn={isLoggedIn}
          />
        ) : (
          ""
        )}
      </div>
      <div className="mobile">
        <Chat
          userObj={userObj}
          setIsChatting={setIsChatting}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </>
  );
};

export default Home;
