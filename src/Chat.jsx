import './Chat.css';
import { useContext, useState, useEffect} from 'react';
import { MyContext } from './MyContext';
import ReactMarkdown from 'react-markdown';
import rehypeHighLight from 'rehype-highlight';
import "highlight.js/styles/github-dark.css";

import GradientText from './GradientText';

function Chat(){
    const {newChat, prevChats, reply} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(()=>{
        if(reply === null){
            setLatestReply(null); // we dont need typing effect for latest reply in previous chats
            return;
        } 
        // latest reply seperate => typing effect create
        if(!prevChats?.length)   return;
        
        const content = reply.split(" "); //split into individual words

        let idx=0;
        const interval = setInterval(()=>{
            setLatestReply(content.slice(0, idx+1).join(" "));

            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 50);

        return ()=> clearInterval(interval);

    }, [prevChats, reply])

    if(newChat && (!prevChats || prevChats.length === 0)){
        return (
            <div className="emptyState">
                <GradientText
                colors={['#88fbffff', '#6baeffff']}
                animationSpeed={2}
                >
                    {/* What's up Founder! */}
                </GradientText>
            </div>
        );
    }

    return(
        <div className="chats">
            {
                prevChats?.slice(0, -1).map((chat, idx)=>
                    <div className={chat.role==="user"? "userDiv": "gptDiv"} key={idx}>
                        {
                            chat.role==="user"?
                            <p className="userMessage">{chat.content}</p>:
                            <ReactMarkdown rehypePlugins={rehypeHighLight}>{chat.content}</ReactMarkdown>
                        }
                    </div>
                )
            }

            {
                prevChats?.length > 0 && (
                    <>
                    {
                        latestReply !== null?(
                            <div className='gptDiv' key={"typing"}>
                            <ReactMarkdown rehypePlugins={rehypeHighLight}>{latestReply}</ReactMarkdown>
                            </div>
                        ):(
                        <div className='gptDiv' key={"non-typing"}>
                        <ReactMarkdown rehypePlugins={rehypeHighLight}>{prevChats[prevChats.length-1].content}  
                        </ReactMarkdown>
                        </div>
                        )
                    }
                    </>
                    ) 
            }
        </div>
    );
}

export default Chat;
