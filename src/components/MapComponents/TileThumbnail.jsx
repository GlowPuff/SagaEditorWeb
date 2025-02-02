import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Typography, Skeleton } from "@mui/material";

const TileThumbnail = ({ src, alt, selectedThumbs }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px 0px", // Preload images before they enter viewport
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer && observer.disconnect) observer.disconnect();
    };
  }, []);

  return (
    <div
      className="simple-column"
      style={{
        position: "relative",
        gap: "0",
        height: "128px", // Fixed height to prevent layout shifts
        width: "128px", // Fixed width to prevent layout shifts
      }}
    >
      {
        <Skeleton
          variant="rectangular"
          width={128}
          height={128}
          animation="wave"
          style={{
            position: "absolute",
            backgroundColor: "rgba(157, 125, 222, 0.1)",
            display: isLoaded ? "none" : "block",
            zIndex: 1,
          }}
        />
      }
      {
        <img
          ref={imgRef}
          src={isVisible ? src : ""}
          alt={alt}
          className={
            "tileGalleryThumbnail" +
            (selectedThumbs.includes(alt) ? " selectedThumb" : "")
          }
          loading="lazy"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
            position: "absolute",
            zIndex: 2,
          }}
          onLoad={() => setIsLoaded(true)}
        />
      }
      <Typography
        variant="caption"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          padding: "2px 4px",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        {alt}
      </Typography>
    </div>
  );
};

TileThumbnail.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  selectedThumbs: PropTypes.array.isRequired,
};

export default TileThumbnail;
