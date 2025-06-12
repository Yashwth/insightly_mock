export const getCycleTime = (cycleTime: number) => {
  if (!cycleTime || isNaN(cycleTime) || typeof cycleTime !== 'number') {
    return '0m'; // Return a default value or handle the error as needed
  }
  cycleTime = parseFloat(cycleTime?.toFixed(2)) || 0;
  if (!cycleTime) return '0m';
  if (cycleTime < 60) return Math.floor(cycleTime) + 'm';
  if (cycleTime < 1440){
    let mins = Math.floor(cycleTime % 60);
    if(mins) {
      return `${Math.floor(cycleTime / 60)}h ${mins}m`;
    }
    return `${Math.floor(cycleTime / 60)}h`;
  }
  let ctStringArr: Array<string | number> = ((cycleTime / 1440).toFixed(2)).split('.');
  let hrs = Math.round((parseFloat(ctStringArr[1] as string) * 24) / 100);
  if(hrs > 23) {
    ctStringArr[0] = parseInt(ctStringArr[0] as string) + Math.round(hrs/24);
    hrs = hrs%24;
  }
  ctStringArr[0] += 'd';
  if(hrs) {
    ctStringArr[1] = hrs + 'h';
  } else {
    ctStringArr[1] = '';
  }
  return ctStringArr.join(' ');
}

export const getTimeInHours = (time: number): number => {
  time = parseFloat(time.toFixed(2));
  if (!time) return 0;
  return Math.round(time / 60);
}

export const getFrequencyPercentageString = (value: number, noOfDays: number): string => {
  if(!noOfDays) return ''
  
  const perc = value/noOfDays;
  if(perc > 0.8) {
    return 'daily'
  }
  if(perc >= 0.25 && perc < 0.8) {
    return 'weekly'
  }
  if(perc >= 0.1 && perc < 0.25) {
    return 'monthly'
  }

  return ''
}