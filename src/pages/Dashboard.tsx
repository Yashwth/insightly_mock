import {
    Container,
    Sidebar,
    Sidenav,
    Content,
    Nav,
    IconButton,
    HStack,
    Stack,
    Text
} from 'rsuite';
import { Icon } from '@rsuite/icons';
import Logo from '../assets/logo-primary-collapsed.svg';
import {
    MdDashboard,
    MdGroup,
    MdKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight
} from 'react-icons/md';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/RootState';
import {  Outlet } from 'react-router-dom';
import WhisperComponent from '../components/Whisper';
import { useNavigate } from 'react-router-dom';



const Dashboard = () => {
    const navigate = useNavigate();
    const [expand, setExpand] = useState(true);
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <div className="w-screen h-screen flex bg-gray-100">
            <Container>
                <Sidebar
                    className={`h-full transition-all duration-300 bg-white shadow-lg border-r border-gray-200`}
                    width={expand ? 240 : 64}
                    collapsible
                >
                    <Sidenav.Header className="py-4 px-3 border-b border-gray-200">
                        <Brand expand={expand} />
                    </Sidenav.Header>

                    <div className="flex-1 overflow px-1">
                        <Sidenav expanded={expand} defaultOpenKeys={['1']} appearance="subtle">
                            <Sidenav.Body>
                                <Nav defaultActiveKey="1">
                                    <Nav.Menu
                                        eventKey="1"
                                        title="Overview"
                                        icon={<Icon as={MdDashboard} />}
                                    >
                                        <Nav.Item eventKey="1-1" onClick={() => navigate('/dashboard/org-goals')}>
                                            Goals
                                        </Nav.Item>
                                    </Nav.Menu>

                                    <Nav.Menu
                                        eventKey="2"
                                        title="Cockpit"
                                        icon={<Icon as={MdGroup} />}
                                    >
                                        <Nav.Item eventKey="2-1" onClick={() => navigate('/dashboard/cockpit')}>
                                            All Boards
                                        </Nav.Item>                                   
                                    </Nav.Menu>
                                    
                                </Nav>
                            </Sidenav.Body>
                        </Sidenav>
                    </div>

                    <div className="p-3 border-t border-gray-200 flex flex-col gap-2">
                        <WhisperComponent user={user} expand={expand} />
                        <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
                    </div>
                </Sidebar>

                <Container className="w-full h-full">
                    <Content className="p-5 bg-gray-50 h-full overflow-y-auto">
                        <Outlet />
                    </Content>
                </Container>
            </Container>
        </div>
    );
};

const NavToggle = ({ expand, onChange }: { expand: boolean; onChange: () => void }) => (
    <Stack justifyContent={expand ? 'flex-end' : 'center'}>
        <IconButton
            onClick={onChange}
            appearance="subtle"
            size="lg"
            icon={expand ? <MdKeyboardArrowLeft /> : <MdOutlineKeyboardArrowRight />}
        />
    </Stack>
);

const Brand = ({ expand }: { expand: boolean }) => (
    <HStack spacing={12} align="center" className="ml-1">
        <img src={Logo} alt="Insightly Logo" className={expand ? 'h-8 w-auto' : 'h-8 w-8 mx-auto'} />
        {expand && <Text className="text-lg font-semibold">Insightly</Text>}
    </HStack>
);

export default Dashboard;
