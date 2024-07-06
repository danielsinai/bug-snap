import React, { useEffect } from "react";

function SourcePreview({ stream }: { stream: MediaStream | undefined }) {
    useEffect(() => {
        if (stream) {
            const video = document.getElementById('video') as HTMLVideoElement;
            video.srcObject = stream;
        }
    }, [stream]);


    return (
        <div className="flex flex-col w-full h-full items-center justify-center">
            <video id="video" autoPlay />
        </div>
    );
}

export default SourcePreview;