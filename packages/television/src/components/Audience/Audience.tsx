import "./Audience.css";

interface Props {
  src: string;
}

const Audience = ({ src }: Props) => {
  return <img className={"audience"} src={src} alt={"audience"} />;
};

export default Audience;
