import './Sidebar.css';
import { API_BASE_URL } from './config';
import { MyContext } from './MyContext';
import { useContext, useEffect } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { SquarePen, Trash2, Menu } from 'lucide-react';
import linkedinIcon from './assets/linkedin.png';
import gitHubIcon from './assets/gitHub.png';
import codeIcon from './assets/dev.png';
import { useAuth } from './context/AuthContext';
import GradientText from './GradientText';

// Read LinkedIn URL from environment (Vite) or fall back to sensible default
const LINKEDIN_URL = 'https://www.linkedin.com/in/anudeep-sai-raj';
const GITHUB_URL = 'https://github.com/Anudeep-9507';

function Sidebar({ isOpen = true, toggleSidebar }) {
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);
    const { token } = useAuth();

    const getAllThreads = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/thread`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const res = await response.json();
            if (res.threads) {
                const filteredData = res.threads.map(thread => ({ threadId: thread.threadId, title: thread.title }));
                setAllThreads(filteredData);
                // console.log(filteredData);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (token) getAllThreads();
    }, [currThreadId, token]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try {
            const response = await fetch(`${API_BASE_URL}/api/thread/${newThreadId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null); // we dont need typing effect for previous chats
        } catch (err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/thread/${threadId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const res = await response.json();
            console.log(res);
            // re-render all threads again
            setAllThreads((prev) => prev.filter((thread) => thread.threadId !== threadId));

            if (threadId == currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <div className="brand">
                    <img src="https://res.cloudinary.com/dfkfysygf/image/upload/v1764418857/logo_protoLab_oqstkj.jpg" alt="logo" className='logo' />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>PROTO</span>
                        <GradientText
                            colors={['#88fbffff', '#6baeffff']}
                            animationSpeed={2}
                            className="brand-gradient"
                        >
                            LAB
                        </GradientText>
                    </div>
                </div>
                <div className="sidebar-controls">
                    {/* Placeholder for collapse icon if needed, or just visual */}
                </div>
            </div>

            <button
                className="sidebar-toggle-btn-absolute"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
            >
                {isOpen ? <Menu size={20} /> : <Menu size={20} />}
            </button>

            <button onClick={createNewChat} className="new-thread-btn">
                <span><SquarePen size={18} /></span>
                <span>New Thread</span>
            </button>

            <ul className='history'>
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx}
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : ""}
                        >
                            <span className="threadTitle">{thread.title}</span>
                            <Trash2 className="deleteIcon"
                                size={16}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}
                            />
                        </li>
                    ))
                }
            </ul>

            <div className='sign'>
                <div className="user-profile">
                    <div className="avatar">
                        <img src={codeIcon} alt="code icon" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    </div>
                    <div className="user-info">
                        <span className="user-name">Anudeep</span>
                        <span className="user-plan">Web Developer</span>
                    </div>
                    <div className="social-links">
                        <a href="https://www.linkedin.com/in/anudeep-sai-raj" target="_blank" rel="noopener noreferrer" className="social-link">
                            <img src={linkedinIcon} alt="LinkedIn" />
                        </a>
                        <a href="https://github.com/Anudeep-9507" target="_blank" rel="noopener noreferrer" className="social-link">
                            <img src={gitHubIcon} alt="GitHub" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Sidebar;