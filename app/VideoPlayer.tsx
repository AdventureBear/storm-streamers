'use client'
import React, {Suspense, useState} from 'react'

export const VideoPlayer = ({streamer}:{streamer: {name: string, url: string}}) => {
    const [mute , setMute] = useState(1)
    return (
        <div key={streamer.name} className="flex flex-col m-2 flex-1">
            <Suspense fallback={<p>Loading video...</p>}>
                <iframe
                    // ref={ref}
                    // onLoad={onLoad}
                    // height={height}
                    height="320"
                    id="player"
                    src={`https://www.youtube.com/embed/${streamer.url}?enablejsapi=1&autoplay=1&mute=${mute}&origin=http://localhost:3001`}
                ></iframe>
            </Suspense>
            <div>{streamer.name}</div>
        </div>
    )
}
