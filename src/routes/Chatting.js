import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Chatting = ({ chatObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newChat, setNewChat] = useState(chatObj.text);
  const fileInfo = String(chatObj.fileName).split(".");
  let isImage = true;
  if (
    fileInfo[fileInfo.length - 1] === "png" ||
    fileInfo[fileInfo.length - 1] === "jpg" ||
    fileInfo[fileInfo.length - 1] === "gif" ||
    fileInfo[fileInfo.length - 1] === "jpeg"
  ) {
    isImage = true;
  } else {
    isImage = false;
  }
  let file_name = "";
  for (let i = 0; i < fileInfo.length; i++) {
    file_name = file_name + fileInfo[i];
    if (i < fileInfo.length - 1) file_name = file_name + ".";
  }
  const chat_time = new Date(chatObj.createdAt);
  const onDeleteClick = async () => {
    const ok = window.confirm("메시지를 삭제할까요? 되돌릴 수 없습니다.");
    if (ok) {
      await dbService.doc(`chat/${chatObj.id}`).delete();
      if (chatObj.attachmentUrl !== "")
        await storageService.refFromURL(chatObj.attachmentUrl).delete();
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`chat/${chatObj.id}`).update({
      text: newChat,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewChat(value);
  };

  const timeFormatter = (time) => {
    let formatTime = "";
    if (String(time).length < 2) {
      formatTime = "0" + String(time);
    } else {
      formatTime = String(time);
    }
    return formatTime;
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input type="text" onChange={onChange} value={newChat} />
            <input type="submit" value="수정" />
          </form>
          <button onClick={toggleEditing}>취소</button>
        </>
      ) : (
        <div className="chat_box">
          <img
            className="chat_profile_img"
            src={chatObj.photoURL}
            alt="profile_name"
          />
          <h3 className="chat_profile_name">{chatObj.creatorName}</h3>
          <br />
          {chatObj.attachmentUrl && (
            <>
              {isImage ? (
                <img
                  className="chat_img"
                  src={chatObj.attachmentUrl}
                  alt="chat_image"
                  width="50px"
                  height="50px"
                />
              ) : (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={chatObj.attachmentUrl}
                  download={fileInfo[0]}
                >
                  {file_name}
                </a>
              )}
            </>
          )}
          <br />
          <h4 className="chat_text">{chatObj.text}</h4>
          <br />
          <div className="owner_btn_div">
            <br />
            <p className="chat_time">{`${chat_time.getFullYear()}-${timeFormatter(
              chat_time.getMonth() + 1
            )}-${timeFormatter(chat_time.getDate())} ${timeFormatter(
              chat_time.getHours()
            )}:${timeFormatter(chat_time.getMinutes())}:${timeFormatter(
              chat_time.getSeconds()
            )}`}</p>
            {isOwner && (
              <>
                <button className="chat_owner_btn" onClick={onDeleteClick}>
                  삭제
                </button>
                <button className="chat_owner_btn" onClick={toggleEditing}>
                  수정
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatting;
