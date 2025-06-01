import { useState } from "react";
import { Modal } from "../modal";
import { toast } from "react-toastify";

interface ConfirmModalProps {
  children: any;
  childrenAction: (action?: any) => any;
  triggerButton: any;
  permission: boolean
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  children,
  childrenAction,
  triggerButton,
  permission
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);


  return (
    <>

      {<div onClick={() => permission ? setIsOpen(true): toast.error('non hai i permessi per compiere questa azione')}>{triggerButton}</div>}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        children={children(
          () => childrenAction(),
          () => setIsOpen(false)
        )}
        className="max-w-[700px] m-4"
      ></Modal>
    </>
  );
};

export default ConfirmModal;
