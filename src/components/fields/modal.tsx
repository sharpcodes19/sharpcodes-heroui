"use client"

import {
	cn,
	Description,
	DescriptionProps,
	Modal as HeroUIModal,
	ModalBackdropProps,
	ModalBodyProps,
	ModalCloseTriggerProps,
	ModalContainerProps,
	ModalDialogProps,
	ModalFooterProps,
	ModalHeaderProps,
	ModalHeadingProps,
	ModalIconProps,
	ModalProps,
	Separator,
	SeparatorProps
} from "@heroui/react"
import { LucideIcon } from "lucide-react"
import { createElement, PropsWithChildren, ReactNode } from "react"
import { WithProperties } from "../../types/properties"

// prettier-ignore
type TModal = {
  showCloseButton?: boolean
  icon?: LucideIcon
  heading?: string
  description?: string
  footer?: ReactNode
} & Pick<ModalProps, "isOpen" | "onOpenChange">
  & WithProperties<{
    modal?: Omit<ModalProps, "isOpen" | "onOpenChange">
    backdrop?: ModalBackdropProps
    container?: ModalContainerProps
    dialog?: ModalDialogProps
    header?: ModalHeaderProps
    heading?: ModalHeadingProps
    close?: ModalCloseTriggerProps
    icon?: ModalIconProps
    description?: DescriptionProps
    separator?: SeparatorProps
    body?: ModalBodyProps
    footer: ModalFooterProps
  }>

// prettier-ignore
export const Modal = ({ isOpen, icon, footer, onOpenChange, properties, showCloseButton, description, heading, children }: PropsWithChildren<TModal>) => {

  return <HeroUIModal isOpen={isOpen} onOpenChange={onOpenChange} { ...properties?.modal }>
    <HeroUIModal.Backdrop isDismissable={false} { ...properties?.backdrop }>
      <HeroUIModal.Container size="lg" { ...properties?.container }>
        <HeroUIModal.Dialog { ...properties?.dialog }>
          {
            !showCloseButton ? null :
            <HeroUIModal.CloseTrigger { ...properties?.close } className={cn("text-danger bg-danger-soft", properties?.close?.className)} />
          }
          <HeroUIModal.Header { ...properties?.header }>
            {
              !icon ? null :
              <HeroUIModal.Icon { ...properties?.icon } className={cn("bg-default text-foreground", properties?.icon?.className)}>
                { createElement(icon) }
              </HeroUIModal.Icon>
            }
            {
              !heading ? null :
              <HeroUIModal.Heading { ...properties?.heading }>{ heading }</HeroUIModal.Heading>
            }
            {
              !description ? null :
              <Description { ...properties?.description } className={cn("text-muted text-sm", properties?.description?.className)}>{ description }</Description>
            }
          </HeroUIModal.Header>
          <Separator { ...properties?.separator } className={cn("mt-5 mb-3", properties?.separator?.className)} />
          <HeroUIModal.Body { ...properties?.body }>
            { children }
          </HeroUIModal.Body>
          {
            !footer ? null :
            <HeroUIModal.Footer { ...properties?.footer }>{ footer }</HeroUIModal.Footer>
          }
        </HeroUIModal.Dialog>
      </HeroUIModal.Container>
    </HeroUIModal.Backdrop>
  </HeroUIModal>


}
