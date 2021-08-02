import { authService, firebaseInstance } from "fbase";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "styles/Auth.css";
import google from "styles/images/google.png";
import rolling from "styles/images/rolling.gif";

const Auth = () => {
  const history = useHistory();
  const [init, setInit] = useState(false);
  const [newAccount, setNewAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordChk, setPasswordChk] = useState("");
  const [error, setError] = useState("");

  const setDefaultPersistence = async () => {
    await authService
      .setPersistence(firebaseInstance.auth.Auth.Persistence.LOCAL)
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setDefaultPersistence();
    setInit(true);
    document.getElementById("root").style.backgroundColor =
      "rgba(255, 255, 255, 0.5)";
    document.getElementById("root").style.opacity = "100%";
    document.getElementById("root").style.transition =
      "background-color 1s, opacity 1s";
  }, []);

  const onChange = (event) => {
    const {
      target: { value, name },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "passwordChk") {
      setPasswordChk(value);
    } else if (name === "name") {
      setName(value);
    }
  };

  const errorTransfer = (err) => {
    let errorMessage;
    switch (err.code) {
      case "auth/user-not-found":
        errorMessage = "존재하지 않는 계정입니다.";
        break;
      case "auth/email-already-in-use":
        errorMessage = "해당 이메일은 이미 사용중입니다.";
        break;
      case "auth/wrong-password":
        errorMessage = "비밀번호가 틀렸습니다.";
        break;
      case "auth/too-many-requests":
        errorMessage =
          "너무 많은 요청이 발생했습니다. 나중에 다시 시도해주십시오.";
        break;
      case "auth/weak-password":
        errorMessage = "비밀번호의 최소 길이는 6자리 입니다.";
        break;
      case "auth/user-disabled":
        errorMessage = "해당 계정은 정지되어 이용하실 수 없습니다.";
        break;
      default:
        errorMessage = `알 수 없는 에러가 발생했습니다. 에러코드 ${err.code}`;
        break;
    }
    setError(errorMessage);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (newAccount) {
      if (password !== passwordChk) {
        setError("비밀번호가 일치하지 않습니다");
        return;
      } else {
        setError("");
      }
    }
    try {
      if (newAccount) {
        await authService
          .createUserWithEmailAndPassword(email, password)
          .catch((err) => {
            console.log(err);
            throw err;
          });
        await authService.currentUser
          .updateProfile({
            displayName: name,
          })
          .then(() => {
            history.push("/");
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
          });
        history.push("/");
      } else {
        await authService
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            history.push("/");
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      }
    } catch (error) {
      console.log(error);
      errorTransfer(error);
    }
  };

  const onPersistenceClick = async (event) => {
    const {
      target: { checked },
    } = event;
    if (checked) {
      await authService.setPersistence(
        firebaseInstance.auth.Auth.Persistence.LOCAL
      );
    } else {
      await authService.setPersistence(
        firebaseInstance.auth.Auth.Persistence.SESSION
      );
    }
  };

  const toggleRegister = () =>
    setNewAccount((prev) => {
      setError("");
      return !prev;
    });

  const onFindPasswordClick = async () => {
    const email = prompt("비밀번호를 재설정할 이메일을 입력해주세요.");
    if (!email) return;
    await authService
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("비밀번호 재설정 이메일을 보냈습니다! 메일함에서 확인해주세요.");
      })
      .catch((err) => {
        console.log(err);
        alert(
          "계정에 등록되지 않은 이메일이거나, 이메일을 보내는 중에 문제가 발생했습니다.\n관리자에게 문의하세요."
        );
      });
  };

  const onGoogleLogin = async () => {
    const provider = new firebaseInstance.auth.GoogleAuthProvider();
    await authService
      .signInWithPopup(provider)
      .then(() => {
        history.push("/");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  };

  return (
    <>
      {init ? (
        <div className="container" id="container">
          <form onSubmit={onSubmit}>
            {newAccount ? (
              <div className="input_form" id="input_form">
                <Link to="/" className="back_btn">
                  → 돌아가기
                </Link>
                <h1 className="title">회원가입</h1>
                <p className="description">
                  수능 카운트다운 서비스를 이용하려면 로그인이 필요합니다.
                </p>
                <input
                  className="input_box"
                  name="name"
                  type="text"
                  value={name}
                  placeholder="이름"
                  onChange={onChange}
                  required
                />
                <br />
                <input
                  className="input_box"
                  name="email"
                  type="email"
                  value={email}
                  placeholder="이메일"
                  onChange={onChange}
                  required
                />
                <br />
                <input
                  className="input_box"
                  name="password"
                  type="password"
                  value={password}
                  placeholder="비밀번호"
                  onChange={onChange}
                  required
                />
                <br />
                <input
                  className="input_box"
                  name="passwordChk"
                  type="password"
                  value={passwordChk}
                  placeholder="비밀번호 재입력"
                  onInput={onChange}
                  required
                />
                <label htmlFor="persistence" className="persistence">
                  <input
                    id="persistence"
                    type="checkbox"
                    onClick={onPersistenceClick}
                    defaultChecked
                  />{" "}
                  로그인 상태 유지
                </label>
                <br />
                <br />
                <p className="error">{error}</p>
                <input type="submit" value="회원가입" className="submit_btn" />
                <br />
                <span onClick={toggleRegister} className="toggle_btn">
                  이미 계정이 있다면? <strong>로그인</strong>
                </span>
                <br />
              </div>
            ) : (
              <div className="input_form" id="input_form">
                <Link to="/" className="back_btn">
                  → 돌아가기
                </Link>
                <h1 className="title">로그인</h1>
                <p className="description">
                  수능 카운트다운 서비스를 이용하려면 로그인이 필요합니다.
                </p>
                <input
                  className="input_box"
                  name="email"
                  type="email"
                  value={email}
                  placeholder="이메일을 입력하세요"
                  onChange={onChange}
                  required
                />
                <br />
                <input
                  className="input_box"
                  name="password"
                  type="password"
                  value={password}
                  placeholder="비밀번호를 입력하세요"
                  onChange={onChange}
                  required
                />
                <label htmlFor="persistence" className="persistence">
                  <input
                    id="persistence"
                    type="checkbox"
                    onClick={onPersistenceClick}
                    defaultChecked
                  />{" "}
                  로그인 상태 유지
                </label>
                <span onClick={onFindPasswordClick} className="forgot_password">
                  비밀번호 찾기
                </span>
                <br />
                <br />
                <br />
                <p className="error">{error}</p>
                <input type="submit" value="로그인" className="submit_btn" />
                <br />
                <span onClick={toggleRegister} className="toggle_btn">
                  계정이 없으신가요? <strong>회원가입</strong>
                </span>
                <br />
                <br />
                <div onClick={onGoogleLogin} className="social_btn">
                  <img src={google} className="social_img" alt="google_img" />
                  <strong className="social_login">Google로 로그인</strong>
                </div>
              </div>
            )}
            <br />
          </form>
        </div>
      ) : (
        <div className="loading_div">
          <img
            src={rolling}
            className="loading"
            width="50px"
            alt="loading_gif"
            style={{ display: "inline-block", marginTop: "60px" }}
          />
          <br />
          <p>잠시만 기다려주세요...</p>
        </div>
      )}
    </>
  );
};

export default Auth;
