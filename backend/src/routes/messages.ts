import { Router } from "express";
import { AppDataSource } from "../data-source";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { Message } from "../entity/message";
import { User } from "../entity/user";
import { Property } from "../entity/property";

const router = Router();
const normalizeSubject = (subject: unknown): string | null => {
  if (typeof subject !== "string") {
    return null;
  }
  const trimmed = subject.trim();
  return trimmed.length > 0 ? trimmed : null;
};

router.get("/unread-count", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const messageRepository = AppDataSource.getRepository(Message);
    const count = await messageRepository
      .createQueryBuilder("message")
      .where("message.\"recipientId\" = :userId", { userId })
      .andWhere("message.\"isRead\" = false")
      .getCount();

    res.json({ count });
  } catch (error) {
    console.error("Error fetching unread count", error);
    res.status(500).json({ error: "Failed to load unread messages" });
  }
});

router.patch("/mark-read", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    const { messageIds } = req.body || {};

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({ error: "messageIds array is required" });
    }

    const uniqueIds = [...new Set(messageIds)]
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0);

    if (uniqueIds.length === 0) {
      return res.status(400).json({ error: "Valid messageIds are required" });
    }

    const messageRepository = AppDataSource.getRepository(Message);

    await messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true })
      .where("id IN (:...ids)", { ids: uniqueIds })
      .andWhere("\"recipientId\" = :userId", { userId })
      .andWhere("\"isRead\" = false")
      .execute();

    const remainingCount = await messageRepository
      .createQueryBuilder("message")
      .where("message.\"recipientId\" = :userId", { userId })
      .andWhere("message.\"isRead\" = false")
      .getCount();

    res.json({ count: remainingCount });
  } catch (error) {
    console.error("Error marking messages as read", error);
    res.status(500).json({ error: "Failed to update messages" });
  }
});

router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const messageRepository = AppDataSource.getRepository(Message);

    const messages = await messageRepository
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.sender", "sender")
      .leftJoinAndSelect("message.recipient", "recipient")
      .leftJoinAndSelect("message.property", "property")
      .where("sender.id = :userId OR recipient.id = :userId", { userId })
      .orderBy("message.createdAt", "ASC")
      .getMany();

    res.json({ messages });
  } catch (error) {
    console.error("Error fetching messages", error);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

router.post("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { recipientId, propertyId, subject, body } = req.body || {};
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const trimmedBody = typeof body === "string" ? body.trim() : "";

    if (!trimmedBody) {
      return res.status(400).json({ error: "Message body is required" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const propertyRepository = AppDataSource.getRepository(Property);
    const messageRepository = AppDataSource.getRepository(Message);

    const sender = await userRepository.findOne({ where: { id: userId } });

    if (!sender) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let property: Property | null = null;
    let recipient = null as User | null;

    if (propertyId) {
      property = await propertyRepository.findOne({
        where: { id: Number(propertyId) },
        relations: ["owner"],
      });

      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      if (!property.owner) {
        return res.status(400).json({ error: "Property owner not available" });
      }

      if (property.owner.id !== sender.id) {
        recipient = property.owner;
      }
    }

    if (!recipient) {
      if (!recipientId) {
        return res.status(400).json({ error: "Recipient is required" });
      }

      recipient = await userRepository.findOne({ where: { id: Number(recipientId) } });

      if (!recipient) {
        return res.status(404).json({ error: "Recipient not found" });
      }
    }

    if (recipient.id === sender.id) {
      return res.status(400).json({ error: "You cannot send a message to yourself" });
    }

    const message = messageRepository.create({
      sender,
      recipient,
      property,
      subject: normalizeSubject(subject),
      body: trimmedBody,
    });

    await messageRepository.save(message);

    const messageWithRelations = await messageRepository.findOne({
      where: { id: message.id },
      relations: ["sender", "recipient", "property"],
    });

    return res.status(201).json({ message: messageWithRelations ?? message });
  } catch (error) {
    console.error("Error sending message", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
