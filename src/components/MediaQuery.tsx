import { useMediaQuery, Modal, Button, ButtonToolbar, Input } from 'rsuite';
import React from 'react';


const MediaQuery = ({user}: {user: any  }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
    console.log(user);
  const [isMobile] = useMediaQuery('(max-width: 700px)');


  return (
    <>
      <ButtonToolbar>
        <Button onClick={handleOpen}> Open</Button>
      </ButtonToolbar>

      <Modal open={open} onClose={handleClose} size={isMobile ? 'full' : 'md'}>
        <Modal.Header>
          <Modal.Title className='text-2xl font-bold text-center'>Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input value={user.user.accessRole} disabled />
          <br />
          <br />
          <br />
          <Input value={user.user.email} disabled />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Ok
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MediaQuery;