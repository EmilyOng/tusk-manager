import { toast } from 'bulma-toast'

export enum NotificationType {
  Success = 'is-success',
  Info = 'is-info',
  Warning = 'is-warning',
  Error = 'is-danger'
}

export function useNotification({
  type,
  message
}: {
  type: NotificationType
  message: string
}) {
  toast({
    type,
    message,
    dismissible: true,
    position: 'bottom-center',
    duration: 5000
  })
}
