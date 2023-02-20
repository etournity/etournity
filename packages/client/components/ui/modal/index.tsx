import React, { ReactNode, FormEvent } from 'react'
import usePortal from 'react-useportal'
import { Button } from '../button'
import { Icon } from '../icon'
import styles from './modal.module.scss'
import { ConditionalWrapper } from '@components/helpers/conditionalWrapper'
import classNames from 'classnames'

export const ModalActions: React.FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <div className={classNames(styles.modalActions, className)}>{children}</div>
)

export interface ModalProps {
  children: ReactNode
  className?: string
  active: boolean
  width?: string
  onClose?: () => void
  onSubmit?: (x?: FormEvent) => void
  titleElement?: ReactNode
  icon?: ReactNode
  hideCloseButton?: boolean
  variant?: 'scroll' | 'fixed'
  stickyContent?: ReactNode
  disablePadding?: boolean
}

/**
 * A global modal component
 * @param {boolean} hideCloseButton hide "x" in top-right (default=false)
 * @param {string} width width of the modal (default=30rem)
 * @example <caption>Example usage of Modal.</caption>
 *   ```tsx
 *   import { Modal, ModalActions } from "@components/ui/modal"
 *   export const exampleModal = ({active, onClose}) => (
 *     <Modal active={active} onClose={onClose}>
 *       <h1>Hi</h1>
 *       <ModalActions>
 *         <button onClick={onClose}>Cancel</button>
 *       </ModalActions>
 *     </Modal>
 *   )
 *   ```
 */
export const Modal = React.forwardRef<HTMLFormElement, ModalProps>(
  (
    {
      children,
      className,
      active,
      onClose,
      width = '30rem',
      onSubmit,
      hideCloseButton = false,
      titleElement,
      icon,
      variant = 'fixed',
      stickyContent,
      disablePadding = false,
      ...rest
    },
    ref
  ) => {
    const { Portal } = usePortal()

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault()
      onSubmit?.({ ...e }) // This can be replaced with just e starting in react 17
    }

    return active ? (
      <Portal>
        <ConditionalWrapper
          condition={onSubmit !== undefined}
          wrapper={(children) => (
            <form
              ref={ref}
              className={classNames(styles.modal, {
                [styles.active]: active,
              })}
              onClick={(e) => e.target === e.currentTarget && onClose?.()}
              onSubmit={handleSubmit}
              {...rest}
            >
              {children}
            </form>
          )}
          altWrapper={(children) => (
            <div
              className={classNames(styles.modal, {
                [styles.active]: active,
              })}
              onClick={(e) => e.target === e.currentTarget && onClose?.()}
              {...rest}
            >
              {children}
            </div>
          )}
        >
          <div
            className={classNames(styles.defaultModal, className, {
              [styles.scroll]: variant === 'scroll',
              [styles.disablePadding]: disablePadding,
            })}
            style={{ width }}
          >
            <div className={styles.header}>
              {icon && <div className={styles.icon}>{icon}</div>}
              {typeof titleElement === 'string' ? (
                <p className={styles.title}>{titleElement}</p>
              ) : (
                titleElement
              )}
              {!hideCloseButton && (
                <Button variant="ghost" onClick={onClose}>
                  <Icon variant="close" size={1} color={styles.darkGrey} />
                </Button>
              )}
            </div>
            {children}
            <div className={styles.sticky}>{stickyContent}</div>
          </div>
        </ConditionalWrapper>
      </Portal>
    ) : null
  }
)

Modal.displayName = 'Modal'
