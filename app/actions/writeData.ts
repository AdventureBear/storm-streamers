#!/usr/bin/node

import path from "node:path";

export type shortedChannelResponse = {
    kind: string;
        etag: string;
        id: string;
        snippet: {
            title: string;
            description: string;
            customUrl: string;
            publishedAt: string;
            thumbnails: {
                default: {
                    url: string;
                    width: number;
                    height: number;
                };
                medium: {
                    url: string;
                    width: number;
                    height: number;
                };
                high: {
                    url: string;
                    width: number;
                    height: number;
                };
            };
            localized: {
                title: string;
                description: string;
            };
            country: string;
        };
        contentDetails: {
            relatedPlaylists: {
                likes: string;
                uploads: string;
            };
        };
        statistics: {
            viewCount: string;
            subscriberCount: string;
            hiddenSubscriberCount: boolean;
            videoCount: string;
        }
} | null
//
// // type YoutubeChannelListResponse = {
//     kind: string;
//     etag: string;
//     pageInfo: {
//         totalResults: number;
//         resultsPerPage: number;
//     };
//     items: Array<{
//         kind: string;
//         etag: string;
//         id: string;
//         snippet: {
//             title: string;
//             description: string;
//             customUrl: string;
//             publishedAt: string;
//             thumbnails: {
//                 default: {
//                     url: string;
//                     width: number;
//                     height: number;
//                 };
//                 medium: {
//                     url: string;
//                     width: number;
//                     height: number;
//                 };
//                 high: {
//                     url: string;
//                     width: number;
//                     height: number;
//                 };
//             };
//             localized: {
//                 title: string;
//                 description: string;
//             };
//             country: string;
//         };
//         contentDetails: {
//             relatedPlaylists: {
//                 likes: string;
//                 uploads: string;
//             };
//         };
//         statistics: {
//             viewCount: string;
//             subscriberCount: string;
//             hiddenSubscriberCount: boolean;
//             videoCount: string;
//         };
//     }>;
// };

// example.txt is an empty file
import fs from "node:fs";

export async function writeStreamers(streamers:shortedChannelResponse[]) {
    const directory = path.resolve(process.cwd(), "app/data");
    const filePath = path.join(directory, "streamers1.json");

    // Check if the directory exists, create it if not
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

// Filter out null values from the incoming streamers array
    const filteredStreamers = streamers.filter((streamer) => streamer !== null);

    // Read existing content from the file
    let existingStreamers: shortedChannelResponse[] = [];
    if (fs.existsSync(filePath)) {
        try {
            const fileData = fs.readFileSync(filePath, "utf8");
            if (fileData) {
                existingStreamers = JSON.parse(fileData).filter((streamer: shortedChannelResponse) => streamer !== null);
            }
        } catch (err) {
            console.error("Error reading existing file:", err);
        }
    }

    // Merge the filtered streamers with the existing streamers
    const mergedStreamers = [...existingStreamers, ...filteredStreamers];


    // Convert the merged data to JSON
    const jsonData = JSON.stringify(mergedStreamers, null, 2);




    fs.writeFile(
        filePath,
        jsonData,
        function (err) {
            if (err) {
                return console.error(err);
            }

            fs.readFile(filePath, "utf8", function (err, data) {
                if (err) {
                    return console.error(err);  // Log error if reading fails
                }
                console.log("Data read: " + data);  // Output the file contents
            });
        }
    );
}