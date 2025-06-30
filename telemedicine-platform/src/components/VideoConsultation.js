import React, { useState, useRef, useEffect } from 'react';
import { FaVideo, FaMicrophone, FaMicrophoneSlash, FaVideoSlash, FaPhoneSlash, FaUserMd, FaUser, FaClock, FaInfoCircle, FaPaperPlane, FaComments, FaDesktop, FaExpand, FaCompress, FaFileMedical, FaShare, FaEllipsisH } from 'react-icons/fa';

const VideoConsultation = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const chatEndRef = useRef(null);
  const screenShareRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isStreaming) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStreaming]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startVideo = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      setError('Could not access camera: ' + err.message);
    }
  };

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsStreaming(false);
      setIsMuted(false);
      setIsVideoOff(false);
      setCallDuration(0);
      setIsScreenSharing(false);
    }
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = screenStream;
          setIsScreenSharing(true);
        }
      } else {
        if (screenShareRef.current) {
          screenShareRef.current.srcObject.getTracks().forEach(track => track.stop());
          screenShareRef.current.srcObject = null;
          setIsScreenSharing(false);
        }
      }
    } catch (err) {
      setError('Could not share screen: ' + err.message);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement recording functionality here
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, {
        text: newMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      }]);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Video Consultation
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-400">
            <FaUserMd className="text-xl" />
            <span>Dr. John Smith</span>
            <span className="mx-2">•</span>
            <FaClock className="text-xl" />
            <span>{formatTime(callDuration)}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Container */}
            <div className="lg:col-span-2">
              <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video shadow-2xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />
                {isVideoOff && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <FaVideoSlash className="text-6xl text-gray-600" />
                  </div>
                )}
                {!isStreaming && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <FaVideo className="text-6xl text-blue-500 mb-4" />
                      <p className="text-gray-400 text-lg">Click Start to begin video consultation</p>
                    </div>
                  </div>
                )}
                
                {/* Screen Share Video */}
                {isScreenSharing && (
                  <div className="absolute top-4 right-4 w-1/4 aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                    <video
                      ref={screenShareRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                {/* Video Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-blue-400" />
                      <span className="text-sm">You</span>
                    </div>
                    {isStreaming && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{isMuted ? 'Muted' : 'Unmuted'}</span>
                        <span className="text-sm">{isVideoOff ? 'Camera Off' : 'Camera On'}</span>
                        {isScreenSharing && <span className="text-sm text-green-400">Screen Sharing</span>}
                        {isRecording && <span className="text-sm text-red-400">Recording</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl p-6 shadow-xl h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <FaInfoCircle className="mr-2 text-blue-400" />
                    {showChat ? 'Chat' : 'Consultation Info'}
                  </h2>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-all"
                    title={showChat ? "Hide Chat" : "Show Chat"}
                  >
                    <FaComments className="text-xl" />
                  </button>
                </div>

                {!showChat ? (
                  <div className="space-y-4">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-400">Patient Name</p>
                      <p className="font-medium">John Doe</p>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-400">Appointment Time</p>
                      <p className="font-medium">10:00 AM</p>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-400">Symptoms</p>
                      <p className="font-medium">Fever and cough</p>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-400">Medical History</p>
                      <button className="mt-2 text-blue-400 hover:text-blue-300 flex items-center">
                        <FaFileMedical className="mr-2" />
                        View Medical Records
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.sender === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-200'
                            }`}
                          >
                            <p>{message.text}</p>
                            <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FaPaperPlane />
                      </button>
                    </form>
                  </div>
                )}

                {error && (
                  <div className="mt-4 bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            {!isStreaming ? (
              <button
                onClick={startVideo}
                className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <FaVideo className="text-xl" />
                <span>Start Video</span>
              </button>
            ) : (
              <>
                <button
                  onClick={toggleMute}
                  className={`p-4 rounded-full ${
                    isMuted ? 'bg-red-600' : 'bg-gray-700'
                  } hover:bg-opacity-80 transition-all transform hover:scale-105 shadow-lg`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <FaMicrophoneSlash className="text-xl" />
                  ) : (
                    <FaMicrophone className="text-xl" />
                  )}
                </button>

                <button
                  onClick={toggleVideo}
                  className={`p-4 rounded-full ${
                    isVideoOff ? 'bg-red-600' : 'bg-gray-700'
                  } hover:bg-opacity-80 transition-all transform hover:scale-105 shadow-lg`}
                  title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                  {isVideoOff ? (
                    <FaVideoSlash className="text-xl" />
                  ) : (
                    <FaVideo className="text-xl" />
                  )}
                </button>

                <button
                  onClick={toggleScreenShare}
                  className={`p-4 rounded-full ${
                    isScreenSharing ? 'bg-green-600' : 'bg-gray-700'
                  } hover:bg-opacity-80 transition-all transform hover:scale-105 shadow-lg`}
                  title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
                >
                  <FaDesktop className="text-xl" />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-4 rounded-full bg-gray-700 hover:bg-opacity-80 transition-all transform hover:scale-105 shadow-lg"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? (
                    <FaCompress className="text-xl" />
                  ) : (
                    <FaExpand className="text-xl" />
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="p-4 rounded-full bg-gray-700 hover:bg-opacity-80 transition-all transform hover:scale-105 shadow-lg"
                    title="More Options"
                  >
                    <FaEllipsisH className="text-xl" />
                  </button>
                  
                  {showMoreOptions && (
                    <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-xl p-2 space-y-2">
                      <button
                        onClick={toggleRecording}
                        className={`w-full px-4 py-2 rounded-lg flex items-center space-x-2 ${
                          isRecording ? 'bg-red-600' : 'bg-gray-700'
                        } hover:bg-opacity-80 transition-colors`}
                      >
                        <FaVideo className="text-xl" />
                        <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                      </button>
                      <button
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 hover:bg-opacity-80 transition-colors flex items-center space-x-2"
                      >
                        <FaShare className="text-xl" />
                        <span>Share Link</span>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={stopVideo}
                  className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
                  title="End Call"
                >
                  <FaPhoneSlash className="text-xl" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation; 