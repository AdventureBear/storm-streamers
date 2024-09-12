export const getChannelIDs = async (handles: string[]): Promise<(string | null)[]> => {
    const API_KEY = process.env.API_KEY;
    const search_root_url = `https://www.googleapis.com/youtube/v3/channels`;

    const channelIDs = await Promise.all(
        handles.map(async (handle) => {
            const url = `${search_root_url}?part=id&forHandle=${handle}&key=${API_KEY}`; // Ensure correct parameter, might need to adjust to `forUsername` or similar
            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.items && data.items.length > 0) {
                    return data.items[0].id; // Return only the channelId
                } else {
                    console.error(`No channel found for handle: ${handle}`);
                    return null; // Return null if the channel is not found
                }
            } catch (error) {
                console.error(`Error fetching data for handle ${handle}:`, error);
                return null; // Return null in case of an error
            }
        })
    );

    return channelIDs; // Return array of channel IDs or nulls
};