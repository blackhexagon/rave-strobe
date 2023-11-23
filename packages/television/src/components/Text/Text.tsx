import "./Text.css";
import { CSSProperties } from "react";

interface Props {
  text: string;
  color: string;
}

const Text = ({ text, color }: Props) => {
  return text ? (
    <h1
      style={
        {
          "--color": color,
        } as CSSProperties
      }
      className={"text"}
    >
      {text}
    </h1>
  ) : null;
};

export default Text;
