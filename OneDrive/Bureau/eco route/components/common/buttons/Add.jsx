 import Image from "next/image";
 import add from '@/public/main_content/add1.svg'
 const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className="custom-button f14 flex items-center">
      {text}
      <Image src={add} width={20} height={20} alt="add" className="ml-1"/>
    </button>
  );
};

export default Button;