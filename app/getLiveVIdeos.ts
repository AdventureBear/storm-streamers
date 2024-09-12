export const getLiveVideos = async (channel_id: string): Promise<any[]> => {

    const API_KEY = process.env.API_KEY;
    const search_root_url = `https://www.googleapis.com/youtube/v3/search`;
    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos`;

    // First, get the live videos
    const searchUrl = `${search_root_url}?part=snippet&channelId=${channel_id}&type=video&eventType=live&key=${API_KEY}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        return [];
    }


    // Fetch video details for the returned videos
    const videoIds = data.items.map((video: any) => video.id.videoId).join(',');
    const detailsUrl = `${videoDetailsUrl}?part=status,contentDetails&id=${videoIds}&key=${API_KEY}`;
    const detailsResponse = await fetch(detailsUrl);
    const videoDetailsData = await detailsResponse.json();

    // Filter out videos that are not embeddable
    const embeddableVideos = data.items.filter((video: any, index: number) => {
        const videoDetail = videoDetailsData.items[index];
        return videoDetail.status.embeddable; // Only return embeddable videos
    });

    return embeddableVideos;
};
