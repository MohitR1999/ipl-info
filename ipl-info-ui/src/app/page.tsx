'use client'

import { TabItem, Tabs, Card, Button } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { HiChartBar, HiCalendar, HiClock, HiLocationMarker } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import Image from "next/image";


interface MatchDetailsProps {
  liveMatch: {
    message: string;
  },
  upcomingMatch: any
}

const MatchDetails = (props: MatchDetailsProps) => {
  const date = new Date(props.upcomingMatch.MATCH_COMMENCE_START_DATE);

  return (
    <div>
      <Tabs aria-label="Default tabs" variant="fullWidth">
        <TabItem title="Live Match" icon={HiChartBar}>
          {props.liveMatch.message}
        </TabItem>
        <TabItem active title="Upcoming Match" icon={HiCalendar}>
          <div className='flex p-5 justify-center'>
            <Card className="flex-1 max-w-md w-full">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {props.upcomingMatch.MatchName}
              </h5>

              <div className='flex items-center'>
                <p className="text-gray-700 dark:text-gray-400">
                  {date.getHours() - 12}:{date.getMinutes()} pm IST
                </p>
              </div>

              <div className='flex justify-between items-center'>
                <div className='flex flex-col justify-between items-center'>
                  <Image
                    src={props.upcomingMatch.HomeTeamLogo}
                    width={150}
                    height={150}
                    alt={props.upcomingMatch.FirstBattingTeamName} />
                  <div className='text-gray-900 dark:text-gray-100'>
                    {props.upcomingMatch.FirstBattingTeamCode}
                  </div>
                </div>
                <h6 className="text-xl text-gray-900 dark:text-gray-400">
                  vs
                </h6>
                <div className='flex flex-col justify-between items-center'>
                  <Image
                    src={props.upcomingMatch.AwayTeamLogo}
                    width={150}
                    height={150}
                    alt={props.upcomingMatch.SecondBattingTeamName} />
                  <div className='text-gray-900 dark:text-gray-100'>
                    {props.upcomingMatch.SecondBattingTeamCode}
                  </div>
                </div>
              </div>
              <div className='flex justify-center items-center'>
                <p className="text-gray-700 dark:text-gray-400">
                  IPL {props.upcomingMatch.MatchOrder}
                </p>
              </div>

              <div className='flex items-center'>
                <HiLocationMarker className='mr-2 w-4 h-4' />
                <p className="text-gray-700 dark:text-gray-400">
                  {props.upcomingMatch.GroundName}
                </p>
              </div>

              <Button onClick={(e) => {
                e.preventDefault();
                window.location.href = props.upcomingMatch.FBURL
              }}>
                Buy Tickets
                <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>

            </Card>
          </div>

        </TabItem>
      </Tabs>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState([]);
  const [upcomingMatch, setUpcomingMatch] = useState({});
  const [liveMatch, setLiveMatch] = useState({ message: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingMatchDetails = async () => {
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/upcoming`);
      const matchData = await response.json();
      console.log(matchData);
      setUpcomingMatch(matchData['data']);
      setLoading(false);
    }

    const fetchLiveMatchDetails = async () => {

    }

    fetchUpcomingMatchDetails()
      .catch(err => {
        console.log(err);
        setLoading(false);
        setData([]);
        setUpcomingMatch(false);
      })
      ;
  }, []);


  return (
    loading ? <div>Loading...</div>
      :
      <MatchDetails
        liveMatch={liveMatch}
        upcomingMatch={upcomingMatch} />
  )
}
