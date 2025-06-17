import { CheckPicker, Button, Checkbox } from 'rsuite';
import { useEffect, useRef, useState } from 'react';

const TeamSelector = ({
  data,
  onConfirm,
}: {
  data: any[];
  onConfirm: (ids: number[]) => void;
}) => {
  const teamOptions = data?.map((team) => ({
    label: team.name,
    value: team.id,
  })) || [];

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('selectedTeamIds');
    const defaultIds = stored
      ? JSON.parse(stored)
      : teamOptions.slice(0, 5).map((t) => t.value);

    setSelectedIds(defaultIds);
  }, [data]);
  const pickerRef = useRef<any>(null); 


  const allTeamIds = teamOptions.map((t) => t.value);
  const isAllSelected = selectedIds.length === allTeamIds.length;

  const handleConfirm = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one team');
      return;
    }
    localStorage.setItem('selectedTeamIds', JSON.stringify(selectedIds));
    onConfirm(selectedIds);
    if (pickerRef.current) {
      pickerRef.current.close(); 
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <CheckPicker
        ref={pickerRef}
        value={selectedIds}
        data={teamOptions}
        onChange={(val) => setSelectedIds(val)}
        placeholder="Select Teams"
        style={{ width: 250 }}
        renderValue={() => `Teams (${selectedIds.length})`}
        cleanable={false}
        searchable={false}
        renderMenu={(menu) => (
          <div style={{ padding: ' ', display: 'flex', flexDirection: 'column' }}>
            <Checkbox style={{ fontWeight: 'bold' }}
              checked={isAllSelected}
              onChange={(value, checked) =>
                setSelectedIds(checked ? allTeamIds : [])
              }
            >
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </Checkbox>
            
            {menu}
            <Button style={{ width: '50%', alignSelf: 'center' }} appearance="primary" block onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        )}
        
      />
    </div>
  );
};

export default TeamSelector;
