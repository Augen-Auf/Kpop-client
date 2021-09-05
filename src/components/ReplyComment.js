import React, {useContext, useEffect, useState, Fragment} from 'react';
import SingleComment from "./SingleComment";

const ReplyComment = ({comments, authorId, newsId, updateCommentsList, parentId}) => {

    return comments && parentId &&
        <div className="pl-4 border-l-2 border-gray-800">
            {
                comments.filter(item => item.parent_id === parentId).map(item =>
                    <Fragment>
                        <SingleComment comment={item} newsId={newsId} authorId={authorId}
                                       updateCommentsList={updateCommentsList}/>
                        <ReplyComment comments={comments} parentId={item.id} newsId={newsId} authorId={authorId}
                                      updateCommentsList={updateCommentsList}/>
                    </Fragment>
                )
            }
        </div>
};

export default ReplyComment;
