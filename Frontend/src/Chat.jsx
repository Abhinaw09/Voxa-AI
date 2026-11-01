
import "./Chat.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState("");

    
    useEffect(() => {
        if (reply === null || reply === undefined) {
            setLatestReply("");
            return;
        }

        const words = reply.split(" ");
        let idx = 0;

        setLatestReply("");

        const interval = setInterval(() => {
            setLatestReply(words.slice(0, idx + 1).join(" "));
            idx++;

            if (idx >= words.length) {
                clearInterval(interval);
            }
        }, 40);

        return () => clearInterval(interval);

    }, [reply]);

    return (
        <>
            {newChat && (
                <h1 className="welcomeHeading">
                    Got a question? I'm listening
                </h1>
            )}

            <div className="chats">

                
                {prevChats?.slice(0, -1).map((chat, idx) => (
                    <div
                        className={
                            chat.role === "user" ? "userDiv" : "gptDiv"
                        }
                        key={idx}
                    >
                        {chat.role === "user" ? (
                            <p className="userMessage">
                                {chat.content}
                            </p>
                        ) : (
                            <div className="markdownContent">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeHighlight]}
                                >
                                    {chat.content || ""}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                ))}

                {/* Latest message / typing animation */}
                {prevChats?.length > 0 && (
                    <>
                        {reply === null ? (

                            // Normal assistant message
                            <div className="gptDiv" key="non-typing">
                                <div className="markdownContent">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeHighlight]}
                                    >
                                        {prevChats[prevChats.length - 1].content || ""}
                                    </ReactMarkdown>
                                </div>
                            </div>

                        ) : (

                            // Animated assistant message
                            <div className="gptDiv" key="typing">
                                <div className="markdownContent">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeHighlight]}
                                    >
                                        {latestReply}
                                    </ReactMarkdown>
                                </div>
                            </div>

                        )}
                    </>
                )}

            </div>
        </>
    );
}

export default Chat;
