import React, {useRef, useState} from 'react';
import Gallery from "./Gallery";
import {useAmp} from "next/amp";
import {createComment} from "../http/CommentAPI";

const CommentInput = ({ newsId, authorId, parentId, className, commentOpen, updateCommentsList }) => {
    const commentRef = useRef()
    const [loadedImages, setLoadedImages] = useState([])

    const loadImage = (e) => {
        setLoadedImages([...loadedImages, e.target.files[0]])
    }

    const sendComment = async () => {
        const commentText = commentRef.current.value;

        if(commentText.trim().length > 0) {
            if(commentOpen) {
                commentOpen()
            }
            const data = await createComment(newsId, authorId, commentText, parentId)
            console.log(data)
            updateCommentsList(data)
        }
    }

    return (
        <div className={className ?? ''}>

            <textarea name="" id="" rows="7" className='w-full rounded-md px-3 py-2' ref={commentRef}/>
            <div className="flex items-center justify-between h-14">
                <Gallery items={loadedImages} updateGallery={(images) => {
                    console.log(images)
                    setLoadedImages(images)}
                }/>
                <div className="flex space-x-4 h-full items-center">
                    <label
                        className={`flex justify-center h-3/4 items-center px-4 py-2 ${loadedImages.length === 2 ? 'hidden' : ''} bg-white text-pink rounded-lg tracking-wide uppercase cursor-pointer hover:bg-pink hover:text-white`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <input type='file' className="hidden" onChange={(e) => loadImage(e)}/>
                    </label>
                    <button className="bg-pink px-3 py-2 rounded-md h-3/4" onClick={() => sendComment()}>
                        Отправить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentInput;
