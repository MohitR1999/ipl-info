'use client'

import { TabItem, Tabs, Card, Button } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { HiChartBar, HiCalendar, HiClock, HiLocationMarker } from "react-icons/hi";
import { MdDashboard, MdSportsCricket } from "react-icons/md";
import Image from "next/image";
import UpcomingMatch from './components/UpcomingMatch/UpcomingMatch';
import { socket } from './utils/socket';


interface MatchDetailsProps {
  liveMatch: Array<any>,
  upcomingMatch: any
}

const NoLiveMatchPlaceHolder = () => {
  return (
    <div className='p-4 m-4 flex flex-col justify-center items-center'>
      <MdSportsCricket className='w-25 h-25 mb-10 text-gray-400'/>
      <div className='text-3xl text-gray-400'>
        No live match for now
      </div>
    </div>
  );
}

const MatchDetails = (props: MatchDetailsProps) => {
  const date = new Date(props.upcomingMatch.MATCH_COMMENCE_START_DATE);
  const isMatchLive = props.liveMatch.length > 0;

  return (
    <div>
      <Tabs aria-label="Default tabs" variant="fullWidth">
        <TabItem active title="Live Match" icon={HiChartBar}>
          {
            isMatchLive ? <div>Live Match details</div> : <NoLiveMatchPlaceHolder />
          }
        </TabItem>
        <TabItem  title="Upcoming Match" icon={HiCalendar}>
          <UpcomingMatch
            upcomingMatch={props.upcomingMatch}
            date={date} />
        </TabItem>
      </Tabs>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState([]);
  const [upcomingMatch, setUpcomingMatch] = useState({});
  const [liveMatch, setLiveMatch] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleConnect = () => {
    console.log('Socket connected!');
  }

  const handleDisconnect = (msg : any) => {
    console.log('Socket disconnected');
  }

  const handleLiveMatch = (msg : any) => {
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/live`);
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
    .catch (err => {
      console.log(err);
    })
    .then (() => {
     return fetchLiveMatchDetails();
    })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    socket.connect();
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('live-match-update', handleLiveMatch);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('live-match-update', handleLiveMatch);
      socket.disconnect();
    }
  }, []);


  return (
    loading ? <div>Loading...</div>
      :
      <MatchDetails
        liveMatch={liveMatch}
        upcomingMatch={upcomingMatch} />
  )
}
