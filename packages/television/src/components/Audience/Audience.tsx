import "./Audience.css";
import { useEffect, useState } from "react";

interface Props {
  photos: Array<[number, string]>;
}

const Audience = ({ photos }: Props) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    // Set up the interval
    const timerId = setInterval(() => {
      // Update the current time every minute
      setCurrentTime(Date.now());
    }, 10000); // Every 10 seconds
    // Clear the interval when the component unmounts
    return () => clearInterval(timerId);
  }, []);

  const newPhotos = photos.filter(([dt]) => dt + 60000 > currentTime);
  const random = newPhotos[Math.floor(Math.random() * newPhotos.length)];
  if (!random) return null;
  const [, src] = random;
  return <img className={"audience"} src={src} alt={"audience"} />;
};

export default Audience;
