import { Request, Response } from 'express';
import { Link } from '../entities/Link';
import { Visit } from '../entities/Visit';

export const RedirectController = {
  async resolve(req: Request, res: Response) {
    const { slug } = req.params;
    const link = await Link.findOne({ where: { slug } });

    if (!link) return res.status(404).send('Link não encontrado');

    const now = new Date();
    if (link.expires_at && now > link.expires_at) {
      link.status = 'expired';
      await link.save();
      return res.status(410).send('Link expirado'); // 👈 agora 410
    }

    if (link.status !== 'active') {
      return res.status(410).send('Link inativo'); // 👈 mantive 410 para consistência
    }

    // Registrar visita
    await Visit.create({
      link,
      ip_hash: 'anon',
      user_agent: req.headers['user-agent'] || 'unknown',
    }).save();

    link.click_count += 1;
    await link.save();

    return res.redirect(link.original_url);
  },
};
