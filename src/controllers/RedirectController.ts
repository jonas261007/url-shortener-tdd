import { Request, Response } from 'express';
import { Link } from '../entities/Link';
import { Visit } from '../entities/Visit';
import crypto from 'crypto';

export class RedirectController {
  static async resolve(req: Request, res: Response) {
    const { slug } = req.params;

    const link = await Link.findOne({ where: { slug } });
    if (!link) {
      return res.status(404).send('<h1>Link não encontrado</h1>');
    }

    const now = new Date();
    if (link.expires_at && now > link.expires_at) {
      if (link.status !== 'expired') {
        link.status = 'expired';
        await link.save();
      }
      return res.status(410).send('<h1>Link expirado</h1>');
    }

    if (link.status !== 'active') {
      return res.status(410).send('<h1>Link indisponível</h1>');
    }

    // Incrementa clique
    link.click_count += 1;
    await link.save();

    // Registra visita (IP hash + UA)
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '';
    const ip_hash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
    const user_agent = req.headers['user-agent'] || '';

    const visit = Visit.create({ link, ip_hash, user_agent });
    await visit.save();

    return res.redirect(302, link.original_url);
  }
}
