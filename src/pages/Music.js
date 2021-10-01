import React, {useContext, useEffect, useRef, useState, Fragment} from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react'
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const Music = observer(() => {

    const {user} = useContext(Context);

    const [token, setToken] = useState();
    const [newReleases, setNewReleases] = useState([]);
    const [artistAlbums, setArtistAlbums] = useState();
    const [albumTracks, setAlbumTracks] = useState();
    const artistQRef = useRef(null);

    let [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal(id) {
        getAlbumTracks(id).then(r => setIsOpen(true))

    }

    const market = 'KR';
    const search_type = 'artist';
    const [artist, setArtist] = useState('');

    useEffect(async () => {
        const { data } = await axios('https://accounts.spotify.com/api/token', {
            'method': 'POST',
            'headers': {
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer(process.env.REACT_APP_SPOTIFY_TOKEN + ':' +
                    process.env.REACT_APP_SPOTIFY_KEY).toString('base64')),
            },
            data: 'grant_type=client_credentials'
        });
        await setToken(data.access_token);

        const {data:albumsData} = await axios(`https://api.spotify.com/v1/browse/new-releases?country=${market}&offset=0`,{
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + data.access_token
            }
        });

        let idsArtists =  albumsData.albums.items.map(item => item.artists.map(artist=>artist.id));
        idsArtists = [].concat.apply([], idsArtists).filter((v, i, a) => a.indexOf(v) === i);

        let artistsGenres = {};
        let albums = albumsData.albums.items;
        for (const element of idsArtists) {
            const {data:artistData} = await axios(`https://api.spotify.com/v1/artists/${element}`,{
                'method': 'GET',
                'headers': {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + data.access_token
                }
            });
            artistsGenres[element] = artistData.genres;
        }

        albums = albums.filter(value => {
            const access_artist = value.artists.filter(artist => {
                if(artistsGenres[artist.id].includes("k-pop") || artistsGenres[artist.id].includes("korean pop")
                    || artistsGenres[artist.id].includes("k-rap") || artistsGenres[artist.id].includes("k-indie"))
                    return artist
            });
            if(access_artist.length > 0)
                return value
        });
        await setNewReleases(albums);

        artistQRef.current.value = 'Blackpink'
        await sendQHandler(data.access_token)
    }, []);

    async function getArtist(q, spotifyToken) {
        const {data} = await axios(`https://api.spotify.com/v1/search?query=${q}&type=${search_type}&limit=1`,{
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + spotifyToken
            }
        });
        return data.artists.items[0]
    }

    async function getArtistAlbums(id, spotifyToken) {
        const {data} = await axios(`https://api.spotify.com/v1/artists/${id}/albums`,{
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + spotifyToken
            }
        });
        return data.items
    }

    async function sendQHandler(spotifyToken) {
        const q = artistQRef.current.value;

        const artistData = await getArtist(q, spotifyToken);
        setArtist(artistData);

        let albums = await getArtistAlbums(artistData.id, spotifyToken);
        albums = albums.filter(item => !item.available_markets.includes('JP'));
        setArtistAlbums(albums)
    }

    async function getAlbumTracks(id) {
        const {data} = await axios(`https://api.spotify.com/v1/albums/${id}/tracks`,{
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        setAlbumTracks(data.items)
    }


    return(
        <>
            <div className="flex flex-col mx-auto font-montserrat font-normal text-black text-md py-10">
                <div className="bg-gray-600 py-10 bg-gradient-to-tr from-yellow to-pink">
                    <div className="container mx-auto flex flex-col space-y-4">
                        <p className="text-center text-2xl">Релизы месяца</p>
                        <div className="flex space-x-4 mx-auto px-4">
                            {newReleases && newReleases.map((item, index) => {
                                return <div className="bg-yellow rounded-md" key={'album_' + index}>
                                    <div>
                                        <img src={item.images[0].url} alt="" className="md:h-72 h-48 w-full rounded-t-md"/>
                                    </div>
                                    <div className="p-2">
                                        <p className="font-bold">{item.name}</p>
                                        <p>{item.artists.map(artist => artist.name).join(", ")}</p>
                                        <p className="bg-blue-dark rounded-md text-center">{item.release_date}</p>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
                <div className="container mx-auto space-y-5">
                    <div className="mt-4 flex flex-col space-y-4 items-center w-full mx-auto md:mx-0 px-2">
                        <label htmlFor="" className="block uppercase">Исполнитель</label>
                        <input type="text" ref={artistQRef} className="p-2 rounded-md md:w-1/2 w-full focus:outline-none
                        focus:border-pink"/>
                        <button  onClick={() => sendQHandler(token)} className="w-min py-2 px-4 bg-pink rounded-md
                        focus:outline-none">Построить</button>
                    </div>
                    <div className="grid md:grid-cols-5 md:gap-4 grid-cols-2 gap-4">
                        {artistAlbums && artistAlbums.map((item, index) => {
                            return(
                                <div
                                    className="bg-yellow rounded-md mx-2 flex flex-col justify-between cursor-pointer          "
                                    key={'album_' + index}
                                    onClick={()=> openModal(item.id)}>
                                    <div>
                                        <img src={item.images[0].url} alt="" className="w-full rounded-t-md"/>
                                    </div>
                                    <div className="p-2 flex flex-col flex-grow justify-between">
                                        <div>
                                            <p className="font-bold hover:text-pink">{item.name}</p>
                                            <p>{item.artists.map(artist => artist.name).join(", ")}</p>
                                        </div>
                                        <p className="bg-blue-dark rounded-md text-center">{item.release_date}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-59"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-59"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black opacity-60"/>
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
              &#8203;
            </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block lg:w-1/2 md:w-2/3 w-full max-w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Содержание альбома
                                </Dialog.Title>
                                <div className='grid grid-cols-1 gap-4 sm:p-4 lg:grid-cols-2 md:gap-4 my-4'>
                                    {albumTracks && albumTracks.map((item, index) => {
                                        return <div className="flex bg-yellow rounded-md justify-between" key={'album_' + index}>
                                            <div className="flex flex-col p-2 w-9/12">
                                                <p className="">№ {item.track_number}</p>
                                                <p className="font-bold text-lg truncate">{item.name}</p>
                                            </div>
                                            <div className="flex items-center justify-center p-2"><p className="">{Math.round((item.duration_ms / 60000)* 100) / 100} 🕙︎</p></div>
                                        </div>
                                    })}
                                </div>
                                <div className="">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                                        onClick={closeModal}
                                    >
                                        Закрыть
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
});

export default Music;
