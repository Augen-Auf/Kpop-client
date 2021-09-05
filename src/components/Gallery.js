import React, {useEffect, useState} from 'react';

const Gallery = ({items, updateGallery}) => {

    const [images, setImages] = useState([])

    useEffect(() => {
        console.log(items)
        setImages(items)
    }, [items])

    const deleteImage = (index) => {
        console.log(index)
        let currImages = [...images]
        currImages.splice(index, 1)
        updateGallery(currImages)
    }

    return (
        <div className="flex space-x-5">
            {
                images.map( (item, index) =>
                <div className="flex justify-center items-center space-x-2">
                    <div className="mx-auto bg-gray-400 aspect-w-16 aspect-h-8 w-16 rounded-md">
                        <img src={URL.createObjectURL(item)} alt="" className="rounded-md object-cover"/>
                    </div>
                    <button className="flex rounded-full justify-center items-center hover:bg-red-300 p-1" onClick={() => deleteImage(index)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                )
            }
        </div>
    );
};

export default Gallery;
