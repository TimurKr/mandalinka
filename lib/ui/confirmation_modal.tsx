import { Modal } from 'flowbite-react';
import Button from '@/lib/ui/button';

export default function ConfirmationModal({
  show,
  onClose,
  onConfirm,
  confirmText,
  cancelText = 'Zrušiť',
  variant = 'danger',
  dismissible = true,
  size = 'sm',
  header,
  icon,
  footer,
  children,
  disableConfirm = false,
}: {
  show: boolean;
  onClose: () => void;
  onConfirm: (e: React.FormEvent | undefined) => void;
  confirmText: string;
  variant?:
    | 'danger'
    | 'warning'
    | 'success'
    | 'black'
    | 'primary'
    | 'secondary';
  cancelText?: string;
  dismissible?: boolean;
  size?:
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl';
  header?: string | JSX.Element;
  icon?: JSX.Element;
  footer?: string | JSX.Element;
  children?: string | JSX.Element | JSX.Element[];
  disableConfirm?: boolean;
}) {
  return (
    <Modal show={show} dismissible={true} onClose={onClose} size={size || 'sm'}>
      {header && (
        <Modal.Header>
          <div className="flex items-center gap-2">
            {icon}
            {header}
          </div>
        </Modal.Header>
      )}
      {children && <Modal.Body>{children}</Modal.Body>}
      <Modal.Footer>
        {footer ? (
          footer
        ) : (
          <>
            <Button onClick={onClose} variant="black">
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              variant={variant}
              dark
              disabled={disableConfirm}
            >
              {confirmText}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}
