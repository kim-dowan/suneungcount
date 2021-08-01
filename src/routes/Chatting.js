import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Chatting = ({ chatObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newChat, setNewChat] = useState(chatObj.text);
  const fileInfo = String(chatObj.fileName).split(".");
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

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input type="text" onChange={onChange} value={newChat} />
            <input type="submit" value="Edit Chat" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <div className="chat_box">
          <img className="chat_profile_img" src={chatObj.photoURL} />
          <h3 className="chat_profile_name">{chatObj.creatorName}</h3>
          <br />
          {chatObj.attachmentUrl && (
            <>
              {fileInfo[1] === "png" ||
              fileInfo[1] === "jpg" ||
              fileInfo[1] === "gif" ||
              fileInfo[1] === "jpeg" ? (
                <img
                  className="chat_img"
                  src={chatObj.attachmentUrl}
                  alt="chat_image"
                  width="50px"
                  height="50px"
                />
              ) : (
                <a
                  href={chatObj.attachmentUrl}
                  download
                >{`${fileInfo[0]}.${fileInfo[1]}`}</a>
              )}
            </>
          )}
          <br />
          <h4 className="chat_text">{chatObj.text}</h4>
          {isOwner && (
            <div className="owner_btn_div">
              <br />
              <button className="chat_owner_btn" onClick={onDeleteClick}>
                삭제
              </button>
              <button className="chat_owner_btn" onClick={toggleEditing}>
                수정
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatting;
