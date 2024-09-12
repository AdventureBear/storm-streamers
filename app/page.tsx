import {ReactNode, Suspense} from "react";
import {getLiveVideos} from "@/app/getLiveVIdeos";
import {getChannelIDs} from "@/app/getChannelIds";
import {getChannelDetails} from "@/app/getChannelDetails"
import Navbar from "@/app/Navbar";
// Navbar Component
// function Navbar() {
//     return (
//         <nav className="bg-gray-800 p-4 justify-between flex mb-8 shadow-black drop-shadow-xl">
//             <div className="flex ">
//                 <ul className="flex space-x-6 text-white">
//                     <li><a href="/" className="hover:text-blue-400">Home</a></li>
//                     <li><a href="/live" className="hover:text-blue-400">Live Now</a></li>
//                     <li><a href="/channels" className="hover:text-blue-400">Channels</a></li>
//                     <li><a href="/favorites" className="hover:text-blue-400">Favorite Channels</a></li>
//                     <li><a href="/leaderboard" className="hover:text-blue-400">Leaderboard</a></li>
//                     <li><a href="/about" className="hover:text-blue-400">About</a></li>
//                     <li><a href="/contact" className="hover:text-blue-400">Contact</a></li>
//                 </ul>
//             </div>
//             <div className="flex">
//                 <ul className="flex space-x-6 text-white">
//                     <li>Search</li>
//                     <li>Log In</li>
//                 </ul>
//             </div>
//         </nav>
//
//     );
// }

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
    "@evanfryberger",           // Evan fryberger
    "@ReedTimmerWx",            // Reed Timmer
    "@RyanHallYall",            // Ryan Hall
    "@MaxVelocityWX",           // Max Velocity
    "@ConnorCroff",             // Conner Croff
    "@StormChaserTylerKurtz",   // Tyler Kurtz
    "@FreddyMcKinney",          // Fred McKinney
    "@WxScholl",                // Ryan Scholl
    "@johnmckinney4128",        // John McKinney (Tyler's dad)
    "@StormChaserVince",        // Vince Waletti
    "@StormChaserBradArnold",   // Brad Arnold
    "@coreygerkenwx",           // Corey Gerken
    "@PAStormTrackerz",         // PA Storm Trackerz
    "@calebbeachamwx",          // Caleb Beachem
    "@mr.dibble",               // Reilly Dibble
    "@WxChasing",               // Branden Clement
    "@stormrunnermedia",        // Garrett Thompson and DL Scales
    "@StormchaserNickGorman",   // Nick Gorman
    "@BamaStormChaser",         // Bret Adair
    "@MaxOlsonChasing",         // Max Olson
    "@ChasingZachary",          // Zachary Hall
    "@StormChaserJordanHall" ,  //Jordan Hall
    "@SierraLindseyWX" ,        //Sierra Lindsey
    "@WxChasing",               //Brandon Clement
    "@tornadopaigeyy",          //Tornado Paigeyy
    "@StormChaserAaronRigsby",  //Arron Rigsby
    "@AdamLucio",               //Adam Lucio
];

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
                                <div key={channel.id} className="w-full mt-4 bg-white p-4 rounded shadow-md">
                                    <div className="relative w-full h-0 pb-[56.25%]">
                                        <Suspense fallback={<p>Loading video...</p>}>

                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full rounded"
                                                id="player"
                                                src={`https://www.youtube.com/embed/${channel.result.id.videoId}?enablejsapi=1&autoplay=1&mute=1&origin=http://localhost:3001`}
                                            ></iframe>
                                            {/* Unmute button */}
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2"
                                                // onClick={() => handleUnmute(channel.videoId)}
                                            >
                                                Unmute
                                            </button>
                                        </Suspense>
                                    </div>
                                    <div className="mt-4 bg-white p-4">
                                        <p className="font-bold text-blue-600">{channel.result.snippet.channelTitle}</p>
                                        <p className="text-gray-700">{channel.result.snippet.title}</p>
                                        {/* Subscribe Button */}
                                        <a
                                            href={`https://www.youtube.com/channel/${channel.channelId}?sub_confirmation=1`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2 inline-block"
                                        >
                                            Subscribe
                                        </a>
                                        <a
                                            href={`https://www.youtube.com/channel/${channel.channelId}/join`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mt-2 ml-2 inline-block"
                                        >
                                            Join
                                        </a>
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
                                 className="bg-gray-200 p-4 rounded-lg shadow-md flex justify-between items-center">
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
                                 className="text-bg-blue-200 font-semi-bold bg-gray-200 p-4 rounded-lg shadow-md flex justify-between items-center">
                                <span className="font-bold text-blue-600">{channel.title}</span>
                                <a href={`https://www.youtube.com/channel/${channel.id}`} target="_blank"
                                   rel="noopener noreferrer"
                                   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Visit Channel
                                </a>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

        </Layout>

    )
        ;
}
