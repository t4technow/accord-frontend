import { getEndpoint, get_user_media, get_user_screen, servers, toggle_audio, toggle_video } from './helper'
import './VideoCall.css'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useCallback, useEffect, useRef } from 'react'
import { RootState } from '@/lib/Types'
import { setTarget } from '@/redux/chat/currentChatSlice'



function VideoCall() {

  const userMedia = useRef<HTMLVideoElement>(null)
  const remoteMedia = useRef<HTMLVideoElement>(null)
  const [userStream, setUserStream] = useState<MediaStream>()
  const [remoteMuted, SetRemoteMuted] = useState(false)
  const [SocketUse, SetSocket] = useState<WebSocket>()
  const user = useSelector((state: RootState) => state.user.userId)
  const currentChat = useSelector((state: RootState) => state.chat.currentChat)

  const [loading, Setloading] = useState(true)
  const [VideoMuted, SetvideoMuted] = useState(false)
  const [AudioMuted, SetAudioMuted] = useState(false)
  const [SharingScreen, SetSharingScreen] = useState(false)
  const peerUse = useRef<RTCPeerConnection>()

  const target = useSelector((state: RootState) => state.chat.target)

  const dispatch = useDispatch()

  useEffect(() => {
    let remote_stream = new MediaStream();
    const peer = new RTCPeerConnection(servers);
    peerUse.current = peer
    remoteMedia.current!.style.display = 'none'

    get_user_media()
      .then(media => {
        userMedia.current!.srcObject = media
        remoteMedia.current!.srcObject = remote_stream
        setUserStream(media)
        media.getTracks().forEach(track => {
          peer.addTrack(track, media)
        })

      })
      .catch(e => {
        console.log(e)
      })

    const socket = new WebSocket(getEndpoint() + `?token=${localStorage.getItem('access_token')}&target=${target ? target : currentChat}`)

    socket.onopen = async () => {
      console.log('connected');
      // once socket is connected user will createOffer

      let offer = await peer.createOffer()
      await peer.setLocalDescription(offer)

      socket.send(JSON.stringify({ 'message': offer }))

      SetSocket(socket)
    }


    socket.onmessage = async event => {
      let recieved_data = JSON.parse(event.data)

      if (recieved_data.user != user) {
        remoteMedia.current!.style.display = 'block'
        Setloading(false)

        if (recieved_data.response.type == 'offer') {
          await peer.setRemoteDescription(recieved_data.response)
          let answer = await peer.createAnswer()
          await peer.setLocalDescription(answer)

          socket.send(JSON.stringify({ 'message': { 'type': 'answer', 'answer': answer } }))

          if (VideoMuted) {
            socket.send(JSON.stringify({
              'message': 'video_muted',
            }))
            console.log('sending vid s muted');
          }

          console.log(VideoMuted);

          if (AudioMuted) {

            socket.send(JSON.stringify({
              'message': 'audio_muted',
            }))
          }
          console.log('an ofer recieved', userStream?.getTracks().find(track => track.kind === 'video')?.enabled);

        }

        if (recieved_data.response.type == 'candidates') {
          peer.addIceCandidate(recieved_data.response.candidate)
        }

        if (recieved_data.response.type == 'answer') {
          if (!peer.currentRemoteDescription) {
            peer.setRemoteDescription(recieved_data.response.answer)
          }
        }
        if (recieved_data.response == 'user_left') {
          console.log('User Left')
          remoteMedia.current!.style.display = 'none'
          Setloading(true)
        }
        if (recieved_data.response === 'video_muted') {
          remoteMedia.current!.style.display = 'none'
          SetRemoteMuted(true)
        }
        if (recieved_data.response == 'video_unmuted') {
          remoteMedia.current!.style.display = 'block'
          SetRemoteMuted(false)
        }
        if (recieved_data.response === 'audio_muted') {
          console.log("User muted their mic")
        }
        if (recieved_data.response == 'audio_unmuted') {
          console.log("User unmuted their mic")
        }
      }
    }


    // peer handle
    peer.onicecandidate = async event => {
      if (event.candidate) {
        socket.send(JSON.stringify({ 'message': { 'type': 'candidates', 'candidate': event.candidate } }))
      }
    }

    peer.ontrack = event => {
      event.streams[0].getTracks().forEach(track => {
        remote_stream.addTrack(track)
      })

    }


    return () => {
      socket.close()
      peer.close()
      if (userStream) {
        userStream.getTracks().forEach((track) => track.stop());
      }
      dispatch(setTarget(null))
    };


  }, [])


  const toggleScreenShare = useCallback(() => {

    if (!SharingScreen) {
      get_user_screen()
        .then(media => {
          userMedia.current!.srcObject = media
          setUserStream(media)
          media.getTracks().forEach(track => {
            if (peerUse.current) {
              peerUse.current.getSenders().forEach(sender => {
                if (sender?.track?.kind == 'video') {
                  sender.replaceTrack(track)
                }
              })

            }
          })

        })
        .catch(e => {
          console.log(e)
        })
      SetSharingScreen(true)
    }
    else {

      get_user_media()
        .then(media => {
          userMedia.current!.srcObject = media
          setUserStream(media)
          media.getTracks().forEach(track => {
            if (peerUse.current) {
              peerUse.current.getSenders().forEach(sender => {
                if (sender?.track?.kind == 'video') {
                  sender.replaceTrack(track)
                }
              })

            }
          })

        })
        .catch(e => {
          console.log(e)
        })
      SetSharingScreen(false)
    }

  }, [SharingScreen])

  return (
    <div className="video-call-container">
      <div className="videos-container">

        <div className="video-holder">
          <video className='user-media app-shadow' autoPlay playsInline ref={userMedia}></video>
          {
            VideoMuted ?

              <div className="user-media video-muted-div">
                <h6>Your camera is disabled.</h6>
              </div>
              :
              null
          }
        </div>

        <div className="video-holder peer">

          <video className={remoteMuted ? 'd-none' : 'remote-media'} autoPlay playsInline ref={remoteMedia}></video>


          <div className="no-remote-media" style={{ 'display': !loading ? 'none' : 'flex' }}>
            <h5>Waiting peer to join
              <div className="lds-spinner lds-spinner2" ><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </h5>
          </div>

          {
            remoteMuted ?
              <div className="no-remote-media">
                <h5>User turned Off their camera
                  <div className="lds-spinner lds-spinner2" ><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </h5>
              </div>
              :
              null
          }
        </div>
      </div>

      <div className="video-controls">
        <div
          className={`icon-wrapper ${VideoMuted ? "muted" : ""}`}
          onClick={() => {
            userStream ? toggle_video(userStream) : null; SetvideoMuted(!VideoMuted);
            !VideoMuted ?
              SocketUse && SocketUse.send(JSON.stringify({
                'message': 'video_muted',
              }))

              :
              SocketUse && SocketUse.send(JSON.stringify({
                'message': 'video_unmuted',
              }))
          }}>
          <svg width="21" height="17" viewBox="0 0 21 17" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.16659 16.8337C1.59367 16.8337 1.10322 16.6297 0.695231 16.2217C0.287245 15.8137 0.083252 15.3232 0.083252 14.7503V2.25033C0.083252 1.67741 0.287245 1.18696 0.695231 0.778971C1.10322 0.370985 1.59367 0.166992 2.16659 0.166992H14.6666C15.2395 0.166992 15.73 0.370985 16.1379 0.778971C16.5459 1.18696 16.7499 1.67741 16.7499 2.25033V6.93783L20.9166 2.77116V14.2295L16.7499 10.0628V14.7503C16.7499 15.3232 16.5459 15.8137 16.1379 16.2217C15.73 16.6297 15.2395 16.8337 14.6666 16.8337H2.16659ZM2.16659 14.7503H14.6666V2.25033H2.16659V14.7503Z" fill="#1C1B1F" />
          </svg>

        </div>
        <div
          className={`icon-wrapper ${AudioMuted ? "muted" : ""}`}
          onClick={() => {
            userStream ? toggle_audio(userStream) : null; SetAudioMuted(!AudioMuted);
            !AudioMuted ?
              SocketUse && SocketUse.send(JSON.stringify({
                'message': 'audio_muted',
              }))

              :
              SocketUse && SocketUse.send(JSON.stringify({
                'message': 'audio_unmuted',
              }))
          }}
        >

          <svg width="15" height="20" viewBox="0 0 15 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.49992 12.583C6.63186 12.583 5.89402 12.2792 5.28638 11.6715C4.67874 11.0639 4.37492 10.3261 4.37492 9.45801V3.20801C4.37492 2.33995 4.67874 1.60211 5.28638 0.994466C5.89402 0.386827 6.63186 0.0830078 7.49992 0.0830078C8.36797 0.0830078 9.10582 0.386827 9.71346 0.994466C10.3211 1.60211 10.6249 2.33995 10.6249 3.20801V9.45801C10.6249 10.3261 10.3211 11.0639 9.71346 11.6715C9.10582 12.2792 8.36797 12.583 7.49992 12.583ZM6.45825 19.8747V16.6715C4.6527 16.4285 3.15964 15.6212 1.97909 14.2497C0.79853 12.8781 0.208252 11.2809 0.208252 9.45801H2.29159C2.29159 10.899 2.7994 12.1273 3.81502 13.1429C4.83065 14.1585 6.05895 14.6663 7.49992 14.6663C8.94089 14.6663 10.1692 14.1585 11.1848 13.1429C12.2004 12.1273 12.7083 10.899 12.7083 9.45801H14.7916C14.7916 11.2809 14.2013 12.8781 13.0208 14.2497C11.8402 15.6212 10.3471 16.4285 8.54158 16.6715V19.8747H6.45825ZM7.49992 10.4997C7.79506 10.4997 8.04245 10.3998 8.24211 10.2002C8.44176 10.0005 8.54158 9.75315 8.54158 9.45801V3.20801C8.54158 2.91287 8.44176 2.66547 8.24211 2.46582C8.04245 2.26617 7.79506 2.16634 7.49992 2.16634C7.20478 2.16634 6.95738 2.26617 6.75773 2.46582C6.55808 2.66547 6.45825 2.91287 6.45825 3.20801V9.45801C6.45825 9.75315 6.55808 10.0005 6.75773 10.2002C6.95738 10.3998 7.20478 10.4997 7.49992 10.4997Z" fill="#1C1B1F" />
          </svg>
        </div>


        <div className='icon-wrapper' onClick={toggleScreenShare}>
          {SharingScreen ?
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m358-316 122-122 122 122 42-42-122-122 122-122-42-42-122 122-122-122-42 42 122 122-122 122 42 42ZM140-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140Zm0-60h680v-520H140v520Zm0 0v-520 520Z" /></svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M451-328h59v-194l79 81 43-43-153-152-152 152 43 43 81-81v194ZM140-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140Zm0-60h680v-520H140v520Zm0 0v-520 520Z" /></svg>
          }

        </div>

        <div className="icon-wrapper leave" onClick={() => { window.location.href = '/' }}>
          <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.70833 18.875C2.13542 18.875 1.64497 18.671 1.23698 18.263C0.828993 17.855 0.625 17.3646 0.625 16.7917V2.20833C0.625 1.63542 0.828993 1.14497 1.23698 0.736979C1.64497 0.328993 2.13542 0.125 2.70833 0.125H10V2.20833H2.70833V16.7917H10V18.875H2.70833ZM14.1667 14.7083L12.7344 13.1979L15.3906 10.5417H6.875V8.45833H15.3906L12.7344 5.80208L14.1667 4.29167L19.375 9.5L14.1667 14.7083Z" fill="white" />
          </svg>

        </div>

      </div>

    </div>
  )
}

export default VideoCall