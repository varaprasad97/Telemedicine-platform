import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import axios from 'axios';

const socket = io(axios.defaults.baseURL);

const VideoCall = ({ roomId }) => {
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 }, audio: true }).then(stream => {
      userVideo.current.srcObject = stream;
      socket.emit('join-room', roomId, socket.id);

      socket.on('user-connected', userId => {
        const peer = createPeer(userId, socket.id, stream);
        peersRef.current.push({ peerId: userId, peer });
        setPeers([...peersRef.current]);
      });
    })
    .catch(error => {
      console.error('Error accessing media devices:', error);
      // You might want to display an error message to the user here
    });

    return () => socket.disconnect();
  }, [roomId]);

  const createPeer = (userId, callerId, stream) => {
    const peer = new Peer({ initiator: true, trickle: false, stream, config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] } });
    peer.on('signal', signal => socket.emit('signal', { userId, callerId, signal }));
    return peer;
  };

  return (
    <div className="p-4">
      <video ref={userVideo} autoPlay muted className="w-1/2" />
      {peers.map(peer => (
        <video key={peer.peerId} ref={ref => ref && (ref.srcObject = peer.peer.stream)} autoPlay className="w-1/2" />
      ))}
    </div>
  );
};

export default VideoCall;