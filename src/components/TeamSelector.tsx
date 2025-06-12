import { useState, useEffect } from 'react';
import { Modal, Checkbox, Button } from 'rsuite';
// import { useDispatch } from 'react-redux';
// import { setSelectedTeams } from '../store/slices/teamSlice';

const TeamSelector = ({
  data,
  onConfirm,
}: {
  data: any;
  onConfirm: (ids: number[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem('selectedTeamIds');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setSelectedIds(parsed);
      }
    }
  }, []);
  // const dispatch = useDispatch(); 
  const handleChange = (value: number, checked: boolean) => {
    setTempSelectedIds((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleOpen = () => {
    setTempSelectedIds(selectedIds); 
    setOpen(true);
  };

  const handleConfirm = () => {
    setSelectedIds(tempSelectedIds);
    onConfirm(tempSelectedIds);

    localStorage.setItem('selectedTeamIds', JSON.stringify(tempSelectedIds));

    // dispatch(setSelectedTeams(tempSelectedIds));

    setOpen(false);
  };

  const handleCancel = () => {
    setTempSelectedIds([]); 
    setOpen(false);
  };

  const teams = data || [];

  return (
    <>
      <Button onClick={handleOpen}>Select Teams</Button>

      <Modal open={open} onClose={handleCancel}>
        <Modal.Header>
          <Modal.Title>Select Teams</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {teams.map((team: any) => (
            <div key={team.id}>
              <Checkbox
                value={team.id}
                onChange={(_, checked) => handleChange(team.id, checked)}
                checked={tempSelectedIds.includes(team.id)}
              >
                {team.name}
              </Checkbox>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={handleConfirm}>
            Confirm
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TeamSelector;
