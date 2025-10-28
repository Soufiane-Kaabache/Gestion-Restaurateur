import { NotificationType, StaffRole, NotificationConfig } from './notification-types';

export const NOTIFICATION_RULES: Record<string, NotificationConfig> = {
  [NotificationType.NEW_RESERVATION]: {
    type: NotificationType.NEW_RESERVATION,
    recipients: [StaffRole.MANAGER, StaffRole.WAITER],
  },

  [NotificationType.RESERVATION_CANCELLED]: {
    type: NotificationType.RESERVATION_CANCELLED,
    recipients: [StaffRole.MANAGER],
  },

  [NotificationType.NEW_ORDER]: {
    type: NotificationType.NEW_ORDER,
    recipients: [StaffRole.WAITER, StaffRole.KITCHEN, StaffRole.BARTENDER],
  },

  [NotificationType.DRINKS_ORDER]: {
    type: NotificationType.DRINKS_ORDER,
    recipients: [StaffRole.BARTENDER],
  },

  [NotificationType.DISH_TO_PREPARE]: {
    type: NotificationType.DISH_TO_PREPARE,
    recipients: [StaffRole.KITCHEN],
  },
};

export function getStaffEmails(): Record<StaffRole, string> {
  return {
    [StaffRole.MANAGER]: process.env.MANAGER_EMAIL || '',
    [StaffRole.BARTENDER]: process.env.BARTENDER_EMAIL || '',
    [StaffRole.WAITER]: process.env.WAITER_EMAIL || '',
    [StaffRole.KITCHEN]: process.env.KITCHEN_EMAIL || '',
  } as Record<StaffRole, string>;
}
