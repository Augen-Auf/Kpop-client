import React, {useEffect, useState} from 'react';
import CommentRating from "./CommentRating";
import CommentInput from "./CommentInput";
import moment from "moment";

const SingleComment = ({comment, newsId, updateCommentsList, authorId}) => {

    const {id, text, parent_id, createdAt, user, publication_id} = comment

    const [commentOpen, setCommentOpen] = useState(false)
    const [avatar,setAvatar] = useState()

    const localeDate = date => {
        moment.locale('ru')
        return moment(date).calendar();
    }

    useEffect(() => {
        if(user.avatarId)
            setAvatar(process.env.REACT_APP_API_URL + 'api/avatar/' + user.avatarId)
    },[])


    return (
        <div className="flex-col space-y-3">
            <div className="flex justify-between items-center space-x-3">
                <div className="rounded-full h-14 w-14 bg-pink">
                    {avatar &&
                        <img src={avatar} className="object-cover rounded-full w-full h-full" alt=""/>
                    }
                </div>
                <div className="flex flex-col flex-grow">
                    <span className="text-xl font-semibold">{ user.name }</span>
                    <span className="text-sm text-gray-500">{ localeDate(createdAt) }</span>
                </div>
                <CommentRating commentId={id} userId={authorId}/>
            </div>
            <div>
                {text}
            </div>
            <div>
                { authorId && <button onClick={() => setCommentOpen(!commentOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${commentOpen ? 'text-pink' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                </button> }
                {
                    commentOpen && <CommentInput authorId={authorId} newsId={publication_id} parentId={id} commentOpen={() => setCommentOpen(false)} updateCommentsList={updateCommentsList}/>
                }
            </div>
        </div>
    );
};

export default SingleComment;
