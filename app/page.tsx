import {ReactNode, Suspense} from "react";
import {getLiveVideos} from "@/app/getLiveVIdeos";
import {getChannelIDs} from "@/app/getChannelIds";
import {getChannelDetails} from "@/app/getChannelDetails"

// Navbar Component
function Navbar() {
    return (
        <nav className="bg-gray-800 p-4 justify-between flex mb-8 shadow-black drop-shadow-xl">
            <div className="flex ">
                <ul className="flex space-x-6 text-white">
                    <li><a href="/" className="hover:text-blue-400">Home</a></li>
                    <li><a href="/live" className="hover:text-blue-400">Live Now</a></li>
                    <li><a href="/channels" className="hover:text-blue-400">Channels</a></li>
                    <li><a href="/favorites" className="hover:text-blue-400">Favorite Channels</a></li>
                    <li><a href="/leaderboard" className="hover:text-blue-400">Leaderboard</a></li>
                    <li><a href="/about" className="hover:text-blue-400">About</a></li>
                    <li><a href="/contact" className="hover:text-blue-400">Contact</a></li>
                </ul>
            </div>
            <div className="flex">
                <ul className="flex space-x-6 text-white">
                    <li>Search</li>
                    <li>Log In</li>
                </ul>
            </div>
        </nav>

    );
}

// Page Layout
function Layout({children}:{children:ReactNode}) {
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#3a5084' }}>
            <Navbar/>
            <header className="text-center py-8">
                <h1 className="text-white text-4xl font-bold">Live Streaming Storm Chaser Hub</h1>
                <p className="text-blue-200 text-lg">Your place to watch the latest live streaming storm chasers</p>
                <p className="text-blue-200 text-lg">Severe Weather, Tornadoes, Hurricanes, Blizzards & More</p>

            </header>
            <main className="p-6">{children}</main>
            <footer className="bg-gray-800 text-white text-center py-4 mt-8">
                <p>&copy; 2024 Live Streaming Storm Chaser Hub. All rights reserved.</p>
            </footer>
        </div>
    );
}

//key=API_KEY
const channelHandles = [
    "@evanfryberger",           //Evan fryberger
    "@ReedTimmerWx",            //Reed Timmer
    "@RyanHallYall",            //Ryan Hall
    "@MaxVelocityWX",           //Max Velocity
    "@ConnorCroff",             //Conner Croff
    "@StormChaserTylerKurtz",   //TylerKurtz
    "@FreddyMcKinney",          //FredMcKinney
    "@WxScholl",                //Ryan Scholl
    "@johnmckinney4128",        //John McKinney (Tyler's dad)
    "@StormChaserVince",        //Vince Walettey
    "@StormChaserBradArnold",   //Brad Arnold
    "@coreygerkenwx",           //Corey Gerken
    "@PAStormTrackerz"          //PA Storm Trackerz
]

const channelIds = await getChannelIDs(channelHandles)
const validChannelIds = channelIds.filter((id): id is string => id !== null);


// const channelIds = [
//     'UCp2G_jHO53yj2NVjv8zbDmQ',
//     'UCV6hWxB0-u_IX7e-h4fEBAw',
//     'UCJHAT3Uvv-g3I8H3GhHWV7w',
//     'UCvBVK2ymNzPLRJrgip2GeQQ',
//     'UCb0U1g5r4kH_NDMGiGRhysA',
//     'UCRCXo0mDpBOZ6-qB5fqHQKA',
//     'UCZSDkxJS7PRw9V0_Sm6U7jg',
//     'UCSQH3qItz0gZ5oXw8cSNR2w',
//     'UCWMRFAo3Cvd7W8yQpQwsOQA',
//     'UCqSk-ojoH2rgAuYadPLJgJA'
// ]


export default async function Home() {
    const results = await Promise.all(
        validChannelIds.map(async (id, index) => {
            const videoData = await getLiveVideos(id);
            return {id, handle: channelHandles[index], ...videoData};
        })
    );
    console.log("Results: ", JSON.stringify(results, null, 2))
    // Filter the results into categories
    const restrictedChannels = results.filter(result => result.isLive && !result.isEmbeddable);
    const notLiveChannels = results.filter(result => !result.isLive);
    const liveAndEmbeddableChannels = results.filter(result => result.isLive && result.isEmbeddable);

    // Fetch channel titles for non-live channels
    const nonLiveChannelTitles = await Promise.all(
        notLiveChannels.map(async (channel) => {
            const channelTitle = await getChannelDetails(channel.id);
            return { id: channel.id, title: channelTitle || channel.handle };
        })
    );


    return (
        <Layout>
            <div className="p-4 text-white">
                <p className="text-xl font-bold pb-2 text-white">Live Streaming Channels</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    {liveAndEmbeddableChannels.map((channel) => {
                            console.log(channel)
                            return (
                                <div key={channel.id} className="w-full">
                                    <div className="relative w-full h-0 pb-[56.25%]">
                                        <Suspense fallback={<p>Loading video...</p>}>

                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full"
                                                id="player"
                                                src={`https://www.youtube.com/embed/${channel.result.id.videoId}?enablejsapi=1&autoplay=1&mute=1&origin=http://localhost:3001`}
                                            ></iframe>
                                        </Suspense>
                                    </div>
                                    <div className="mt-4">
                                        <p className="font-bold">{channel.result.snippet.channelTitle}</p>
                                        <p className="text-white">{channel.result.snippet.title}</p>
                                    </div>
                                </div>
                            )
                        }
                    )
                    }
                </div>


                <div className="mb-8">
                    <p className="text-xl font-bold pb-2">Restricted Channels (Videos only available on YouTube)</p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {restrictedChannels.map(channel => (
                            <div key={channel.id}
                                 className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                                <span className="font-bold text-blue-600">{channel.result.snippet.channelTitle}</span>
                                <a href={`https://www.youtube.com/channel/${channel.id}`} target="_blank"
                                   rel="noopener noreferrer"
                                   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                   Watch on Youtube
                                </a>
                            </div>
                        ))}
                    </div>

                </div>


                <div className="mb-8">
                    <p className="text-xl font-bold pb-2">Channels Not Currently Live Streaming</p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {nonLiveChannelTitles.map(channel => (
                            <div key={channel.id}
                                 className="text-bg-blue-200 font-semi-bold bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                                <span className="font-bold text-blue-600">{channel.title}</span>
                                <a href={`https://www.youtube.com/channel/${channel.id}`} target="_blank"
                                   rel="noopener noreferrer"
                                   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Visit Channel
                                </a>
                            </div>
                        ))}
                    </div>


                    {/*<ul>*/}
                    {/*{nonLiveChannelTitles.map(channel => (*/}
                    {/*    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" key={channel.id}>*/}
                    {/*        <div className="flex">*/}
                    {/*            <span className="flex font-bold text-white mr-2">{channel.title}</span> (Not live)*/}
                    {/*        </div>*/}
                    {/*        <button*/}
                    {/*            className=" bg-blue-800 hover:bg-blue-500 text-bg-blue-200 font-semi-bold py-2 px-4 rounded">*/}
                    {/*            <a*/}
                    {/*                href={`https://www.youtube.com/channel/${channel.id}`}*/}
                    {/*                target="_blank"*/}
                    {/*                rel="noopener noreferrer"*/}
                    {/*                // className=" underline ml-2"*/}
                    {/*            >*/}
                    {/*                Visit Channel*/}
                    {/*            </a>*/}
                    {/*        </button>*/}

                    {/*    </div>*/}

                    {/*))}*/}
                    {/*</ul>*/}
                </div>

            </div>

        </Layout>

    )
        ;
}
