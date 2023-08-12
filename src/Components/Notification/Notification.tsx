import { RootState } from "@/lib/Types";
import { get_user_media } from "@/page/helper";
import { setCurrentChat, setTarget } from "@/redux/chat/currentChatSlice";
import { SetStateAction, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  notification: any;
  indx: number
  closeNotification: (index: number) => void
  setShowVideo: React.Dispatch<SetStateAction<boolean>>;

}

const Notification = ({ notification, indx, closeNotification, setShowVideo }: Props) => {
  const userMedia = useRef<HTMLVideoElement>(null)
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const userId = useSelector((state: RootState) => state.user.userId)
  const dispatch = useDispatch()
  // Load the audio file and set up the soundRef
  useEffect(() => {
    const audio = notification.type === 'voice' || notification.type === 'video' ? '/audio/incoming_call.mp3' : '/audio/Notification.mp3'
    soundRef.current = new Audio(audio);
  }, []);

  // Play the audio when the component mounts
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.play();
      console.log('playing');

    }

    // Clean up and pause the audio when the component unmounts
    return () => {
      if (soundRef.current) {
        soundRef.current.pause();
        soundRef.current.currentTime = 0;
      }
    };
  }, []);

  get_user_media({ video: true, audio: false })
    .then(media => {
      userMedia.current!.srcObject = media
    })

  const acceptCall = (index: number) => {
    dispatch(setCurrentChat(notification.sender_id))
    if (userId) dispatch(setTarget(userId))
    setShowVideo(true)
    closeNotification(index)
  }

  return (
    <div className="notification">
      {notification.type === 'video' ?
        <>
          <video className="video-call_notification" ref={userMedia} autoPlay playsInline></video>
          <div className="notification-header">
            <h4 className="title">{notification.sender}</h4>
            <h6>{notification.title}</h6>
          </div>
        </>
        :
        <h4 className="title">{notification.title}</h4>
      }

      <div className="response">
        <button className="btn-primary" onClick={() => acceptCall(indx)}>
          Accept
        </button>
        <button className="btn-secondary" onClick={() => {
          closeNotification(indx)
          userMedia.current!.srcObject = null
        }}>
          Reject
        </button>
      </div>

    </div>
  )
}

export default Notification