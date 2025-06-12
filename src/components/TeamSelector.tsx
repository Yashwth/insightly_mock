import { CheckPicker, Button, Checkbox } from 'rsuite';
import { useEffect, useState } from 'react';

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
  const allTeamIds = teamOptions.map((t) => t.value);
  const isAllSelected = selectedIds.length === allTeamIds.length;
    const handleConfirm = () => {
    if(selectedIds.length === 0){
      alert('Please select at least one team');
      return;
    }
    localStorage.setItem('selectedTeamIds', JSON.stringify(selectedIds));
    onConfirm(selectedIds);
  };

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      
      <CheckPicker
        value={selectedIds}
        data={teamOptions}
        onChange={(val) => setSelectedIds(val)}
        placeholder="Select Teams"
        style={{ width: 224 }}
        renderExtraFooter={() => (
          <div style={{fontSize: '15px', fontWeight: 'bold'}}>
            <Checkbox
              checked={isAllSelected}
              onChange={(value, checked) =>
                setSelectedIds(checked ? allTeamIds : [])
              }
            >
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </Checkbox>
          </div>
        )}
      />
      <Button appearance="primary" onClick={handleConfirm}>
        Confirm
      </Button>
    </div>
  );
};

export default TeamSelector;
