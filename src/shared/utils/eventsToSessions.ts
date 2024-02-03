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
    endTime?: number;
  }>;
};

export const eventsToSessions = (events: Array<VisitorEvent>) => {
  events.sort(
    (eventA, eventB) =>
      eventA.visitorId.localeCompare(eventB.visitorId) ||
      eventA.timestamp - eventB.timestamp,
  );

  const sessionsByUser = events.reduce((session: VisitorSession, event) => {
    const { visitorId, url, timestamp } = event;

    session[visitorId] = session[visitorId] || [];

    const visitorSessions = session[visitorId];
    const lastSession = visitorSessions[visitorSessions.length - 1];
    const timeout = 10 * 60 * 1000;

    if (lastSession && timestamp - (lastSession.endTime as number) <= timeout) {
      lastSession.pages.push(url);
      lastSession.endTime = timestamp;
      lastSession.duration = lastSession.endTime - lastSession.startTime;
    } else {
      visitorSessions.push({
        duration: 0,
        pages: [url],
        startTime: timestamp,
        endTime: timestamp,
      });
    }

    return session;
  }, {});

  Object.keys(sessionsByUser).forEach((visitorId) => {
    sessionsByUser[visitorId] = sessionsByUser[visitorId].map((session) => ({
      duration: session.duration,
      pages: session.pages,
      startTime: session.startTime,
    }));
  });

  return { sessionsByUser };
};
