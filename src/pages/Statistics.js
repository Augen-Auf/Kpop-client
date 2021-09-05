import React, {Fragment, useContext, useEffect, useRef, useState} from 'react';
import { Dialog, Transition, Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'
import Plot from '../../node_modules/react-plotly.js/react-plotly';
import axios from 'axios';
import {Context} from "../index";
import SongsTable from "./Tables/SongsTable";
import AudioParamTable from "./Tables/AudioParamTable";

const Statistics = () => {

    const {user} = useContext(Context);

    const artistQRef = useRef(null);
    const audioQRef = useRef(null);

    let [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal(table) {
        if(table === 'songsTable')
        {
            if(plotData && plotData.length > 0) {
                setActiveTable(<SongsTable plotData={plotData}/>)
                setIsOpen(true)
            }
        }
        if(table === 'audioParamsTable')
        {
            if(audioDataTable && audioDataTable.length > 0) {
                setActiveTable(<AudioParamTable trackReqParams={trackReqParams} audioDataTable={audioDataTable}/>)
                setIsOpen(true)
            }
        }

    }

    const [token, setToken] = useState('');
    const [artist, setArtist] = useState('');
    const [plotData, setPlotData] = useState([]);
    const [plotAudioData, setPlotAudioData] = useState(null);
    const [audioDataTable, setAudioDataTable] = useState([]);
    const [activeTable, setActiveTable] = useState()

    const market = 'KR';
    const search_type = 'artist';
    const trackReqParams = ["acousticness", "danceability", "energy", "speechiness", "valence"];
    const trackReqParamsDescriptions =
        [{section: 'Acousticness (Акустичность)', desc: "Значение описывает, насколько акустичны песни. Оценка 1.0 означает, что песни, скорее всего, акустические."},
            {section: 'Valence (Валентность)', desc: "Мера от 0.0 до 1.0, описывающая музыкальную позитивность, передаваемую треком. Треки с высокой валентностью звучат более позитивно, а треки с низкой валентностью - более негативные."},
            {section: 'Danceability (Танцевальность)', desc: "Описывает, насколько песни подходят для танцев на основе комбинации музыкальных элементов, включая темп, стабильность ритма, силу удара и общую частотность. Значение 0.0 наименее танцевальные, а 1.0 - наиболее танцевальные."},
            {section: 'Energy (Энергичность)', desc: "Представляет собой перцептивную меру интенсивности и активности. Обычно энергичные песни кажутся быстрыми, громкими и шумными."},
            {section: 'Speechiness (Речивость)', desc: "Определяет количество произнесенных слов в дорожке». Если речивость песен выше 0.66, они, вероятно, состоят из произнесенных слов, оценка от 0.33 до 0.66 означает, что песни содержать как музыку, так и слова, а оценка ниже 0.33 означает, что в песнях нет слов."}];

    useEffect(() => {
        axios('https://accounts.spotify.com/api/token', {
            'method': 'POST',
            'headers': {
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer(process.env.REACT_APP_SPOTIFY_TOKEN + ':' +
                    process.env.REACT_APP_SPOTIFY_KEY).toString('base64')),
            },
            data: 'grant_type=client_credentials'
        }).then(tokenResponse => {
            console.log(tokenResponse.data.access_token);
            setToken(tokenResponse.data.access_token);
        }).catch(error => console.log(error));
    }, []);

    async function sendQHandler() {
        const q = artistQRef.current.value;
        const artistData = await getArtist(q);
        setArtist(artistData);
        const tracks = await getArtistsTracks(artistData.id);
        setPlotData(tracks)
    }
    async function getArtist(q) {
        const {data} = await axios(`https://api.spotify.com/v1/search?query=${q}&type=${search_type}&limit=1`,{
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        return data.artists.items[0]
    }

    async function getArtistsTracks(id) {
        const {data} = await axios(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=${market}`,{
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        return data.tracks
    }

    async function getTracksFeatures(tracksIdsString) {
        const {data} = await axios(`https://api.spotify.com/v1/audio-features?ids=${tracksIdsString}`,{
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        return data.audio_features
    }
    async function getTracksFeaturesHandler() {
        const artistsNames = audioQRef.current.value.split(', ');
        const artists = await Promise.all(artistsNames.map(async (item) => {
            return await getArtist(item.trim())
        }));

        const artistsTracksFeatures = await Promise.all(artists.map(async (item) => {
            const tracks = await getArtistsTracks(item.id);
            const audioFeatures = await getTracksFeatures(tracks.map(track => track.id).join(','));

            let trackReqParamsValues = {};
            audioFeatures.forEach((track, index) => {
                trackReqParams.forEach(param => {
                    trackReqParamsValues[param] = (trackReqParamsValues[param] || 0) + track[param];
                    if(index === audioFeatures.length - 1)
                    {
                        trackReqParamsValues[param] = trackReqParamsValues[param] / audioFeatures.length;
                        if(param === "speechiness")
                            trackReqParamsValues[param] = trackReqParamsValues[param];
                    }

                })
            });
            return {artist: item.name, tracks_features: Object.values(trackReqParamsValues)}
        }));

        console.log(artistsTracksFeatures)
        setAudioDataTable(artistsTracksFeatures.map(item => {
            let tableData = {artist: item.artist}
            trackReqParams.forEach((param, index) => {
                tableData[param] = item.tracks_features[index]
            })
            return tableData
        }))

        setPlotAudioData(artistsTracksFeatures.map(item => {
            return {
                r: item.tracks_features,
                theta: trackReqParams,
                name: item.artist,
                marker: {color: '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)}, //цвет
                type: "scatterpolar",
                fill: "toself",
                font: {family: "Montserrat"}
            }
        }));
    }

    return(
        <>
            <div className="flex justify-center font-montserrat font-normal text-black text-md py-10">
                <div className="flex w-1/2 mx-auto flex-col items-center space-y-10">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col w-4/6 mt-4">
                            <label htmlFor="" className="block">Исполнитель:</label>
                            <input type="text" ref={artistQRef} className="p-2 rounded-md"/>
                            <div className="py-3">
                                <button onClick={sendQHandler} className="py-2 px-4 bg-pink rounded-md">Построить</button>
                            </div>
                        </div>
                        <div className="flex space-x-4 w-full">
                        <Plot
                            data={[
                                {
                                    type: 'bar',
                                    x: plotData && plotData.map(item => item.popularity),
                                    y: plotData && plotData.map(item => item.name),
                                    marker: {color:'#FFC1F1'},
                                    orientation: 'h'
                                }
                            ]}
                            layout={{
                                height: 500,
                                title: `<b>Топ 10 треков ${artist.name || ''}</b>`,
                                paper_bgcolor: '#FFFFE1',
                                plot_bgcolor: '#FFFFE1',
                                font: {family: 'Montserrat', size: 16},
                                xaxis: {
                                    automargin: true,
                                    title: {
                                        text:'Popularity',
                                        standoff:20
                                    },
                                    titlefont: {
                                        family: 'Montserrat',
                                        size: 14
                                    },
                                    showticklabels: true,
                                    tickfont:{
                                        family: 'Montserrat',
                                        size: 12
                                    }
                                },
                                yaxis: {
                                    automargin: true,

                                    showticklabels: true,
                                    tickfont: {
                                        family: 'Montserrat',
                                        size: 12
                                    }
                                },
                                hovermode: 'closest'
                            }}
                        />
                            <div>
                                <button onClick={() => openModal('songsTable')} className="bg-pink rounded-md h-12 w-12 p-2">
                                    <img src="/img/Excel.svg"/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col iy w-full">
                        <div className="flex flex-col justify-start w-4/6 mt-4">
                            <label htmlFor="" className="block">Исполнители:</label>
                            <input type="text" ref={audioQRef} className="p-2 rounded-md"/>
                            <div className="py-3">
                                <button onClick={getTracksFeaturesHandler} className="py-2 px-4 bg-pink rounded-md">Построить</button>
                            </div>
                        </div>
                        <div className="flex justify-center w-full space-x-4">
                            <div className="flex flex-col w-full space-y-4">
                                <Plot
                                    data = {plotAudioData}
                                    layout = {{
                                        height: 500,
                                        title: `<b>Характеристика музыки исполнителей</b>`,
                                        margin:{l: 100, r: 100, b: 140, t: 120, pad: 4},
                                        font: {size: 16, family: "Montserrat"},
                                        legend: {font: {size: 16, family: "Montserrat"} },
                                        polar: {
                                            barmode: "group",
                                            bargap: 0.05,
                                            radialaxis: {ticksuffix: "%", angle: 45, dtick: 20},
                                            angularaxis: {direction: "clockwise"},
                                        },
                                        paper_bgcolor: '#FFFFE1',
                                        plot_bgcolor: '#FFFFE1',

                                    }}
                                />

                                <div className="w-full space-y-3">
                                    {trackReqParamsDescriptions.map(item =>
                                        <Disclosure as='div' className="w-full">
                                            {({ open }) => (
                                                <>
                                                    <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left bg-pink rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                                        <span>{item.section}</span>
                                                        <ChevronUpIcon
                                                            className={`${
                                                                open ? 'transform rotate-180' : ''
                                                            } w-5 h-5 text-purple-500`}
                                                        />
                                                    </Disclosure.Button>
                                                    <Transition
                                                        show={open}
                                                        enter="transition duration-100 ease-out"
                                                        enterFrom="transform scale-95 opacity-0"
                                                        enterTo="transform scale-100 opacity-100"
                                                        leave="transition duration-75 ease-out"
                                                        leaveFrom="transform scale-100 opacity-100"
                                                        leaveTo="transform scale-95 opacity-0"
                                                    >
                                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                            <div className="">
                                                                {item.desc}
                                                            </div>
                                                        </Disclosure.Panel>
                                                    </Transition>
                                                </>
                                            )}
                                        </Disclosure>
                                    )}
                                </div>
                            </div>
                            <div>
                                <button onClick={() => openModal('audioParamsTable')} className="bg-pink rounded-md h-12 w-12 p-2">
                                   <img src="/img/Excel.svg"/>
                                </button>
                            </div>
                        </div>
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
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
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
                            <div className="inline-block w-2/3 p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 text-center py-3"
                                >
                                    Экспорт данных
                                </Dialog.Title>
                               <div className="flex flex-col items-center space-y-4">
                                   { activeTable }
                               </div>
                                <button onClick={() => closeModal()}
                                            className="bg-red-100 p-2 hover:bg-red-300 rounded-md focus:outline-none">Закрыть</button>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
};

export default Statistics;
