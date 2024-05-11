import Image from "next/image";
import addbin from '@/public/main_content/add b4.png'
const ButtonBin = ({ text, onClick }) => {
   return (
     <button onClick={onClick} className="custom-button f14 flex items-center">
       {text}
       <Image src={addbin} width={18}  alt="addbin" className="mx-1 hauto"/>
     </button>
   );
 };
 
export default ButtonBin;