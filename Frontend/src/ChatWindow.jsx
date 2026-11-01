
import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { useContext, useState } from "react";
import { HashLoader } from "react-spinners";

function ChatWindow() {
    const {
        prompt,
        setPrompt,
        setReply,
        currThreadId,
        setPrevChats,
        setNewChat
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen , setisOpen] = useState(false);


    const getReply = async () => {
        const userPrompt = prompt.trim();

        if (!userPrompt || loading) return;

        setLoading(true);
        setNewChat(false);
        setPrompt("");

       
        setPrevChats((prevChats) => [
            ...prevChats,
            {
                role: "user",    
                content: userPrompt
            }
        ]);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/chat`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: userPrompt,
                        threadId: currThreadId
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const res = await response.json();
            console.log(res);

            setReply(res.reply);

            // Display the assistant reply
            setPrevChats((prevChats) => [
                ...prevChats,
                {
                    role: "assistant",
                    content: res.reply
                }
            ]);
        } catch (err) {
            console.error("Error fetching reply:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileClick= () =>{
      setisOpen(!isOpen);
    }
    return (
        <div className="ChatWindow">
            <div className="navbar">
                <span>
                    Voxa AI <i className="fa-solid fa-angle-down"></i>
                </span>

                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon" >
                        <i className="fa-solid fa-user" ></i>
                    </span>
                </div>
            </div>

            {
                isOpen &&
                <div className ="dropdown">
                    <div className="dropDownItems" >New Chat <i className="fa-brands fa-signal-messenger"></i></div>
                     <div className="dropDownItems">Log Out <i className="fa-solid fa-arrow-right-from-bracket"></i></div>
                     
                    
                </div>
            }

            <Chat />

            <HashLoader color="#fff" loading={loading} />

            <div className="chatInput">
                <div className="InputBox">
                    <input
                        placeholder="What’s on the agenda today?"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") getReply();
                        }}
                    />

                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>

                <p className="info">Think smarter, act faster</p>
            </div>
        </div>
    );
}

export default ChatWindow;
