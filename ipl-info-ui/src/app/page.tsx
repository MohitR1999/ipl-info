'use client'

import { TabItem, Tabs, Card, Button } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { HiAdjustments, HiClipboardList, HiUserCircle, HiChartBar, HiCalendar } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";

interface MatchDetailsProps {
  liveMatch: {
    message: string;
  },
  upcomingMatch: any
}

const MatchDetails = (props: MatchDetailsProps) => {
  return (
    <div>
      <Tabs aria-label="Default tabs" variant="fullWidth">
        <TabItem title="Live Match" icon={HiChartBar}>
          {props.liveMatch.message}
        </TabItem>
        <TabItem active title="Upcoming Match" icon={HiCalendar}>
          <div className='flex p-5'>
            <Card className="flex-1">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Noteworthy technology acquisitions 2021
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
              </p>
              <Button>
                Read more
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
    const fetchMatch = async () => {
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/match`);
      const matchData = await response.json();
      if (matchData['message'].includes("No live match found")) {
        setUpcomingMatch(matchData['data']);
        setLiveMatch({
          message: "No match is currently live. Stay tuned for update"
        })
      }
      setLoading(false);
    }

    fetchMatch()
      .catch(err => {
        console.log(err);
        setLoading(false);
        setData([]);
        setUpcomingMatch(false);
      })
      ;
  }, []);


  return (
    <div>
      <MatchDetails
        liveMatch={liveMatch}
        upcomingMatch={upcomingMatch}
      />
    </div>
  );
}
