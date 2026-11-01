import './App.css'
import Sidebar from './sidebar'
import ChatWindow from './ChatWindow'
import { MyContext } from './MyContext'
import{useState} from'react';
import{v1 as uuidv1} from "uuid";

function App() {
  const[prompt, setPrompt]= useState("");
  const[reply,setReply]=useState(null);
  const[currThreadId, setcurrThreadId]=useState(uuidv1());
  const[prevChats,setPrevChats]=useState([]);
  const[newChat,setNewChat]= useState(true);
  const[allThreads, setallThreads]=useState([]);
  
  
  const providerValues ={
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setcurrThreadId,
    newChat,setNewChat,
    prevChats,setPrevChats,
    allThreads,setallThreads
  };

  return (
   <div className ='app'>
    < MyContext.Provider value = {providerValues}>
    <Sidebar></Sidebar>
    <ChatWindow></ChatWindow>
    </MyContext.Provider>
   </div>
  )
}

export default App
