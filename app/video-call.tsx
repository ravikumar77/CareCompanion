import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Volume2,
  VolumeX,
  RotateCcw,
  MessageCircle
} from 'lucide-react-native';

export default function VideoCallScreen() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate connection delay
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
    }, 3000);

    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end the call?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Call', 
          style: 'destructive',
          onPress: () => router.back()
        }
      ]
    );
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const handleSwitchCamera = () => {
    Alert.alert('Camera Switched', 'Switched to front/back camera');
  };

  const handleSendMessage = () => {
    Alert.alert('Send Message', 'Quick message sent during call');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Area */}
      <View style={styles.videoContainer}>
        {/* Remote Video (Family Member) */}
        <View style={styles.remoteVideo}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.remoteVideoImage}
          />
          {!isConnected && (
            <View style={styles.connectingOverlay}>
              <Text style={styles.connectingText}>Connecting...</Text>
            </View>
          )}
        </View>

        {/* Local Video (Self) */}
        <View style={styles.localVideo}>
          {isVideoOn ? (
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.localVideoImage}
            />
          ) : (
            <View style={styles.videoOffContainer}>
              <VideoOff size={32} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Call Info */}
        <View style={styles.callInfo}>
          <Text style={styles.callerName}>Rose Thompson</Text>
          <Text style={styles.callStatus}>
            {isConnected ? formatDuration(callDuration) : 'Connecting...'}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controls}>
          {/* Mute Button */}
          <TouchableOpacity 
            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            onPress={handleToggleMute}
          >
            {isMuted ? (
              <MicOff size={24} color="#FFFFFF" />
            ) : (
              <Mic size={24} color="#64748B" />
            )}
          </TouchableOpacity>

          {/* Video Button */}
          <TouchableOpacity 
            style={[styles.controlButton, !isVideoOn && styles.controlButtonActive]}
            onPress={handleToggleVideo}
          >
            {isVideoOn ? (
              <Video size={24} color="#64748B" />
            ) : (
              <VideoOff size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          {/* Speaker Button */}
          <TouchableOpacity 
            style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
            onPress={handleToggleSpeaker}
          >
            {isSpeakerOn ? (
              <Volume2 size={24} color="#FFFFFF" />
            ) : (
              <VolumeX size={24} color="#64748B" />
            )}
          </TouchableOpacity>

          {/* Switch Camera */}
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleSwitchCamera}
          >
            <RotateCcw size={24} color="#64748B" />
          </TouchableOpacity>

          {/* Message Button */}
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleSendMessage}
          >
            <MessageCircle size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* End Call Button */}
        <TouchableOpacity 
          style={styles.endCallButton}
          onPress={handleEndCall}
        >
          <PhoneOff size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionText}>I'm OK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionText}>Need Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionText}>Call Later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  remoteVideoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  connectingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectingText: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  localVideo: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#374151',
  },
  localVideoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOffContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#374151',
  },
  callInfo: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 160,
  },
  callerName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  callStatus: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#DC2626',
  },
  endCallButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  quickActionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});