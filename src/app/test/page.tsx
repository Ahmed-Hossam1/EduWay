"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/layouts/video.css';
import '@vidstack/react/player/styles/default/theme.css';
import { CldUploadWidget } from 'next-cloudinary';

// TEST page: upload a video → our API makes an HLS (.m3u8) copy → play it
export default function Test() {
    const [hlsUrl, setHlsUrl] = useState<string | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // step 2: send the uploaded video name to our API, get back the .m3u8 link
    async function convertToHls(publicId: string) {
        setIsConverting(true);
        setError(null);
        try {
            const response = await fetch("/api/testvideo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicId }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setHlsUrl(data.hlsUrl);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsConverting(false);
        }
    }

    return (
        <div className='mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-4 p-4'>

            {/* step 1: upload the video to Cloudinary */}
            <CldUploadWidget
                uploadPreset='EduWay'
                options={{ resourceType: "video", sources: ["local", "google_drive"], clientAllowedFormats: ["mp4", "mov", "webm", "avi", "mkv"], maxFiles: 1, multiple: false }}
                onSuccess={(result) => {
                    // result.info = what Cloudinary saved (public_id = the video name)
                    if (result.info && typeof result.info !== "string") {
                        convertToHls(result.info.public_id);
                    }
                }}
            >
                {({ open }) => (
                    <Button onClick={() => open()} isLoading={isConverting}>
                        {isConverting ? "Making HLS..." : "Upload Video"}
                    </Button>
                )}
            </CldUploadWidget>

            {error && <p className='text-sm text-destructive'>{error}</p>}

            {/* step 3: play the .m3u8 (Vidstack knows HLS) */}
            {hlsUrl && (
                <>
                    <p className='break-all text-xs text-muted-foreground'>{hlsUrl}</p>
                    <MediaPlayer title="Test video" src={hlsUrl} playsInline className='w-full'>
                        <MediaProvider />
                        <DefaultVideoLayout icons={defaultLayoutIcons} />
                    </MediaPlayer>
                </>
            )}
        </div>
    );
}
