import "./Strobe.css";
import { CSSProperties } from "react";

interface Props {
  energy: number;
  frequency: number;
  color: string;
}

const Strobe = ({ energy, color, frequency }: Props) => (
  <div
    className={"strobe"}
    style={
      {
        "--energy": frequency ? 0 : energy,
        "--color": color,
        "--frequency": `${frequency}ms`,
      } as CSSProperties
    }
  />
);

export default Strobe;
