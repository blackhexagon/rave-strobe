import "./Toggle.css";

interface Props {
  onClick: () => void;
}

const Toggle = ({ onClick }: Props) => (
  <button onClick={onClick} className={"toggle"} />
);

export default Toggle;
