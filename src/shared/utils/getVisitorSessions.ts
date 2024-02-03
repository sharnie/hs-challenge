export type VisitorEvent = {
  visitorId: string;
  url: string;
  timestamp: number;
};

export type VisitorSession = {
  [visitorId: string]: Array<{
    duration: number;
    pages: Array<string>;
    startTime: number;
    timestamp?: number;
  }>;
};

export const getVisitorSessions = (events: Array<VisitorEvent>) => {
  /**
   * Get chronological sessions for each visitor
   */
  events.sort((eventA, eventB) => {
    if (eventA.visitorId < eventB.visitorId) return -1;
    if (eventA.visitorId > eventB.visitorId) return 1;
    return eventA.timestamp - eventB.timestamp;
  });

  const sessionsByUser = events.reduce((output: VisitorSession, event) => {
    const { visitorId, url, timestamp } = event;

    output[visitorId] = output[visitorId] || [];

    const visitorSessions = output[visitorId];
    const visitorLastSession = visitorSessions[visitorSessions.length - 1];
    const timeout = 10 * 60 * 1000; // 10 minutes in milliseconds

    /**
     * Check if last session is still active, if not create a new session
     */
    const isCurrentSession =
      visitorLastSession &&
      typeof visitorLastSession.timestamp !== 'undefined' &&
      timestamp - visitorLastSession.timestamp <= timeout;

    if (isCurrentSession) {
      visitorLastSession.pages.push(url);
      visitorLastSession.timestamp = timestamp;
      visitorLastSession.duration =
        visitorLastSession.timestamp - visitorLastSession.startTime;
    } else {
      /**
       * Create a new session, set duration to 0 and add the current page as the first page
       */
      visitorSessions.push({
        duration: 0,
        pages: [url],
        startTime: timestamp,
        timestamp: timestamp,
      });
    }

    return output;
  }, {});

  /**
   * Return sessions by chronological order
   */
  Object.keys(sessionsByUser).forEach((visitorId) => {
    sessionsByUser[visitorId] = sessionsByUser[visitorId].map((session) => ({
      duration: session.duration,
      pages: session.pages,
      startTime: session.startTime,
    }));
  });

  return { sessionsByUser };
};
