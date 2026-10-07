import { Response } from "express";
import { ProtectedRequest } from "../types/request";
import Notification from "../models/notificationModel";

/*
 * @route    GET /notifications
 * @desc     Get all notifications belonging to a specific user
 * @access   Private
 */
export const getNotifications = async (
  req: ProtectedRequest,
  res: Response,
) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user,
    }).sort({ createdAt: -1 });

    res.status(200).json({ notifications });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/*
 * @route    PATCH /notifications/read
 * @desc     Mark every notification of a user as read
 * @access   Private
 */
export const readNotifications = async (
  req: ProtectedRequest,
  res: Response,
) => {
  try {
    await Notification.updateMany(
      { recipient: req.user, read: false },
      { read: true },
    );

    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/*
 * @route    PATCH /notifications/:id/read
 * @desc     Mark a single notification as read
 * @access   Private
 */
export const readNotificationById = async (
  req: ProtectedRequest<undefined, { id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    // Scoped to the recipient, so another user's id can never be touched
    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.user },
      { read: true },
      { new: true },
    );

    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    res.status(200).json({ notification });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/*
 * @route    DELETE /notifications/:id
 * @desc     Dismiss a notification
 * @access   Private
 */
export const deleteNotification = async (
  req: ProtectedRequest<undefined, { id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: req.user,
    });

    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    res.status(200).json({ message: "Notification removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
