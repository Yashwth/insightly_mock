import { Whisper, Button, ButtonToolbar } from 'rsuite';
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import MediaQuery from './MediaQuery';

const Overlay = React.forwardRef(({ style, onClose,user, ...rest }: any, ref: any) => {
  const styles = {
    ...style,
    color: '#000',
    background: '#fff',
    width: 200,
    padding: 10,
    borderRadius: 4,
    position: 'absolute',
    border: '1px solid #ddd',
    boxShadow: '0 3px 6px -2px rgba(0, 0, 0, 0.6)'
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("user",user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  }

  return (
    <div {...rest} style={styles} ref={ref}>
      <MediaQuery user={user} />
      <hr />
      <Button onClick={handleLogout}>Logout</Button>      
    </div>
  );
});

const WhisperComponent = ({user}: {user:any}) => (
  <ButtonToolbar>
    <Whisper
      trigger="click"
      speaker={(props, ref) => {
        const { className, left, top, onClose } = props;
        return <Overlay user={user} style={{ left, top }} onClose={onClose} className={className} ref={ref} />;
      }}
    >
      <Button>Open</Button>
    </Whisper>

   
  </ButtonToolbar>
);

export default WhisperComponent;

