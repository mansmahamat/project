import React, { useState, useEffect } from 'react';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text,
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX
} from 'lucide-react-native';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  autoplay?: boolean;
  height?: number;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  fullWidth?: boolean;
}

export default function VideoPlayer({ 
  videoUrl, 
  title,
  autoplay = false,
  height = 280,
  loop = false,
  muted = false,
  fullWidth = false,
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(muted);
  const [controlsOpacity] = useState(new Animated.Value(1));

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = loop;
    player.muted = isMuted;
    if (autoplay) {
      player.play();
    }
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  // Update muted state when prop changes
  useEffect(() => {
    player.muted = isMuted;
  }, [isMuted, player]);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showControls && isPlaying) {
      const timer = setTimeout(() => {
        Animated.timing(controlsOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowControls(false));
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showControls, isPlaying, controlsOpacity]);

  // Set loading to false after a short delay to simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    controlsOpacity.setValue(1);
  };



  return (
    <View style={[
      styles.container, 
      { height },
      fullWidth && styles.fullWidthContainer
    ]}>
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.titleBadge}>
            <Text style={styles.titleBadgeText}>Video Tutorial</Text>
          </View>
        </View>
      )}
      
      <View style={styles.videoContainer}>
        <TouchableOpacity 
          style={styles.videoTouchArea}
          onPress={showControlsTemporarily}
          activeOpacity={1}
        >
          <VideoView 
            style={styles.video} 
            player={player} 
            allowsFullscreen 
            allowsPictureInPicture 
            contentFit="contain"
          />
        </TouchableOpacity>

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FF6B35" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}

        {/* Controls Overlay */}
        {!isLoading && (
          <Animated.View 
            style={[
              styles.controlsOverlay,
              { opacity: controlsOpacity }
            ]}
            pointerEvents={showControls ? 'auto' : 'none'}
          >
            {/* Main Controls */}
            <View style={styles.mainControls}>
              <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause}>
                {isPlaying ? (
                  <Pause size={32} color="#fff" fill="#fff" />
                ) : (
                  <Play size={32} color="#fff" fill="#fff" />
                )}
              </TouchableOpacity>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <View style={styles.videoPlayerInfo}>
                <Text style={styles.videoStatusText}>
                  {isPlaying ? 'Playing' : 'Paused'}
                </Text>
              </View>
              
              <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
                {isMuted ? (
                  <VolumeX size={20} color="#fff" />
                ) : (
                  <Volume2 size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fullWidthContainer: {
    borderRadius: 0,
  },
  titleContainer: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  titleBadge: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  titleBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  videoTouchArea: {
    flex: 1,
  },
  video: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 12,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
    padding: 20,
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 40,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 107, 53, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressContainer: {
    flex: 1,
    marginRight: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 2,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  rightControls: {
    flexDirection: 'row',
    gap: 12,
  },
  smallControlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayerInfo: {
    flex: 1,
  },
  videoStatusText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  muteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});