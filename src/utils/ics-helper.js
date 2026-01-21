export const exportICS = (events) => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//日历//CN\n";

    events.forEach(evt => {
        if (!evt.date || !evt.time) return; // Skip events without date or time
        
        // Format date and time correctly for ICS
        const start = evt.date.replace(/-/g, '') + 'T' + evt.time.replace(/:/g, '') + '00';
        
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `UID:${evt.id || Date.now() + Math.random()}\n`;
        icsContent += `DTSTART:${start}\n`;
        icsContent += `SUMMARY:${evt.title || '无标题'}\n`;
        icsContent += `DESCRIPTION:${evt.description || ''}\n`;
        icsContent += "END:VEVENT\n";
    });

    icsContent += "END:VCALENDAR";

    // Handle blob creation and download
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calendar_export.ics';
    document.body.appendChild(a); // Add to DOM to ensure it works in all browsers
    a.click();
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url);
};

export const parseICS = (content) => {
    const lines = content.split(/\r\n|\n|\r/);
    let currentEvent = null;
    let parsedEvents = [];

    lines.forEach(line => {
        line = line.trim(); // Trim whitespace
        
        if (line.startsWith('BEGIN:VEVENT')) {
            currentEvent = {};
        } else if (line.startsWith('END:VEVENT')) {
            if (currentEvent && currentEvent.title && currentEvent.start) {
                // Parse DTSTART (expected format: YYYYMMDDTHHmmss or YYYYMMDDTHHmmssZ)
                const dtstart = currentEvent.start;
                
                // Extract date part
                const y = dtstart.substring(0, 4);
                const m = dtstart.substring(4, 6);
                const d = dtstart.substring(6, 8);
                
                // Extract time part
                let h = '09';
                let min = '00';
                if (dtstart.length >= 13) {
                    h = dtstart.substring(9, 11);
                    min = dtstart.substring(11, 13);
                }

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
            if (line.startsWith('SUMMARY:')) {
                currentEvent.title = line.substring(8);
            } else if (line.startsWith('DTSTART:')) {
                currentEvent.start = line.substring(8);
            } else if (line.startsWith('DESCRIPTION:')) {
                currentEvent.desc = line.substring(12);
            }
        }
    });
    return parsedEvents;
};
