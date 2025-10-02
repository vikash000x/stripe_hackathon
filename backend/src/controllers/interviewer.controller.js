// src/controllers/interviewer.controller.js
import { prisma } from '../config/db.js';

/**
 * GET /api/interviewer/dashboard
 * Query params: ?search=&sort=score_desc|score_asc
 */
export async function getDashboard(req, res) {
  try {
    const { search = '', sort = 'score_desc' } = req.query;
    const order = sort === 'score_asc' ? { totalScore: 'asc' } : { totalScore: 'desc' };

    // join Assessment + User
    const where = search ? {
      OR: [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ]
    } : {};

    const list = await prisma.assessment.findMany({
      where,
      orderBy: order,
      include: { user: true }
    });

    // map to lightweight results
    const result = list.map(a => ({
      assessmentId: a.id,
      userId: a.userId,
      name: a.user?.name,
      email: a.user?.email,
      resumeUrl: a.user?.resumeUrl,
      totalScore: a.totalScore,
      aiSummary: a.aiSummary,
      updatedAt: a.updatedAt
    }));

    res.json({ data: result });
  } catch (err) {
    console.error('getDashboard', err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/interviewer/candidate/:userId
 * returns full assessment + user info
 */
export async function getCandidateDetail(req, res) {
  try {
    const { userId } = req.params;
// console.log("UserID:", userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { assessment: true }
    });

    // console.log("User:", user);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Assuming a single assessment per user for this MVP, return the latest assessment
   const assessment = user.assessment || null;
  // console.log("Assessment:", assessment);
    res.json({ user, assessment });
  } catch (err) {
    console.error('getCandidateDetail', err);
    res.status(500).json({ error: err.message });
  }
}
