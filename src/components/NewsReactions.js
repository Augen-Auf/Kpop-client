import React, {useEffect, useState} from 'react';
import {getNewsReactions, setNewsReaction} from "../http/NewsAPI";

const NewsReactions = ({userId, newsId}) => {
    const [reactions, setReactions] = useState({happy: 0, sweat: 0, sad: 0, crying: 0, angry: 0})
    const [userReaction, setUserReaction] = useState(null)

    useEffect(() => {
        setUserReaction(null)
        getNewsReactions(newsId).then(r => {
            const results = r;
            if(r.length > 0) {
                const newReactions = {}
                Object.keys(reactions).forEach(emotion => {
                    newReactions[emotion] = results.filter(item => item.emotion === emotion).length;
                })
                setReactions(newReactions)
                results.map(item => {
                    if (item.user_id === userId)

                        setUserReaction(item.emotion)
                })
                console.log(results)
            }
        })
    }, [userId])

    const setReaction = (reaction) => {
        let newReactions = {...reactions}

        if (userReaction === null) {
            const { data } = setNewsReaction(userId, newsId, reaction)
            setUserReaction(reaction)
            newReactions[reaction] += 1
        }
        else {
            const { data } = setNewsReaction(userId, newsId, reaction)
            if (reaction === userReaction)
            {
                setUserReaction(null)
                newReactions[reaction] -= 1
            }
            else
            {
                setUserReaction(reaction)
                newReactions[reaction] += 1
                newReactions[userReaction] -= 1
            }
        }

        setReactions(newReactions)
    }

    return (
        <div className="flex space-x-3 bg-yellow rounded-md p-3">
            <div className={`flex flex-col items-center p-3 ${userReaction === 'happy' ? 'bg-pink' : 'hover:bg-pink'} rounded-md`}
                 onClick={() => setReaction('happy')}>
                <img src="/img/Emoji/happy.svg"  className="w-10 h-10"/>
                <span>{ reactions.happy }</span>
            </div>
            <div className={`flex flex-col items-center p-3 ${userReaction === 'sweat' ? 'bg-pink' : 'hover:bg-pink'} rounded-md`}
                 onClick={() => setReaction('sweat')}>
                <img src="/img/Emoji/sweat.svg"  className="w-10 h-10"/>
                <span>{ reactions.sweat }</span>
            </div>
            <div className={`flex flex-col items-center p-3 ${userReaction === 'sad' ? 'bg-pink' : 'hover:bg-pink'} rounded-md`}
                 onClick={() => setReaction('sad')}>
                <img src="/img/Emoji/sad.svg"  className="w-10 h-10"/>
                <span>{ reactions.sad }</span>
            </div>
            <div className={`flex flex-col items-center p-3 ${userReaction === 'crying' ? 'bg-pink' : 'hover:bg-pink'} rounded-md`}
                 onClick={() => setReaction('crying')}>
                <img src="/img/Emoji/crying.svg"  className="w-10 h-10"/>
                <span>{ reactions.crying }</span>
            </div>
            <div className={`flex flex-col items-center p-3 ${userReaction === 'angry' ? 'bg-pink' : 'hover:bg-pink'} rounded-md`}
                 onClick={() => setReaction('angry')}>
                <img src="/img/Emoji/angry.svg"  className="w-10 h-10"/>
                <span>{ reactions.angry }</span>
            </div>
        </div>
    );
};

export default NewsReactions;
