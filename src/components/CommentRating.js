import React, {useEffect, useState} from 'react';
import {getCommentRatings, setCommentRating} from "../http/CommentRatingsAPI";

const CommentRating = ({commentId, userId}) => {

    const [upVotes, setUpVotes] = useState(0)
    const [downVotes, setDownVotes] = useState(0)
    const [ratingUp, setRatingUp] = useState()
    const [ratingDown, setRatingDown] = useState()

    useEffect(() => {
       getCommentRatings(commentId).then(r => {
           const data = r
           setUpVotes(data.filter(item => item.choice === 'up').length)
           setDownVotes(data.filter(item => item.choice === 'down').length)

           data.map( item => {
               if(item.user_id === userId) {
                   if(item.choice === 'up')
                       setRatingUp(true)
                   else {
                       setRatingDown(true)
                   }
               }
           })
       })
    })

    const formatRating = (value) => {
        return Math.floor(value/1000) > 0 ? Math.floor(value/1000) + 'K' : value
    }

    const UpRating = async () => {
        if (ratingUp == null)
        {
            setCommentRating(commentId, userId, 'up', 'set').then(r => {
                setUpVotes( upVotes + 1)
                setRatingUp(true)

                if(ratingDown) {
                    setDownVotes(downVotes - 1)
                    setRatingDown(null)
                }
            })

        }
        else {
            setCommentRating(commentId, userId, 'up', 'reset').then(r => {
                setUpVotes( upVotes - 1)
                setRatingUp(null)
            })
        }
    }
    const DownRating = async () => {
        if (ratingDown == null)
        {
            setCommentRating(commentId, userId, 'down', 'set').then(r => {
                setDownVotes( downVotes + 1)
                setRatingDown(true)

                if(ratingUp) {
                    setUpVotes(upVotes - 1)
                    setRatingUp(null)
                }
            })
        }
        else {
            setCommentRating(commentId, userId, 'down', 'reset').then(r => {
                setDownVotes( downVotes - 1)
                setRatingDown(null)
            })
        }
    }

    return (
        <div className="group flex space-x-2 items-center">
            <div className={`${ratingUp  ? '': 'opacity-0 group-hover:opacity-100'} ${userId ? '': 'hidden'}`}>
                <svg xmlns="http://www.w3.org/2000/svg"
                     onClick={() => UpRating()}
                     className={`h-7 w-7 ${ ratingUp  ? 'text-green-500 text-green-800' : 'text-gray-500 hover:text-gray-800'}`}
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
            </div>
            <div className="px-3 py-1 bg-pink rounded-md w-12 text-center">
                { formatRating(upVotes - downVotes) }
            </div>
            <div className={`${ratingDown  ? '': 'opacity-0 group-hover:opacity-100'} ${userId ? '': 'hidden'}`}>
                <svg xmlns="http://www.w3.org/2000/svg"
                     onClick={() => DownRating()}
                     className={`h-7 w-7 ${ ratingDown ? 'text-red-500 text-red-800' : 'text-gray-500 hover:text-gray-800'}`}
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                </svg>
            </div>
        </div>
    );
};

export default CommentRating;
