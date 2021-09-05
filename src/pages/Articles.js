import React from 'react';

const Articles = () => {
    return (
        <div className="w-full font-montserrat pb-8">
            <div className="max-w-7xl mx-auto flex justify-between py-10">
                <div className="flex flex-col space-y-10 w-3/4 px-4 pb-10">
                    <div className="w-full grid grid-rows-2 grid-cols-4 gap-4">
                        <div className="py-5 rounded-md bg-cover bg-center flex items-end" style={{backgroundImage:'url(/img/Rose.jpg)'}}>
                            <div className="p-2 bg-yellow bg-opacity-80">
                                <span className="text-xs">
                                    Полиция расследует инцидент
                                    с Венди из Red Velvet на SBS Gayo Daejeon
                                </span>
                            </div>
                        </div>
                        <div className="py-5 pr-2 row-span-2 col-span-2 rounded-md bg-cover bg-center flex items-end" style={{backgroundImage:'url(/img/Rose.jpg)'}}>
                            <div className="p-2 bg-yellow bg-opacity-80">
                                <span>
                                    Полиция расследует инцидент
                                    с Венди из Red Velvet на SBS Gayo Daejeon
                                </span>
                            </div>
                        </div>
                        <div className="py-5 rounded-md bg-cover bg-center flex items-end" style={{backgroundImage:'url(/img/Rose.jpg)'}}>
                            <div className="p-2 bg-yellow bg-opacity-80">
                                <span className="text-xs">
                                    Полиция расследует инцидент
                                    с Венди из Red Velvet на SBS Gayo Daejeon
                                </span>
                            </div>
                        </div>
                        <div className="py-5 rounded-md bg-cover bg-center flex items-end" style={{backgroundImage:'url(/img/Rose.jpg)'}}>
                            <div className="p-2 bg-yellow bg-opacity-80">
                                <span className="text-xs">
                                    Полиция расследует инцидент
                                    с Венди из Red Velvet на SBS Gayo Daejeon
                                </span>
                            </div>
                        </div>
                        <div className="py-5 rounded-md bg-cover bg-center flex items-end" style={{backgroundImage:'url(/img/Rose.jpg)'}}>
                            <div className="p-2 bg-yellow bg-opacity-80">
                                <span className="text-xs">
                                    Полиция расследует инцидент
                                    с Венди из Red Velvet на SBS Gayo Daejeon
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-3 gap-4">
                        { Array.from(Array(21).keys()).map(item =>
                            <div className="py-5 rounded-md bg-cover h-48 bg-center flex items-end" style={{backgroundImage:'url(/img/Rose.jpg)'}}>
                                <div className="p-2 bg-yellow bg-opacity-80">
                                <span className="text-xs">
                                    Полиция расследует инцидент
                                    с Венди из Red Velvet на SBS Gayo Daejeon
                                </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="sticky top-10 h-full flex flex-col space-y-4 w-1/4 px-4">
                    <div className="w-full p-2 bg-yellow flex items-center justify-center rounded-md">
                        <span>Теги</span>
                    </div>
                    <div className="w-full flex flex-wrap justify-between">
                        <div className="px-3 py-2 border border-gray-800 rounded-md w-min m-2">
                            <span>
                                CRINGE
                            </span>
                        </div>
                        <div className="px-3 py-2 border border-gray-800 rounded-md  w-min m-2">
                            <span>
                                BLACKPINK
                            </span>
                        </div>
                        <div className="px-3 py-2 border border-gray-800 rounded-md  w-min m-2">
                            <span>
                                BTS
                            </span>
                        </div>
                        <div className="px-3 py-2 border border-gray-800 rounded-md  w-min m-2">
                            <span>
                                LOL
                            </span>
                        </div>
                        <div className="px-3 py-2 border border-gray-800 rounded-md  w-min m-2">
                            <span>
                                ATEEZ
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Articles;
