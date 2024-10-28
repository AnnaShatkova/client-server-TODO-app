import { ImgProps } from "../../interfaces/interfaces";

const Img: React.FC<ImgProps> = ({ img }) => {
  return <img src={`/icons/${img}.svg`} alt={img} />;
};

export default Img;
