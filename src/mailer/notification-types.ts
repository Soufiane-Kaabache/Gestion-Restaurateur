export enum NotificationType {
  NEW_RESERVATION = 'NEW_RESERVATION',
  RESERVATION_CANCELLED = 'RESERVATION_CANCELLED',
  RESERVATION_MODIFIED = 'RESERVATION_MODIFIED',

  NEW_ORDER = 'NEW_ORDER',
  ORDER_READY = 'ORDER_READY',

  DISH_TO_PREPARE = 'DISH_TO_PREPARE',
  DRINKS_ORDER = 'DRINKS_ORDER',
}

export enum StaffRole {
  MANAGER = 'MANAGER',
  BARTENDER = 'BARTENDER',
  WAITER = 'WAITER',
  KITCHEN = 'KITCHEN',
}

export interface NotificationRecipient {
  role: StaffRole;
  email: string;
  name?: string;
}

export interface NotificationConfig {
  type: NotificationType;
  recipients: StaffRole[];
}

export type NotificationRules = Record<NotificationType, NotificationConfig>;
