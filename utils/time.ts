export const timeSince = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 30) return "justo ahora";

    const intervals: { [key: string]: number } = {
        'año': 31536000,
        'mes': 2592000,
        'día': 86400,
        'hora': 3600,
        'minuto': 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = seconds / secondsInUnit;
        if (interval >= 1) {
            const value = Math.floor(interval);
            const plural = value !== 1 ? 's' : '';
            if (unit === 'mes') {
                 return `hace ${value} ${unit}${value !== 1 ? 'es' : ''}`;
            }
            return `hace ${value} ${unit}${plural}`;
        }
    }
    
    return `hace ${Math.floor(seconds)} segundos`;
};
