import {Suspense} from "react";
import {getLiveVideos} from "@/app/getLiveVIdeos";
import {getChannelIDs} from "@/app/getChannelIds";
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

    return (
        <div className="p-4">
            <p className="text-xl font-bold">Live and Embeddable Channels</p>
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
                                    <p className="text-gray-700">{channel.result.snippet.title}</p>
                                </div>
                            </div>
                        )
                    }
                )
                }
            </div>
            <div className="mb-8">
                <p className="text-xl font-bold">Restricted Channels (Videos only available on YouTube)</p>
                <ul>
                    {restrictedChannels.map(channel => (
                        <li key={channel.id}><span className="font-bold"> {channel.result.snippet.channelTitle}</span> - Video restricted</li>
                    ))}
                </ul>
            </div>
            <div className="mb-8">
                <p className="text-xl font-bold">Channels Not Currently Live Streaming</p>
                <ul>
                    {notLiveChannels.map(channel => (
                        <li key={channel.id}>{channel.handle} - Not live</li>
                    ))}
                </ul>
            </div>

        </div>
    )
        ;
}
