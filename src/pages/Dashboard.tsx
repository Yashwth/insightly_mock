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
    MdOutlineStackedBarChart,
    MdKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
    MdLogout,
    MdPerson
} from 'react-icons/md';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/Store';


const Dashboard = () => {
    const [expand, setExpand] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(clearUser());
        navigate('/login');
    }
    const user = useSelector((state: RootState) => state.user);
    console.log(user);
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
                        <Sidenav expanded={expand} defaultOpenKeys={['3']} appearance="subtle">
                            <Sidenav.Body>
                                <Nav defaultActiveKey="1">
                                    <Nav.Menu
                                        eventKey="1"
                                        trigger="hover"
                                        title="Overview"
                                        icon={<Icon as={MdDashboard} />}
                                    >
                                        <Nav.Item eventKey="1-1">Dashboard</Nav.Item>
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
                                        <Nav.Item eventKey="2-1">Dashboard</Nav.Item>
                                        <Nav.Item eventKey="2-2">Dashboard</Nav.Item>
                                        <Nav.Item eventKey="2-3">Dashboard</Nav.Item>
                                        <Nav.Item eventKey="2-4">Dashboard</Nav.Item>
                                        <Nav.Item eventKey="2-5">Dashboard</Nav.Item>
                                    </Nav.Menu>
                                    <Nav.Menu
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
                                    </Nav.Menu>
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
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm flex items-center justify-center gap-2"
                            >
                                <MdLogout />
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="w-10 h-10 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full mx-auto"
                                title="Logout"
                            >
                                <MdPerson size={40} />
                            </button>
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
                    <Content>Content</Content>
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