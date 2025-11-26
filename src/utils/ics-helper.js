export const exportICS = (events) => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//日历//CN\n";

    events.forEach(evt => {
        const start = evt.date.replace(/-/g, '') + 'T' + evt.time.replace(/:/g, '') + '00';
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `UID:${evt.id}\n`;
        icsContent += `DTSTART:${start}\n`;
        icsContent += `SUMMARY:${evt.title}\n`;
        icsContent += `DESCRIPTION:${evt.description || ''}\n`;
        icsContent += "END:VEVENT\n";
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calendar_export.ics';
    a.click();
    URL.revokeObjectURL(url);
};

export const parseICS = (content) => {
    const lines = content.split(/\r\n|\n|\r/);
    let currentEvent = null;
    let parsedEvents = [];

    lines.forEach(line => {
        if (line.startsWith('BEGIN:VEVENT')) {
            currentEvent = {};
        } else if (line.startsWith('END:VEVENT')) {
            if (currentEvent && currentEvent.title && currentEvent.start) {
                const y = currentEvent.start.substring(0,4);
                const m = currentEvent.start.substring(4,6);
                const d = currentEvent.start.substring(6,8);
                const h = currentEvent.start.substring(9,11) || '09';
                const min = currentEvent.start.substring(11,13) || '00';

                parsedEvents.push({
                    id: Date.now() + Math.random(),
                    title: currentEvent.title,
                    date: `${y}-${m}-${d}`,
                    time: `${h}:${min}`,
                    description: currentEvent.desc || '',
                    color: 'bg-purple-500'
                });
            }
            currentEvent = null;
        } else if (currentEvent) {
            if (line.startsWith('SUMMARY:')) currentEvent.title = line.substring(8);
            if (line.startsWith('DTSTART:')) currentEvent.start = line.substring(8);
            if (line.startsWith('DESCRIPTION:')) currentEvent.desc = line.substring(12);
        }
    });
    return parsedEvents;
};
