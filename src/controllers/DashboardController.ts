import { Request, Response } from 'express';
import { Link } from '../entities/Link';
import { Visit } from '../entities/Visit';

export const DashboardController = {
  // HTML (MVC)
  async render(req: Request, res: Response) {
    // Página básica — polling client-side chama /metrics/summary e /metrics/top
    return res.render('dashboard', { title: 'URL Shortener • Dashboard' });
  },

  // JSON
  async summary(req: Request, res: Response) {
    const userId = (req as any).userId;

    const total_links = await Link.count({ where: { user: { id: userId } } });
    const active_links = await Link.count({ where: { user: { id: userId }, status: 'active' } });
    const expired_links = await Link.count({ where: { user: { id: userId }, status: 'expired' } });

    const total_clicks = await Visit.createQueryBuilder('visit')
      .leftJoin('visit.link', 'link')
      .where('link.userId = :userId', { userId })
      .getCount();

    return res.json({ total_links, active_links, expired_links, total_clicks });
  },

  async top(req: Request, res: Response) {
    const userId = (req as any).userId;

    const rows = await Link.createQueryBuilder('link')
      .leftJoin('link.visits', 'visit')
      .addSelect('COUNT(visit.id)', 'visit_count')
      .where('link.userId = :userId', { userId })
      .groupBy('link.id')
      .orderBy('visit_count', 'DESC')
      .limit(10)
      .getRawAndEntities();

    return res.json({ top: rows.entities });
  },
};
