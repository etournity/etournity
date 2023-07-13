import { useState, useEffect } from 'react'

const useVideosLoaded = () => {
  const [allVideosLoaded, setAllVideosLoaded] = useState(false)
  const [videoCount, setVideoCount] = useState(0)
  const [loadedVideoCount, setLoadedVideoCount] = useState(0)

  useEffect(() => {
    const videos = Array.from(document.getElementsByTagName('video'))
    setVideoCount(videos.length)

    const handleVideoLoaded = () => {
      setLoadedVideoCount((prevLoadedCount) => prevLoadedCount + 1)
    }

    videos.forEach((video) => {
      video.addEventListener('loadeddata', handleVideoLoaded)
    })

    return () => {
      videos.forEach((video) => {
        video.removeEventListener('loadeddata', handleVideoLoaded)
      })
    }
  }, [])

  useEffect(() => {
    if (
      videoCount === 0 ||
      (videoCount > 0 && loadedVideoCount === videoCount)
    ) {
      setAllVideosLoaded(true)
    }
  }, [videoCount, loadedVideoCount])

  return allVideosLoaded
}

export default useVideosLoaded
