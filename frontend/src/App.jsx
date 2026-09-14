import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "./App.css";
import "./index.css";
import { useNavigate } from "react-router";

function App() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const navigate = useNavigate();

  function handleRoomIdChange(e) {
    setRoomId(e.target.value);
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handleJoinClick(e) {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedRoomId = roomId.trim();

    if (!trimmedUsername || !trimmedRoomId) {
      toast.error("Username and room ID cannot be empty", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      return;
    }
    navigate(`/editor/${roomId}`, { state: { username, roomId } });
  }

  return (
    <>
      <ToastContainer />
      <div className="mainDiv">
        <div className="formDiv">
          <div className="brandName">
            <h1 className="name">COLAB</h1>
          </div>
          <form className="inputDiv" onSubmit={handleJoinClick}>
            <span className="font">Room Id</span>
            <input
              type="text"
              placeholder="Room id"
              onChange={handleRoomIdChange}
              value={roomId}
              className="roomInput"
              id="roomID"
            />
            <span className="font">Username</span>
            <input
              type="text"
              placeholder="username"
              onChange={handleUsernameChange}
              value={username}
              className="usernameInput"
              id="username"
            />
            <button className="joinBtn" type="submit">
              Join
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
