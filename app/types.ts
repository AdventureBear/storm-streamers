export type VideoSnippet = {
    title: string;
    channelTitle: string,
    description: string;
    thumbnails: {
        default: { url: string };
        medium: { url: string };
        high: { url: string };
    };
};

export type VideoItem = {
    id: {
        videoId: string;
    };
    snippet: VideoSnippet
};

export type VideoStatus = {
    embeddable: boolean;
};

export type LiveVideoResponse = {
    isLive: boolean;
    isEmbeddable: boolean;
    videoId: string | null;
    result: VideoItem | null; // Explicitly typing the result field to match what you need
} | undefined;