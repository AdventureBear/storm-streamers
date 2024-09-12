export const getLiveVideos = async (channel_id: string): Promise<any> => {
    const API_KEY = process.env.API_KEY;
    const search_root_url = `https://www.googleapis.com/youtube/v3/search`;
    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos`;

    // First, get the live videos
    const searchUrl = `${search_root_url}?part=snippet&channelId=${channel_id}&type=video&eventType=live&key=${API_KEY}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        // Not live-streaming now
        return { isLive: false, isEmbeddable: false, videoId: null };
    }

    const videoId = data.items[0].id.videoId;

    // Fetch video details to check if it is embeddable
    const detailsUrl = `${videoDetailsUrl}?part=status&id=${videoId}&key=${API_KEY}`;
    const detailsResponse = await fetch(detailsUrl);
    const videoDetails = await detailsResponse.json();

    const isEmbeddable = videoDetails.items[0]?.status.embeddable || false;

    return {
        isLive: true,
        isEmbeddable,
        result: data.items[0]
    };
};
