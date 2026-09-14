import React, { useEffect, useRef, useState } from "react";
import "../styles/editorStyles.css";

import { useLocation, useNavigate } from "react-router";
import { initSocket } from "../socket.js";
import ACTIONS from "../actions.js";
import "../styles/editorStyles.css";
import Client from "./Client.jsx";
import { applyRemoteCode, createEditorView } from "../utilities/editorView.js";
import updateListenerFunction from "../utilities/editorView.js";
import { ToastContainer, toast} from "react-toastify";

const Editor = () => {
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const codeRef = useRef('console.log("hello")');

  const parentRef = useRef(null);
  const viewRef = useRef(null);
  const location = useLocation();

  const { username, roomId } = location.state;
  const [clients, setClients] = useState([]);

  useEffect(() => {
   
    const updateListener = updateListenerFunction(codeRef, socketRef, roomId);

      const view = createEditorView(parentRef.current, updateListener);
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", (err) => {
        handleErrors(err);
      });
      socketRef.current.on("connect_failed", (err) => {
        handleErrors(err);
      });

      function handleErrors(e) {
        console.log(e);
        toast.error(`error in connection`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        
      });
        navigate("/");
      }

      
      

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            
            toast.success(`${username} joined the room`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        
      });
            
          }
          setClients(clients);
          
          if (socketId !== socketRef.current.id) {
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current,
              socketId,
            });
          }
        },
      );
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        applyRemoteCode(editorRef.current, code);
      });

      socketRef.current.on(ACTIONS.SYNC_CODE, ({ code }) => {
        applyRemoteCode(editorRef.current, code);
        codeRef.current = code;
      });

      socketRef.current?.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.info(`${username} left the room`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          
        });

        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };

    editorRef.current = view;

    // viewRef.current = view;
    init();

    return () => {
      view.destroy();
      viewRef.current = null;
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.CODE_CHANGE);
      socketRef.current?.off(ACTIONS.SYNC_CODE);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    };
  }, []);

 

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      // alert("room id copied");
      toast.success(`Room ID copied`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        
      });
    } catch (error) {
      // alert("could not copy room id");
      toast.error(`Could not copy room ID`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        
      });
    }
  }

  function leaveRoom() {
    navigate("/");
  }
  return (
    <>
    <ToastContainer/>
      <div className="mainWrap">
        <div className="aside">
          <div className="asideInner">
            <div className="logo">
              
               <div className="brandName"><h1 className="nameHeading">COLAB</h1></div>
            </div>
            <div className="clientsList">
              {clients.map((client, index) => (
                <Client
                  key={client.socketId}
                  index={index}
                  username={client.username}
                />
              ))}
            </div>
            <div className="editorButtons">
              <button className="copyRoomIdBtn" onClick={copyRoomId}>
                Copy Room ID
              </button>
              <button className="leaveRoom" onClick={leaveRoom}>
                Leave
              </button>
            </div>
          </div>
        </div>
        <div className="editorDiv">
          <div ref={parentRef} className="editorInner"></div>
        </div>
      </div>
    </>
  );
};

export default Editor;
