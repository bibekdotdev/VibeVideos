import { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";

const CustomVideoPlayer = ({ video }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideControlsTimeout = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [skipIndicator, setSkipIndicator] = useState(null);
  const [iconSize, setIconSize] = useState(48);
  const [showControls, setShowControls] = useState(true);
  const [lastTap, setLastTap] = useState(0);

  // Detect small screen
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Adjust icon size
  useEffect(() => {
    const updateIconSize = () => {
      const width = window.innerWidth;
      if (width < 640) setIconSize(24);
      else if (width < 1024) setIconSize(36);
      else setIconSize(48);
    };
    updateIconSize();
    window.addEventListener("resize", updateIconSize);
    return () => window.removeEventListener("resize", updateIconSize);
  }, []);

  // Auto-hide controls
  const resetControlsTimer = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(
      () => setShowControls(false),
      3000
    );
  };

  useEffect(() => {
    resetControlsTimer();
    return () =>
      hideControlsTimeout.current && clearTimeout(hideControlsTimeout.current);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
    resetControlsTimer();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    );
  };

  const handleProgressChange = (e) => {
    if (!videoRef.current) return;
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
    resetControlsTimer();
  };

  const handleVolumeChange = (e) => {
    if (!videoRef.current) return;
    const newVolume = e.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    resetControlsTimer();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) containerRef.current.requestFullscreen?.();
    else document.exitFullscreen?.();
    setShowControls(true);
    resetControlsTimer();
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setVideoSize({
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
    });
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    resetControlsTimer();
  };

  const getVideoStyle = () => {
    if (!containerRef.current || !videoSize.width)
      return { width: "100%", height: "100%" };
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const videoRatio = videoSize.width / videoSize.height;
    const containerRatio = containerWidth / containerHeight;
    if (videoRatio > containerRatio) return { width: "100%", height: "auto" };
    else return { width: "auto", height: "100%" };
  };

  const changePlaybackRate = (rate) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    resetControlsTimer();
  };

  // Skip 10s
  const handleSkip = (x) => {
    if (!videoRef.current || !containerRef.current) return;
    const width = containerRef.current.clientWidth;

    if (x < width * 0.5) {
      videoRef.current.currentTime = Math.max(
        videoRef.current.currentTime - 10,
        0
      );
      setSkipIndicator("left");
    } else {
      videoRef.current.currentTime = Math.min(
        videoRef.current.currentTime + 10,
        videoRef.current.duration
      );
      setSkipIndicator("right");
    }
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    );
    setTimeout(() => setSkipIndicator(null), 500);
  };

  // Handle container tap (double-tap skip)
  const handleContainerTap = (e) => {
    const currentTime = new Date().getTime();
    const tapGap = currentTime - lastTap;

    // Only skip if double tap
    if (tapGap < 300 && tapGap > 0) {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      handleSkip(x);
    }
    setLastTap(currentTime);
    resetControlsTimer();
  };

  if (!video?.videoUrl)
    return <div className="text-white p-5">Video not available</div>;

  return (
    <div
      ref={containerRef}
      className={`relative w-full  mx-auto bg-black overflow-hidden shadow-lg
        ${
          isFullscreen ? "h-screen" : "sm:h-96"
        } flex items-center justify-center`}
      onDoubleClick={(e) => !isSmallScreen && handleSkip(e.clientX)}
      onTouchStart={(e) => isSmallScreen && handleContainerTap(e)}
      onClick={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnded}
        style={getVideoStyle()}
        className="block w-full h-full"
        controls={false}
        autoPlay={false}
      >
        <source src={video.videoUrl} type="video/mp4" />
        <source src={video.videoUrl} type="video/webm" />
      </video>

      {/* Skip animation */}
      {skipIndicator === "left" && (
        <div
          className="absolute left-10 rounded-full p-3 pointer-events-none select-none opacity-90 animate-ping flex items-center justify-center"
          style={{ fontSize: iconSize }}
        >
          <FaBackward />
        </div>
      )}
      {skipIndicator === "right" && (
        <div
          className="absolute right-10 rounded-full p-3 pointer-events-none select-none opacity-90 animate-ping flex items-center justify-center"
          style={{ fontSize: iconSize }}
        >
          <FaForward />
        </div>
      )}

      {/* Play/Pause Icon */}
      <div
        className="absolute p-5 rounded-full pointer-events-auto select-none opacity-90 flex items-center justify-center cursor-pointer animate-pulse"
        style={{ fontSize: iconSize }}
        onClick={togglePlay}
      >
        {isPlaying ? showControls && <FaPause /> : <FaPlay />}
      </div>

      {/* Controls */}
      {showControls && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 sm:p-3 flex flex-col space-y-1 sm:space-y-2 transition-opacity duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="range"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 sm:h-1.5 accent-white cursor-pointer"
          />
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-20 accent-white cursor-pointer"
              />
              <select
                value={playbackRate}
                onChange={(e) => changePlaybackRate(Number(e.target.value))}
                className="bg-black text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded cursor-pointer text-xs sm:text-sm"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
            <button
              onClick={toggleFullscreen}
              className="text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm"
            >
              {isFullscreen ? "🡼" : "⛶"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;
