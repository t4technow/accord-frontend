import { wsHead } from "@/config/Constants"

export async function get_user_media(options = { video: true, audio: true }) {
    try {
        return await navigator.mediaDevices.getUserMedia(options)

    } catch (error) {
        return Promise.reject("can't get media devices")
    }
}

export async function get_user_screen() {
    try {
        return await navigator.mediaDevices.getDisplayMedia()

    } catch (error) {
        return Promise.reject("can't get media devices")
    }
}



export const getEndpoint = () => {

    // let endpoint = wsStart + '127.0.0.1:8000' + location.pathname
    let endpoint = wsHead + 'peersocket/'

    return endpoint
}


export const servers = {
    iceServers: [
        {
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
                'stun:stun3.l.google.com:19302',
                'stun:stun4.l.google.com:19302',
            ]
        }
    ]
}


export function toggle_video(Media:MediaStream) {
    let videoTrack = Media.getVideoTracks().find(track=>track.kind === "video")

    if(videoTrack){
        if(videoTrack.enabled){
            videoTrack.enabled = false
            return false
        }else{
            
            videoTrack.enabled = true
            return true
        }
    }
    else return false
    
    
}

export function toggle_audio(Media:MediaStream) {
    let AudioTrack = Media.getVideoTracks().find(track=>track.kind === "audio")

    if(AudioTrack){
        if(AudioTrack.enabled){
            AudioTrack.enabled = false
            return false
        }else{
            
            AudioTrack.enabled = true
            return true
        }
    }
    else return false
    
    
}