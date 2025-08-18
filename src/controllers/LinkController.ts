import { Request, Response } from 'express';
import { Link } from '../entities/Link';
import { User } from '../entities/User';
import QRCode from 'qrcode';
import { nanoid } from 'nanoid';

export class LinkController {
  static async create(req: Request, res: Response) {
    const { original_url, expires_at } = req.body;
    const userId = (req as any).userId;

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

    const links = await Link.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
      relations: ['visits'],
    });

    const formattedLinks = links.map(link => ({
      id: link.id,
      original_url: link.original_url,
      slug: link.slug,
      qr_code: link.qr_code,
      status: link.status,
      expires_at: link.expires_at,
      click_count: link.click_count,
      visits: link.visits.map(v => ({
        id: v.id,
        ip_hash: v.ip_hash,
        user_agent: v.user_agent,
        created_at: v.created_at,
      })),
    }));

    return res.status(200).json(formattedLinks);
  }

  static async show(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { id } = req.params;

    const link = await Link.findOne({
      where: { id: Number(id), user: { id: userId } },
      relations: ['visits'],
    });

    if (!link) {
      return res.status(404).json({ error: 'Link não encontrado' });
    }

    return res.status(200).json({
      id: link.id,
      original_url: link.original_url,
      slug: link.slug,
      qr_code: link.qr_code,
      status: link.status,
      expires_at: link.expires_at,
      click_count: link.click_count,
      visits: link.visits.map(v => ({
        id: v.id,
        ip_hash: v.ip_hash,
        user_agent: v.user_agent,
        created_at: v.created_at,
      })),
    });
  }
}
