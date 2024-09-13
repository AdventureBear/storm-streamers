import {Suspense} from "react";
import {getLiveVideos} from "@/app/actions/getLiveVIdeos";
import {getChannelIDs} from "@/app/actions/getChannelIds";
import {shortedChannelResponse, writeStreamers} from "@/app/actions/writeData";
import fs from "node:fs/promises";
import path from "node:path";




export default async function Home() {

    // //optional call to feed new channel handles into the database, or update statistics ?
    // comment this out to use existing data and save on search api tokens ! (most expensive)
    // const channelDetailsResponse: (shortedChannelResponse | null)[] = await getChannelIDs(["@ExploreOceans"])
    // //separate function just to store results of the above call to save API requests / server time
    // await writeStreamers(channelDetailsResponse)

    // Now read the file after writing is complete
    const filePath = path.join(process.cwd(), "app/data/streamers1.json");
    let channelDetails:shortedChannelResponse[] = [];

    try {
        const fileData = await fs.readFile(filePath, "utf8");
        if (fileData) {
            channelDetails = JSON.parse(fileData);
        }
    } catch (err) {
        console.error("Error reading the file: ", err);
    }


    const results = await Promise.all(
        channelDetails.map(async (channelDetail) => {
            // const videoData = await getLiveVideos(streamer.channel.items[0].id);
            const videoData = await getLiveVideos(channelDetail!.id);
            console.log("channelId: ", channelDetail!.id)
            return {
                handle: channelDetail!.snippet.customUrl,
                channelTitle: channelDetail!.snippet.title,
                videoData};
        })
    );
    console.log("Live Video Results: ", JSON.stringify(results, null, 2))
    // // Filter the results into categories
    const restrictedChannels = results.filter(result => result.videoData!.isLive && !result.videoData!.isEmbeddable);
    const notLiveChannels = results.filter(result => !result.videoData!.isLive);
    const liveAndEmbeddableChannels = results.filter(result => result.videoData!.isLive && result.videoData!.isEmbeddable);


    // // Fetch channel titles for non-live channels
    //     // const nonLiveChannelTitles = await Promise.all(
    //     //     notLiveChannels.map(async (channel) => {
    //     //         const channelTitle = await getChannelDetails(channel.id);
    //     //         return { id: channel.id, title: channelTitle || channel.handle };
    //     //     })
    //     // );


    return (
        // <Layout>
            <div className="p-4 text-white">


                <p className="text-xl font-bold pb-2 text-white">Live Streaming Channels</p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    {(liveAndEmbeddableChannels && liveAndEmbeddableChannels.length > 0) &&
                        <>
                            {liveAndEmbeddableChannels.map((channel, i) => {
                                    console.log("Live embeddable channels: ", channel)
                                    return (
                                        <div key={i} className="w-full mt-4 bg-white p-4 rounded shadow-md">
                                            <div className="relative w-full h-0 pb-[56.25%]">
                                                <Suspense fallback={<p>Loading video...</p>}>

                                                    <iframe
                                                        className="absolute top-0 left-0 w-full h-full rounded"
                                                        id="player"
                                                        src={`https://www.youtube.com/embed/${channel.videoData!.videoId}?enablejsapi=1&autoplay=1&mute=1&origin=http://localhost:3001`}
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
                                                <p className="font-bold text-blue-600">{channel.videoData?.result?.snippet.channelTitle}</p>
                                                <p className="text-gray-700">{channel.videoData?.result?.snippet.title}</p>
                                                {/* Subscribe Button */}
                                                <a
                                                    href={`https://www.youtube.com/channel/${channel.videoData!.videoId}?sub_confirmation=1`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2 inline-block"
                                                >
                                                    Subscribe
                                                </a>
                                                <a
                                                    href={`https://www.youtube.com/channel/${channel.videoData?.result?.id}/join`}
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
                        </>

                    }
                </div>

                <div className="mb-8">
                    <p className="text-xl font-bold pb-2">Restricted Channels (Videos only available on YouTube)</p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {restrictedChannels.map(channel => (
                            <div key={channel.videoData!.videoId}
                                 className="bg-gray-200 p-4 rounded-lg shadow-md flex justify-between items-center">
                                <span className="font-bold text-blue-600">{channel.videoData?.result?.snippet.description}</span>
                                <a href={`https://www.youtube.com/channel/${channel.videoData?.videoId}`} target="_blank"
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
                        {notLiveChannels.map((channel, i) => (
                            <div key={i}
                                 className="text-bg-blue-200 font-semi-bold bg-gray-200 p-4 rounded-lg shadow-md flex justify-between items-center">
                                <span className="font-bold text-blue-600">{channel.channelTitle}</span>
                                <a href={`https://www.youtube.com/${channel.handle}`} target="_blank"
                                   rel="noopener noreferrer"
                                   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Visit Channel
                                </a>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

        // </Layout>

    )
        ;
}
