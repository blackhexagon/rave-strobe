import "./Audience.css";
import { useEffect, useState } from "react";

interface Props {
  photos: Array<[number, string]>;
}

const Audience = ({ photos }: Props) => {
  const [src, setSrc] = useState<string|null>(null)

  useEffect(() => {
    const timerId = setInterval(() => {
      const newPhotos = photos.filter(([dt]) => dt + 60000 > Date.now());
      if (newPhotos.length === 0) {
        setSrc(null)
      } else if (newPhotos.length === 1) {
        setSrc(newPhotos[0][1])
      } else {
        const [, newSrc] = newPhotos.filter(([, candidateSrc]) => candidateSrc !==src)[Math.floor(Math.random() * newPhotos.length)];
        setSrc(newSrc)
      }
    }, 5000); // Every 5 seconds
    // Clear the interval when the component unmounts
    return () => clearInterval(timerId);
  }, [photos]);

  if (!src) return null
  return <img className={"audience"} src={src} alt={"audience"} />;
};

export default Audience;
