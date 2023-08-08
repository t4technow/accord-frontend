import { RootState } from '@/lib/Types';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
  chatSocket: WebSocket;
  currentChat: number,
}

const VideoCall: React.FC<Props> = ({ chatSocket, currentChat }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [isInCall, setIsInCall] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const userId = useSelector((state: RootState) => state.user.userId);

  console.log('first', userId)

  const configuration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      // Add more ICE servers as needed
    ],
  };

  const handleVideoOffer = async (offer: RTCSessionDescriptionInit) => {
    try {
      const remotePeerConnection = new RTCPeerConnection(configuration);

      remotePeerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await remotePeerConnection.createAnswer();
      await remotePeerConnection.setLocalDescription(new RTCSessionDescription(answer));

      chatSocket.send(
        JSON.stringify({
          message_type: 'video_signal',
          signal_type: 'video_answer',
          sender_id: userId,
          signal_data: answer,
          receiver: currentChat,
        })
      );

      remotePeerConnection.ontrack = (event) => {
        console.log('first 233')
        if (!remoteVideoRef.current) return;
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      setPeerConnection(remotePeerConnection);
    } catch (error) {
      console.error('Error handling video offer:', error);
    }
  };

  const handleVideoAnswer = async (answer: RTCSessionDescriptionInit) => {
    try {
      if (!peerConnection) return;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      setIsInCall(true);
    } catch (error) {
      console.error('Error handling video answer:', error);
    }
  };

  const handleICECandidate = (event: RTCPeerConnectionIceEvent) => {
    if (!event.candidate) return;

    chatSocket.send(
      JSON.stringify({
        message_type: 'video_signal',
        signal_type: 'new_ice_candidate',
        sender_id: userId,
        signal_data: event.candidate,
        receiver: currentChat,
      })
    );
  };

  useEffect(() => {
    const getStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error getting user media:', error);
      }
    };

    getStream();
  }, []);

  useEffect(() => {
    if (!localStream) return;

    const connection = new RTCPeerConnection(configuration);

    localStream.getTracks().forEach((track) => {
      connection.addTrack(track, localStream);
    });

    connection.onicecandidate = handleICECandidate;

    connection.ontrack = (event) => {
      if (!remoteVideoRef.current) return;
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    setPeerConnection(connection);
  }, [localStream]);

  useEffect(() => {
    chatSocket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);

      console.log(receivedData, '======================')

      if (receivedData.message_type === 'video_signal') {
        const signalType = receivedData.signal_type;
        const signalData = receivedData.signal_data;

        switch (signalType) {
          case 'video_offer':
            handleVideoOffer(signalData);
            break;
          case 'video_answer':
            handleVideoAnswer(signalData);
            break;
          case 'new_ice_candidate':
            handleNewICECandidate(signalData);
            break;
          default:
            break;
        }
      }
    };
  }, [chatSocket]);

  const handleNewICECandidate = async (candidate: RTCIceCandidate) => {
    try {
      if (!peerConnection) return;
      await peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  const startCall = async () => {
    try {
      if (!peerConnection) return;

      console.log('first')
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

      chatSocket.send(
        JSON.stringify({
          message_type: 'video_signal',
          signal_type: 'video_offer',
          sender_id: userId,
          signal_data: offer,
          receiver: currentChat,
        })
      );
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  return (
    <div className="video-call-container">
      <div className="videos-container">
        <video className="video-holder" ref={localVideoRef} autoPlay playsInline muted />
        <video className="video-holder" ref={remoteVideoRef} autoPlay playsInline />
      </div>
      <div className="video-controls">
        {isInCall ? (
          <div className="icon-wrapper">
            {/* Add video call controls for an ongoing call */}
          </div>
        ) : (
          <button className="start-call-button" onClick={startCall}>
            Start Call
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
