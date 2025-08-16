import { Request, Response } from 'express';
import { Link } from '../entities/Link';
import { Visit } from '../entities/Visit';

export const MetricsController = {
  async summary(req: Request, res: Response) {
    const period = req.query.period as string || 'all';

    // Aqui você pode filtrar por período (today/7d/30d/all)
    const total_links = await Link.count();
    const active_links = await Link.count({ where: { status: 'active' } });
    const expired_links = await Link.count({ where: { status: 'expired' } });
    const total_clicks = await Visit.count();

    return res.json({ total_links, active_links, expired_links, total_clicks });
  },

  async top(req: Request, res: Response) {
    const period = req.query.period as string || 'all';

    const topLinks = await Link.createQueryBuilder('link')
      .leftJoin('link.visits', 'visit')
      .orderBy('COUNT(visit.id)', 'DESC')
      .groupBy('link.id')
      .limit(10)
      .getMany();

    return res.json({ top: topLinks });
  },
};
