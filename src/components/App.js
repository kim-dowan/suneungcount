import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import "styles/App.css";
import { authService, dbService, storageService } from "fbase";

const App = () => {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState({
    uid: "",
    name: "Guest",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/countdown-1281e.appspot.com/o/guest.png?alt=media&token=8bd42747-e707-442e-9854-35089a2a39e3",
    email: "",
    emailVerified: false,
    updateProfile: (args) => args,
  });
  let imageName = "";

  const setBackgroundImage = async () => {
    await dbService
      .collection("image")
      .doc("background")
      .get()
      .then((doc) => {
        if (doc.exists) {
          const length = doc.data().length;
          imageName = `${String(Math.floor(Math.random() * length) + 1)}.jpg`;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    await storageService
      .ref()
      .child(`backgroundimages/${imageName}`)
      .getDownloadURL()
      .then((url) => {
        document.body.style.backgroundImage = `url(${url})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // eslint-disable-next-line
  useEffect(() => {
    authService.onAuthStateChanged(async (user) => {
      if (user) {
        setBackgroundImage();
        let photoURL =
          "https://firebasestorage.googleapis.com/v0/b/countdown-1281e.appspot.com/o/guest.png?alt=media&token=8bd42747-e707-442e-9854-35089a2a39e3";

        if (!user.photoURl && user.photoURL !== null) {
          photoURL = user.photoURL;
        }
        const userObject = {
          uid: user.uid,
          name: user.displayName,
          photoURL: photoURL,
          email: user.email,
          emailVerified: user.emailVerified,
          updateProfile: (args) => user.updateProfile(args),
        };
        setUserObj(userObject);
        setIsLoggedIn(true);
        setInit(true);
        setInterval(() => {
          setBackgroundImage();
        }, 60000);
      } else {
        setIsLoggedIn(false);
        setInit(true);
      }
    });
    // eslint-disable-next-line
    setBackgroundImage();
    // eslint-disable-next-line
  }, []);
  return (
    <div className="App">
      {init && <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />}
    </div>
  );
};

export default App;
