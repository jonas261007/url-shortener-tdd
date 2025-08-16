import { Request, Response } from 'express';
import { Link } from '../entities/Link';
import { Visit } from '../entities/Visit';

export const DashboardController = {
  render(_req: Request, res: Response) {
    return res.send('<h1>Dashboard</h1>');
  },

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

    const topLinks = await Link.createQueryBuilder('link')
      .leftJoin('link.visits', 'visit')
      .where('link.userId = :userId', { userId })
      .orderBy('COUNT(visit.id)', 'DESC')
      .groupBy('link.id')
      .limit(10)
      .getMany();

    return res.json({ top: topLinks });
  },
};
