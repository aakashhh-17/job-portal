import Job from '../models/Job.js';
import JobSyncState from '../models/jobSyncState.js';
import { fetchAdzunaJobs, normalizeAdzunaJob } from '../services/adzunaService.js';

const SOURCE = 'adzuna';
const MAX_PAGES_PER_RUN = 5; // guardrail against burning free-tier quota in one run

export const syncAdzunaJobs = async (req, res) => {
  try {
    const syncState = await JobSyncState.findOne({ source: SOURCE });
    const lastFetchedAt = syncState?.lastFetchedAt;

    let fetched = 0, created = 0, updated = 0;
    let page = 1;
    let keepGoing = true;

    while (keepGoing && page <= MAX_PAGES_PER_RUN) {
      const { results } = await fetchAdzunaJobs({ country: 'in', page, resultsPerPage: 50 });
      if (!results?.length) break;

      for (const rawJob of results) {
        fetched++;
        const createdAt = new Date(rawJob.created);

        // Results are sorted by date desc — once we hit jobs older than our
        // last sync, everything after this is stuff we've already ingested.
        if (lastFetchedAt && createdAt <= lastFetchedAt) {
          keepGoing = false;
          break;
        }

        const normalized = normalizeAdzunaJob(rawJob);
        const result = await Job.findOneAndUpdate(
          { source: SOURCE, externalId: normalized.externalId },
          { $set: normalized },
          { upsert: true, new: true, rawResult: true }
        );

        result.lastErrorObject?.updatedExisting ? updated++ : created++;
      }
      page++;
    }

    await JobSyncState.findOneAndUpdate(
      { source: SOURCE },
      { lastFetchedAt: new Date(), lastRunStats: { fetched, created, updated, ranAt: new Date() } },
      { upsert: true }
    );

    return res.json({ success: true, fetched, created, updated });
  } catch (error) {
    console.error('Adzuna sync failed:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};