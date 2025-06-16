import { DateRangePicker } from 'rsuite';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

type DateRange = [Date, Date];

const getDefaultDateRange = (): DateRange => {
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  return [lastWeek, today];
};

const DurationSelector = ({
  onChange,
}: {
  onChange: (range: { startDate: number; endDate: number }) => void;
}) => {
  const stored = localStorage.getItem('duration');
  const defaultRange = getDefaultDateRange();

  const [value, setValue] = useState<DateRange | null>(
    stored
      ? [
          new Date(JSON.parse(stored).startDate * 1000),
          new Date(JSON.parse(stored).endDate * 1000),
        ]
      : defaultRange
  );

  useEffect(() => {
    if (value) {
      const startEpoch = Math.floor(value[0].getTime() / 1000);
      const endEpoch = Math.floor(value[1].getTime() / 1000);

      localStorage.setItem(
        'duration',
        JSON.stringify({ startDate: startEpoch, endDate: endEpoch })
      );
      onChange({ startDate: startEpoch, endDate: endEpoch });
    }
  }, [value]);

  return (
    <DateRangePicker
      value={value}
      onChange={setValue}
      placeholder="Select Duration"
      renderValue={(value, formatStr) => {
        if (!value || value.length !== 2) return 'Select Duration';
        const [start, end] = value;
        return `${format(start, 'd MMM')} - ${format(end, 'd MMM')}`;
      }}
    />
  );
};

export default DurationSelector;
