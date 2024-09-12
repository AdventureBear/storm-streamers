export const getChannelDetails = async (channelId: string): Promise<string | null> => {
    const API_KEY = process.env.API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            return data.items[0].snippet.title;  // Channel title
        }
    } catch (error) {
        console.error(`Error fetching channel details for ${channelId}:`, error);
    }

    return null;  // Return null if channel title is not found
};