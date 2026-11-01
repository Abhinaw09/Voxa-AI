
import { useContext, useEffect } from "react";
import "./sidebar.css";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {

    const {
        allThreads,
        setallThreads,
        currThreadId,
        setNewChat,
        setReply,
        setPrompt,
        setcurrThreadId,
        setPrevChats
    } = useContext(MyContext);

    // Fetch all previous threads
    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");

            if (!response.ok) {
                throw new Error("Failed to fetch threads");
            }

            const resp = await response.json();

            const filteredData = resp.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));

            setallThreads(filteredData);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

   
    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setcurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async(newThreadId) =>{
        setcurrThreadId(newThreadId);

        try{
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res =await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        }catch(err){
            console.log(err);
        }
    }

    const deleteThread = async(threadId) =>{
        try{
        const response=  await fetch(`http://localhost:8080/api/thread/${threadId}`,{method:"delete"});
        const res= await response.json();
        console.log(res);

       setallThreads(prev =>
       prev.filter(thread => thread.threadId !== threadId)
        );

        if( threadId === currThreadId){
            createNewChat();
        }
        }catch(err){
            console.log(err);
        }
    }

   
    return (
        <section className="Sidebar">

            <button onClick={createNewChat}>
                <img
                    src="/src/assets/logo.jpg"
                    alt="Voxa logo"
                    className="logo"
                />

                <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
            </button>

            <ul className="history">
                {allThreads?.map((thread) => (
                    <li key={thread.threadId} 
                      onClick={(e)=>changeThread(thread.threadId)}
                      className={thread.threadId === currThreadId ? "highlighted":" "}
                      >
                        {thread.title}
                        <i className="fa-solid fa-trash"
                         onClick={(e)=>{
                            e.stopPropagation();
                            deleteThread(thread.threadId);
                         }}
                        ></i>
                    </li>
                ))}
            </ul>

            <div className="sign">
                <p>Created by Abhinaw</p>
            </div>

        </section>
    );
}

export default Sidebar;
