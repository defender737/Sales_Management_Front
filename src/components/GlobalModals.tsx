import AlertModal from "./AlertModal";
import Modal from './Modal'
import { useAlertModal } from "../stores/useAlertModal";
import { useFormModal } from "../stores/useFormModal";

export default function GlobalModals() {
    const {
        isOpen : alertOpen,
        content,
        buttonCount,
        onConfirm,
        cancleText,
        confirmText,
        close : closeAlert
    } = useAlertModal();

    const {
        isOpen : formOpen,
        title,
        subTitle,
        formComponent,
        close : closeForm
    } = useFormModal();

    return(
        <>
          <AlertModal
            open = {alertOpen}
            onClose = {closeAlert}
            onConfirm = {onConfirm}
            content = {content}
            cancelText = {cancleText}
            confirmText = {confirmText}
            buttonCount = {buttonCount}
          />
          <Modal
            open = {formOpen}
            handleClose = {closeForm}
            title = {{title, subTitle}}
          >
            {formComponent}
          </Modal>
        </>
    )
}