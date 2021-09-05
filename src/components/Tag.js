import React from 'react'

const Tag = ({tagName, removeHandler}) => {
    return (
        <div
            className="bg-pink inline-flex items-center text-sm rounded mt-2 mr-1 overflow-hidden">
                                <span className="ml-2 mr-1 leading-relaxed truncate max-w-xs px-1"
                                      x-text="tag">{tagName}</span>
            <button
                className="w-6 h-8 inline-block align-middle text-gray-500 bg-blue-200 focus:outline-none" type="button">
                <svg className="w-6 h-6 fill-current mx-auto" xmlns="http://www.w3.org/2000/svg"
                     onClick={() => removeHandler(tagName)}
                     viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                          d="M15.78 14.36a1 1 0 0 1-1.42 1.42l-2.82-2.83-2.83 2.83a1 1 0 1 1-1.42-1.42l2.83-2.82L7.3 8.7a1 1 0 0 1 1.42-1.42l2.83 2.83 2.82-2.83a1 1 0 0 1 1.42 1.42l-2.83 2.83 2.83 2.82z"/>
                </svg>
            </button>
        </div>
    )
}

export default Tag
