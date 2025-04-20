'use client'

import { TabItem, Tabs } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { HiChartBar, HiCalendar } from "react-icons/hi";
import { MdSportsCricket } from "react-icons/md";
import { useRouter } from 'next/navigation'
import MatchCard from './components/MatchCard/MatchCard';
import Loader from './components/Loader/Loader';


interface MatchDetailsProps {
  liveMatch: Array<any>,
  upcomingMatch: any
}

const NoLiveMatchPlaceHolder = () => {
  return (
    <div className='p-4 m-4 flex flex-col justify-center items-center'>
      <MdSportsCricket className='w-25 h-25 mb-10 text-gray-400' />
      <div className='text-3xl text-gray-400'>
        No live match for now
      </div>
    </div>
  );
}


export default function Home() {
  const [data, setData] = useState([]);
  const [upcomingMatch, setUpcomingMatch] = useState<any>({});
  const [liveMatch, setLiveMatch] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleConnect = () => {
    console.log('Socket connected!');
  }

  const handleDisconnect = (msg: any) => {
    console.log('Socket disconnected');
  }

  const handleLiveMatch = (msg: any) => {
    // take the data and set in the live match details
    console.log(msg);
  }


  useEffect(() => {
    const fetchUpcomingMatchDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/upcoming`);
        const matchData = await response.json();
        setUpcomingMatch(matchData['data']);
      } catch (err) {
        console.log('Error occured');
        console.log(err);
        setUpcomingMatch({});
      }
    }

    const fetchLiveMatchDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/live-matches`);
        const matchData = await response.json();
        setLiveMatch(matchData);
        setLoading(false);
      } catch (error) {
        console.log('Error occured');
        console.log(error);
        setLiveMatch([]);
      }
    }

    fetchUpcomingMatchDetails()
      .catch(err => {
        console.log(err);
      })
      .then(() => {
        return fetchLiveMatchDetails();
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {
        loading ? <Loader />
          :
          <Tabs aria-label="Default tabs" variant="fullWidth">
            <TabItem active title="Live" icon={HiChartBar}>
              <div>
                {
                  liveMatch.length > 0 ?
                  liveMatch.map((m: any) => {
                    return <MatchCard
                      {...m}
                      date={new Date(m.MATCH_COMMENCE_START_DATE)}
                      key={m.MatchID}
                      handleClick={e => {
                        e.preventDefault();
                        router.push(`/${m.MatchID}`)
                      }}
                      actionText='Go to commentary'
                    />
                  })
                  :
                  <NoLiveMatchPlaceHolder />
                }
              </div>
            </TabItem>
            <TabItem title="Upcoming" icon={HiCalendar}>
              <MatchCard
                {...upcomingMatch}
                date={new Date(upcomingMatch.MATCH_COMMENCE_START_DATE)}
                handleClick={(e) => {
                  e.preventDefault();
                  window.location.href = upcomingMatch.FBURL
                }}
                actionText="Book Tickets"
              />
            </TabItem>
          </Tabs>
      }
    </>


  )
}
