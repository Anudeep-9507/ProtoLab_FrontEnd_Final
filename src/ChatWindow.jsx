import './ChatWindow.css';
import Chat from './Chat.jsx';
import { useContext, useState, useEffect } from 'react';
import { MyContext } from './MyContext.jsx';
import { CircleArrowUp, Settings, LogOut, LogIn, Lightbulb, PencilRuler, Megaphone, TrendingUp, Menu, X } from 'lucide-react';


import { PlaceholdersAndVanishInput } from './components/ui/placeholders-and-vanish-input.jsx';
import { DottedGlowBackground } from './components/ui/dotted-glow-background.jsx';
import { SparklesCore } from './components/ui/sparkles.jsx';
import Loader from './components/ui/Loader.jsx';
import profile from './assets/profile.png';
import { useAuth } from './context/AuthContext';
import GradientText from './GradientText';

import { useNavigate } from 'react-router-dom';

function ChatWindow({ toggleSidebar, isSidebarOpen }) {
    const {
        prompt, setPrompt,
        reply, setReply,
        currThreadId, setCurrThreadId,
        prevChats, setPrevChats,
        setNewChat,
    } = useContext(MyContext);

    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const getReply = async () => {
        if (!prompt.trim()) return;

        if (!token) {
            setShowLoginPopup(true);
            return;
        }

        setLoading(true);
        setNewChat(false);

        console.log("message", prompt, "threadId: ", currThreadId);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };
        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.res);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats =>
                [...prevChats, {
                    role: "user",
                    content: prompt
                },
                {
                    role: "assistant",
                    content: reply
                }]
            );
        }
        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    const placeholderSuggestions = [
        "I've got an idea — tell me if it's good",
        "How do I launch with zero budget?",
        "Break down my idea like a YC mentor",
        "Give me a roadmap to build this startup",
        "Validate my startup idea"
    ];

    const showEmptyState = prevChats.length === 0 && !reply;

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/login');
    }

    return (
        <div className="chatWindow">
            <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
                <DottedGlowBackground
                    gap={15}
                    radius={1.5}
                    color="rgba(62, 77, 187, 0.3)"
                    glowColor="rgba(32, 3, 151, 0.85)"
                    opacity={0.55}
                    speedMin={0.4}
                    speedMax={1.3}
                />
            </div>

            {/* New Header */}
            <div className="navbar-wrapper">
                <div className="navbar">
                    <div className="breadcrumbs">
                        <span className="crumb-parent">Ideaground</span>
                    </div>

                    <div className="header-controls">
                        <div className="model-selector">
                            <span className="model-name">IdeaGPT 1.0</span>
                            <span className="model-tag">Turbo</span>
                        </div>
                        <div className="userIconDiv" onClick={handleProfileClick}>
                            <img src={profile} alt="profile" className="userIcon" />
                        </div>
                    </div>
                </div>
            </div>

            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropDownItem"><CircleArrowUp size={16} style={{ marginRight: '8px' }} />Upgrade Plan</div>
                    <div className="dropDownItem"><Settings size={16} style={{ marginRight: '8px' }} />Settings</div>
                    {token ? (
                        <div className="dropDownItem" onClick={handleLogout}><LogOut size={16} style={{ marginRight: '8px' }} />Log Out</div>
                    ) : (
                        <div className="dropDownItem" onClick={() => navigate('/login')}><LogIn size={16} style={{ marginRight: '8px' }} />Login</div>
                    )}
                </div>
            }

            {/* Login Popup */}
            {showLoginPopup && (
                <div className="login-popup-overlay">
                    <div className="login-popup">
                        <h3>Login Required</h3>
                        <p>You need to be logged in to send messages.</p>
                        <div className="login-popup-actions">
                            <button className="cancel-btn" onClick={() => setShowLoginPopup(false)}>Cancel</button>
                            <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="chatContent">
                {showEmptyState ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            {/* Cube icon placeholder */}

                        </div>
                        <GradientText
                            colors={['#88fbffff', '#6baeffff']}
                            animationSpeed={2}
                        >
                            Meet Your AI Co-Founder
                        </GradientText>
                        <p className="subtitle">Lets build your idea together</p>

                        <div className="cards-grid">
                            <div className="card">
                                <div className="card-icon code-icon"><Lightbulb size={20} /></div>
                                <div className="card-text">
                                    <h3>Idea Validator</h3>
                                    <p>Validate startup ideas with real market logic</p>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-icon design-icon"><PencilRuler size={20} /></div>
                                <div className="card-text">
                                    <h3>MVP Architect</h3>
                                    <p>Design and plan your minimal viable product</p>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-icon sql-icon"><Megaphone size={20} /></div>
                                <div className="card-text">
                                    <h3>Pitch Crafter</h3>
                                    <p>Craft investor-ready stories & decks</p>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-icon research-icon"><TrendingUp size={20} /></div>
                                <div className="card-text">
                                    <h3>Growth Strategist</h3>
                                    <p>Build acquisition, retention & scale strategies</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Chat />
                )}
            </div>

            <div className="chatInput">
                <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '768px',
                    margin: '0 auto 12px auto'
                }}>
                    <PlaceholdersAndVanishInput
                        value={prompt}
                        onChange={(value) => setPrompt(value)}
                        onSubmit={getReply}
                        placeholders={placeholderSuggestions}
                        disabled={loading}
                    />
                    <Loader loading={loading} />
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100%',
                        maxWidth: '768px',
                        height: '200px',
                        marginTop: '12px',
                        zIndex: 0,
                        pointerEvents: 'none',
                        overflow: 'hidden'
                    }}>

                        <SparklesCore
                            id="tsparticles-below-input"
                            background="transparent"
                            minSize={0.2}
                            maxSize={0.8}
                            particleDensity={300}
                            className="w-full h-full"
                            particleColor="#FFFFFF"
                            speed={2}
                        />
                    </div>
                </div>
                <p className='info'>
                    ProtoLab can make mistakes. Check important info. See Cookie preferences
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;