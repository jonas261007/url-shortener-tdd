import { Request, Response } from 'express';
import { Link } from '../entities/Link';
import { User } from '../entities/User';
import QRCode from 'qrcode';
import { nanoid } from 'nanoid';

export class LinkController {
  static async create(req: Request, res: Response) {
    const { original_url, expires_at } = req.body;
    const userId = (req as any).userId; // middleware auth popula userId

    if (!original_url || !/^https?:\/\/.+/.test(original_url)) {
      return res.status(400).json({ error: 'URL inválida' });
    }

    if (expires_at && new Date(expires_at) <= new Date()) {
      return res.status(400).json({ error: 'expires_at deve ser maior que agora' });
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

    const slug = nanoid(8);
    const link = Link.create({ user, original_url, slug, expires_at });

    // Gerar QR Code
    link.qr_code = await QRCode.toDataURL(`${req.protocol}://${req.get('host')}/s/${slug}`);

    await link.save();

    return res.status(201).json({
      id: link.id,
      original_url: link.original_url,
      slug: link.slug,
      qr_code: link.qr_code,
      status: link.status,
      expires_at: link.expires_at,
    });
  }

  static async list(req: Request, res: Response) {
    const userId = (req as any).userId;
    const links = await Link.find({ where: { user: { id: userId } } });
    return res.json(links);
  }
}
