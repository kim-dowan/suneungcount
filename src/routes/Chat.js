import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import Chatting from "./Chatting";

const bubbleSort = function (array) {
  var length = array.length;
  var i, j, temp;
  for (i = 0; i < length - 1; i++) {
    for (j = 0; j < length - 1 - i; j++) {
      if (array[j].createdAt > array[j + 1].createdAt) {
        temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
  return array;
};
const Chat = ({ userObj, setIsChatting, isLoggedIn }) => {
  const [chatArray, setChatArray] = useState([]);
  const [chat, setChat] = useState("");
  const [attachment, setAttachment] = useState("");
  const [fileName, setFileName] = useState("");
  useEffect(() => {
    document.getElementById("chat_div").style.opacity = "100%";
    document.getElementById("chat_div").style.transition = "opacity 0.5s";

    dbService.collection("chat").onSnapshot((snapshot) => {
      const arr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatArray(bubbleSort(arr));
      var objDiv = document.getElementById("chat_container");
      objDiv.scrollTop = objDiv.scrollHeight;
    });
  }, []);

  const onChatClick = () => {
    setIsChatting((prev) => !prev);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (chat === "" && attachment === "") return;
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${fileName}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const chatObj = {
      text: chat,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
      fileName,
      creatorName: userObj.name,
      photoURL: userObj.photoURL,
    };

    await dbService.collection("chat").add(chatObj);
    setChat("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setChat(value);
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
        setAttachment(result);
      };
      reader.readAsDataURL(theFile);
    } else {
      setAttachment("");
    }
  };
  const onClearAttachment = () => setAttachment(null);
  return (
    <div className="chat_div" id="chat_div">
      <div className="chat_nav">
        <strong className="chat_title">Chat</strong>
        <strong onClick={onChatClick} className="close_chat">
          ×
        </strong>
      </div>
      <div className="chat_container" id="chat_container">
        {chatArray.map((message) => (
          <Chatting
            key={message.id}
            chatObj={message}
            isOwner={message.creatorId === userObj.uid}
          />
        ))}
      </div>
      <div className="chat_input_div">
        {isLoggedIn ? (
          <form onSubmit={onSubmit}>
            {attachment ? (
              <label className="file_label" onClick={onClearAttachment}>
                ×
              </label>
            ) : (
              <label htmlFor="file" className="file_label">
                +
                <input
                  id="file"
                  className="file_input"
                  type="file"
                  onChange={onFileChange}
                />
              </label>
            )}
            <input
              className="chat_input"
              type="text"
              placeholder="메시지를 입력하세요"
              value={chat}
              onChange={onChange}
            />
            <input className="chat_send_btn" type="submit" value="전송" />
          </form>
        ) : (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: "20px",
              padding: "10px 0",
            }}
          >
            로그인 후 이용하실 수 있습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
