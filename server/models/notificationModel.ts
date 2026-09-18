import mongoose, { InferSchemaType } from 'mongoose';

export enum NotificationType {
  PROJECT_INVITE = 'PROJECT_INVITE',
  TICKET_ASSIGN = 'TICKET_ASSIGN',
}

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    discriminatorKey: 'type',
  }
);
// Every fetch reads one user's notifications, newest first
notificationSchema.index({ recipient: 1, createdAt: -1 });

export type NotificationDoc = InferSchemaType<typeof notificationSchema>;

const Notification = mongoose.model('Notification', notificationSchema);

const projectInviteSchema = new mongoose.Schema({
  snapshot: {
    project: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      title: { type: String, required: true },
    },
    actor: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
    },
  },
});

export type ProjectInviteNotificationDoc = InferSchemaType<
  typeof projectInviteSchema
>;

export const ProjectInviteNotification = Notification.discriminator(
  NotificationType.PROJECT_INVITE,
  projectInviteSchema
);

const ticketAssignSchema = new mongoose.Schema({
  snapshot: {
    ticket: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      title: { type: String, required: true },
      project: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        title: { type: String, required: true },
      },
    },
    actor: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
    },
  },
});

export type TicketAssignNotificationDoc = InferSchemaType<
  typeof ticketAssignSchema
>;

export const TicketAssignNotification = Notification.discriminator(
  NotificationType.TICKET_ASSIGN,
  ticketAssignSchema
);

export default Notification;
