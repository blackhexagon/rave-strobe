import "./Cartoon.css";
import { useEffect, useState } from "react";
import { hexToRgb } from "../../utils/color.ts";

interface Props {
  energy: number;
  color: string;
  tickThreshold: number;
}

const cartoons = [
  ...document.querySelectorAll<HTMLLinkElement>("link[rel=preload][as=image]"),
].map((link) => link.href);

const Cartoon = ({ energy, tickThreshold, color }: Props) => {
  const [src, setSrc] = useState(cartoons[0]);
  const rgb = hexToRgb(color); // https://stackoverflow.com/a/54000884

  useEffect(() => {
    const nextIndex = cartoons.indexOf(src) + 1;
    setSrc(cartoons[nextIndex] || cartoons[0]);
  }, [energy > tickThreshold]);

  return (
    <>
      <svg height="0px" width="0px">
        <defs>
          <filter id="recolor" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values={
                rgb.map((number) => `0 0 0 0 ${number / 255}`).join("\n") +
                "\n0 0 0 1 0"
              }
            />
          </filter>
        </defs>
      </svg>
      <img className={"cartoon"} src={src} alt={"Cartoon"} />
    </>
  );
};

export default Cartoon;
