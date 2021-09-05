import React, {useContext, useEffect, useState, Fragment} from 'react';
import CommentInput from "./CommentInput";
import {getNewsComments} from "../http/CommentAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

const Comments = observer(({newsId}) => {

    const {user} = useContext(Context);

    const [comments, setComments] = useState([]);

    const updateCommentsList = (newComment) => {
        console.log(newComment)
        console.log(comments)
        setComments([newComment, ...comments])
    }

    useEffect(() => {
        console.log(newsId)
        getNewsComments(newsId).then(r => {
            console.log(r)
            setComments(r)
        })
    },[])

    return (
        <div className="space-y-3">
            <p className="text-xl font-semibold">{ comments.length } Комментариев</p>

            { user.user.id && <CommentInput newsId={newsId} parentId={null} authorId={user.user.id} updateCommentsList={updateCommentsList}/> }

            { comments &&
                <div className="space-y-4">
                    {
                        comments.filter(item => item.parent_id === null).map(item =>
                            <div className="p-4 bg-yellow">
                                <Fragment>
                                    <SingleComment comment={item} newsId={newsId} authorId={user.user.id} updateCommentsList={updateCommentsList} />
                                    <ReplyComment comments={comments} newsId={newsId} parentId={item.id} authorId={user.user.id} updateCommentsList={updateCommentsList} />
                                </Fragment>
                            </div>
                        )
                    }
                </div>
            }
        </div>
    );
})

export default Comments;
