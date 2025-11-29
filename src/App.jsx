import './App.css';
import ChatWindow from './ChatWindow.jsx';
import Sidebar from './Sidebar.jsx';
import { MyContext } from './MyContext.jsx';
import { useState } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  return children;
};

function MainApp() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); // stores all chats of curr threads
  const [newChat, setNewChat] = useState(true); // when new chat is created
  const [allThreads, setAllThreads] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads
  }; //passing values

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}></Sidebar>
        <ChatWindow toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}></ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<MainApp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
