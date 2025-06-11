import {
    Container,
    Header,
    Sidebar,
    Sidenav,
    Content,
    Nav,
    Breadcrumb,
    IconButton,
    HStack,
    Stack,
    Text
} from 'rsuite';
import { Icon } from '@rsuite/icons';
import { FaReact } from 'react-icons/fa';
import {
    MdDashboard,
    MdGroup,
    MdSettings,
    MdKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
 
} from 'react-icons/md';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/RootState';
import { useNavigate } from 'react-router-dom';
import {Outlet} from 'react-router-dom';
import WhisperComponent from '../components/Whisper';

const Dashboard = () => {
    const [expand, setExpand] = useState(true);

    const user = useSelector((state: RootState) => state.auth.user);
    console.log("theta",user);
    const navigate = useNavigate();
    return (
        <div className="w-screen h-screen flex overflow-hidden">
            <Container>
                <Sidebar
                    className="p-2 h-full flex flex-col"
                    width={expand ? 260 : 56}
                    collapsible
                >
                    <Sidenav.Header className='p-2'>
                        <Brand expand={expand} />
                    </Sidenav.Header>
                    <div className='flex-1 overflow-auto'>
                        <Sidenav expanded={expand} defaultOpenKeys={['1']} appearance="subtle">
                            <Sidenav.Body>
                                <Nav defaultActiveKey="1">
                                    <Nav.Menu
                                        eventKey="1"
                                        trigger="hover"
                                        title="Overview"
                                        icon={<Icon as={MdDashboard} />}
                                    >
                                        <Nav.Item eventKey="1-1" onClick={()=> navigate('/dashboard/org-goals')}>Overview</Nav.Item>
                                        <Nav.Item eventKey="1-2">Dashboard</Nav.Item>
                                        <Nav.Item eventKey="1-3">Dashboard</Nav.Item>
                                        <Nav.Item eventKey="1-4">Dashboard</Nav.Item>
                                        <Nav.Item eventKey="1-5">Dashboard</Nav.Item>
                                    </Nav.Menu>
                                    <Nav.Menu
                                        eventKey="2"
                                        trigger="hover"
                                        title="User Group"
                                        icon={<Icon as={MdGroup} />}
                                    >
                                        <Nav.Item eventKey="2-1">Coding</Nav.Item>
                                        <Nav.Item eventKey="2-2">Dashboard</Nav.Item>
                                        <Nav.Item eventKey="2-3">Dashboard</Nav.Item>
                                        <Nav.Item eventKey="2-4">Dashboard</Nav.Item>
                                        <Nav.Item eventKey="2-5">Dashboard</Nav.Item>
                                    </Nav.Menu>
                                        {/* <Nav.Menu
                                        eventKey="3"
                                        trigger="hover"
                                        title="Advanced"
                                        icon={<Icon as={MdOutlineStackedBarChart} />}
                                        placement="rightStart"
                                    >
                                        <Nav.Item eventKey="3-1">Geo</Nav.Item>
                                        <Nav.Item eventKey="3-2">Devices</Nav.Item>
                                        <Nav.Item eventKey="3-3">Brand</Nav.Item>
                                        <Nav.Item eventKey="3-4">Loyalty</Nav.Item>
                                        <Nav.Item eventKey="3-5">Visit Depth</Nav.Item>
                                    </Nav.Menu> */}
                                    <Nav.Menu
                                        eventKey="4"
                                        trigger="hover"
                                        title="Settings"
                                        icon={<Icon as={MdSettings} />}
                                        placement="rightStart"
                                    >
                                        <Nav.Item eventKey="4-1">Applications</Nav.Item>
                                        <Nav.Item eventKey="4-2">Websites</Nav.Item>
                                        <Nav.Item eventKey="4-3">Channels</Nav.Item>
                                        <Nav.Item eventKey="4-4">Tags</Nav.Item>
                                        <Nav.Item eventKey="4-5">Versions</Nav.Item>
                                    </Nav.Menu>


                                </Nav>



                            </Sidenav.Body>
                        </Sidenav>
                    </div>

                    <div className="p-4 border-t border-gray-700">
                        {expand ? (
                            <WhisperComponent user={user} />
                        ) : (
                            <WhisperComponent user={user} />
                        )}

                        <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
                    </div>
                </Sidebar>

                <Container className="w-full h-full">
                    <Header className="page-header">
                        <Breadcrumb>
                            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                            <Breadcrumb.Item href="##">Dashboard</Breadcrumb.Item>
                            <Breadcrumb.Item active>Overview</Breadcrumb.Item>
                        </Breadcrumb>
                    </Header>
                    <Content>  <Outlet /></Content>
                </Container>

            </Container>
        </div>
    );
};

const NavToggle = ({ expand, onChange }: { expand: boolean; onChange: () => void }) => {
    return (
        <Stack className="nav-toggle" justifyContent={expand ? 'flex-end' : 'center'}>
            <IconButton
                onClick={onChange}
                appearance="subtle"
                size="lg"
                icon={expand ? <MdKeyboardArrowLeft /> : <MdOutlineKeyboardArrowRight />}
            />
        </Stack>
    );
};

const Brand = ({ expand }: { expand: boolean }) => {
    return (
        <HStack className="page-brand" spacing={12}>
            <FaReact size={26} />
            {expand && <Text>Insightly</Text>}
        </HStack>
    );
};

export default Dashboard;