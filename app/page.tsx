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
    "@StormChaserBradArnold"    //Brad Arnold
]

const channelIds = await getChannelIDs(channelHandles)
    // .then(res => console.log(res))
    // .catch(err => console.error(err));


 // const streamers = [
 //     {name: "Evan Freyberger", url: "BW2ctr_EIzI", channelId: ""},
 //     {name: "Ryan Hall", url: "XxXDvcNdj3o",  channelId: ""},
 //     {name: "Max Velocity", url: "BUNzCZMmX88",  channelId: ""},
 //     {name: "Reed Timmer", url: "eLH2t0FPPnU", channelId: ""},
 //     {name: "Conner Croff", url: "uj0vvRUGzIA", channelId: ""},
 //     {name: "Storm Chaser Media", url: "pW54bEO0O7w", channelId: ""},
 //     // {name: "Vince Waletti", url: "wcUzlyK9Bk0", channelId: "@StormChaserVince"},
 //     {name: "Freddy McKinney", url: "cehpzn56uoY", channelId: ""},
 //     // {name: "Cory Gerkin", url: "IJEnAFji5oc"},  //disabled by Cory
 //     {name: "Ryan Scholl", url: "keDUIttbBaQ", channelId: ""},
 //     {name: "Tyler Kurtz", url: "pW54bEO0O7w", channelId: ""},
 //     {name: "John McKinney", url: "H3GcagruT-s", channelId: ""}
 // ]

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
    // const channelIds: string[] = await getChannelIDs(channelHandles)
    //     .then(res => console.log(res))
    //     .catch(err => console.error(err));
    const broadcasts = await Promise.all(
        channelIds.map(async (id) => {
            const broadcast = await getLiveVideos(id);
            if (broadcast && broadcast.length) {
                return broadcast
            }
            return
        })
    );
    const filteredBroadcasts = broadcasts.filter(Boolean);

    // Flatten any nested arrays inside broadcasts
    const flattenedBroadcasts = filteredBroadcasts.flat();

    console.log(JSON.stringify(flattenedBroadcasts, null,2))

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {flattenedBroadcasts.map(broadcast => (
                <div key={broadcast.etag} className="w-full mb-3">
                <div className="relative w-full h-0 pb-[56.25%]">
                    <Suspense fallback={<p>Loading video...</p>}>
                        <iframe
                            className="absolute top-0 left-0  w-full h-full mb-8"
                            id="player"
                            src={`https://www.youtube.com/embed/${broadcast.id.videoId}?enablejsapi=1&autoplay=1&mute=1&origin=http://localhost:3001`}
                        ></iframe>
                    </Suspense>
                </div>
                    <div className="mt-4">
                        <p className="font-bold">{broadcast.snippet.channelTitle}</p>
                        <p className="text-gray-700">{broadcast.snippet.title}</p>
                    </div>

                </div>
            ))
            }

        </div>
    )

}
