import Button from "../button/Button";
import { ReactNode } from "react";

interface IEmptyList {
  icon?: ReactNode;
  mainText?: ReactNode;
  secondaryText?: ReactNode;
  onClick?: (val?: any)=>any 
  buttonText?: string
}

const EmptyList: React.FC<IEmptyList> = ({ icon, mainText, secondaryText, onClick, buttonText }) => {
  return (
    <>
      <div className="border-nonejustify-center gap-5 items-center flex-col flex text-center text-black dark:text-white">
         {icon}
         <div>
        <p className="text-xl">{mainText}</p>
        <p className="text-lg">{secondaryText}</p>
        </div>
       {onClick &&  <Button size="sm" onClick={onClick}> {buttonText ?? `Aggiungi`}</Button>}
      </div>
    </>
  );
};

export default EmptyList;
