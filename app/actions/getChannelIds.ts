import {shortedChannelResponse} from "@/app/actions/writeData";

export const getChannelIDs = async (handles: string[]): Promise<(shortedChannelResponse | null)[]> => {
    const API_KEY = process.env.API_KEY;
    const search_root_url = `https://youtube.googleapis.com/youtube/v3/channels`;
// GET https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics%2Cid&forHandle=[HANDLE]&key=[YOUR_API_KEY] HTTP/1.1


     // Return array of channel IDs or nulls
    return await Promise.all(
        handles.map(async (handle) => {
            // const url = `${search_root_url}?part=snippet%2CcontentDetails%2Cstatistics%2Cid&forHandle=${handle}&key=${API_KEY}`; // Ensure correct parameter, might need to adjust to `forUsername` or similar
            const url = `${search_root_url}?part=id&forHandle=${handle}&key=${API_KEY}`; // Ensure correct parameter, might need to adjust to `forUsername` or similar


            try {
                const response = await fetch(url);
                console.log("checking: ", url)
                const data = await response.json();
                console.log("\n***\nChannel ID: ", JSON.stringify(data, null, 2), "\n***")

                if (data.items && data.items.length > 0) {
                    return data.items[0]; // Return only the items as an object
                } else {
                    console.error(`No channel found for handle: ${handle}`);
                    return null; // Return null if the channel is not found
                }
            } catch (error) {
                console.error(`Error fetching data for handle ${handle}:`, error);
                return null; // Return null in case of an error
            }
        })
    )

};