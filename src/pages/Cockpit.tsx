
import { useEffect } from "react";
import { useGetMetricGraphDataMutation } from "../api/dashboardApi";
import { useSelector } from "react-redux";
import { RootState } from "../store/RootState";
import NewWorkCard from "../components/NewWorkCard";
import { useGetTemplatesQuery } from "../api/templates";
import { Header, Tooltip } from 'rsuite';
import UserInfoIcon from '@rsuite/icons/UserInfo';
import {  Whisper } from 'rsuite';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SendToDashboardIcon from '@rsuite/icons/SendToDashboard';
import { setTemplatesData } from '../store/slices/cockpit';


export default function Cockpit() {
//   const [getMetricGraphData, { data, error, isLoading }] = useGetMetricGraphDataMutation();

  const user = useSelector((state: RootState) => state.auth.user);
  const token = user.user.authToken;
  const userId = user.user.id;
  const accessToken = user.accessToken;
  const { data: templatesData, error: templatesError, isLoading: templatesLoading } = useGetTemplatesQuery();
  const dispatch = useDispatch();


  const startDate = 1747180800;
  const endDate = 1749686400;
  const orgId = 1960;

  useEffect(() => {
    dispatch(setTemplatesData(templatesData));
    localStorage.setItem('templatesData', JSON.stringify(templatesData));
  }, [templatesData]);

  return (
    <div className="space-y-4 ">
    <Header>
        <h3>Cockpit</h3>
    </Header>
    <hr />
      {templatesData?.map((t) => (
          <Link to={`/dashboard/template/${t.id}`} key={t.id} className="block">

        <div
          key={t.id}
          className="flex items-center justify-between bg-white border rounded-lg p-4 shadow-sm hover:scale-101 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="text-purple-600 bg-purple-100 p-2 rounded-md">
              <SendToDashboardIcon />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{t.templateName}</span>
              <span className="text-xs text-white bg-cyan-500 rounded-full px-2 py-0.5 w-fit mt-1">
                Template
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mx-4">
            {t.metricsList.slice(0, 2).map((m) => (
              <span
                key={m.id}
                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-md"
              >
                {m.metricName}
              </span>
            ))}
            {t.metricsList.length > 2 && (
              <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-md">
               
                <Whisper
                    trigger="hover"
                    placement="top"
                    speaker={<Tooltip style={{ backgroundColor: '#e5e7eb', color: '#111827' }}>
                    <div className="flex flex-col gap-1">
                      {t.metricsList.slice(2).map((m) => (
                        <span
                          key={m.id}
                          className="bg-gray-2  00 text-gray-700 text-sm px-3 py-1 rounded-md"
                        >
                          {m.metricName}
                        </span>
                      ))}
                    </div>
                  </Tooltip>
                  }
                    >
                    +{t.metricsList.length - 2}
                    </Whisper>
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
          <Whisper
            trigger="hover"
            placement="top"
            speaker={<Tooltip>Created by Hivel</Tooltip>}
            >
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold flex items-center justify-center cursor-pointer">
                <UserInfoIcon />
            </div>
            </Whisper>
                    
          </div>
        </div>
      </Link>
      ))}
    </div>
  );
}


