import { Portal } from './portal';
import { useNavigate } from '@remix-run/react';
import { useEffect } from 'react';
import ModalStyles from 'app/routes/components/components.module.css';



interface props {
  children: React.ReactNode
  isOpen: boolean
  ariaLabel?: string
  className?: string
}

export const Modal: React.FC<props> = ({ children, isOpen, ariaLabel, className }) => {
  
    
  const navigate = useNavigate()
  if (!isOpen) return null

  return (
    <Portal wrapperId={ModalStyles.modal } >
        <div className={ModalStyles.modaloverlay }>
        <div
        className="fixed inset-0 overflow-y-auto bg-gray-600 bg-opacity-80"
        aria-labelledby={ariaLabel ?? 'modal-title'}
        role="dialog"
        aria-modal="true"
        onClick={() => navigate('/app/patches')}
      >Close</div>
      <div >
        <div className={`${className} p-4 bg-gray-200 pointer-events-auto max-h-screen md:rounded-xl`}>
          {/* This is where the modal content is rendered  */}
          {children}
        </div>
      </div>
        </div>
    
    </Portal>
  )
}