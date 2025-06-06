"use client";

import {
    Button,
    Timeline,
    TimelineBody,
    TimelineContent,
    TimelineItem,
    TimelinePoint,
    TimelineTime,
    TimelineTitle,
    Spinner,
    Card,
    Badge
} from "flowbite-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { HiArrowNarrowRight, HiCalendar, HiLocationMarker, HiTicket } from "react-icons/hi";

interface ScheduleItemProps {
    date: string,
    matchName: string,
    groundName: string,
    time: string,
    ticketsURL: string,
    status: string,
}

const ScheduleItem = ({
    date,
    matchName,
    groundName,
    time,
    ticketsURL,
    status
}: ScheduleItemProps) => {
    const size = 100;

    return (
        <TimelineItem>
            <TimelinePoint icon={HiCalendar} />
            <TimelineContent>
                <TimelineTime>{date}, {time} IST </TimelineTime>
                <TimelineTitle>{matchName} {status == 'Live' ? <span 
                style={{ 
                    color: "red", 
                    backgroundColor: "#fff", 
                    padding: '8px', 
                    borderRadius: '100px' 
                    }}>Live</span> : <></>}</TimelineTitle>
                <TimelineBody>
                    <div className="flex mt-1 items-center">
                        <HiLocationMarker className="mr-1 h-5 w-5" />
                        {groundName}
                    </div>
                </TimelineBody>
                <Button color="cyan" onClick={(e) => {
                    e.preventDefault();
                    window.location.href = ticketsURL;
                }}>
                    Buy Tickets
                    <HiTicket className="ml-2 h-3 w-3" />
                </Button>
            </TimelineContent>
        </TimelineItem>
    );
}


const Schedule = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPointsTable = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/schedule`);
            const scheduleData = await response.json();
            console.log(scheduleData['data']);
            setLoading(false);
            setData(scheduleData['data']);
        }

        fetchPointsTable()
            .catch(err => {
                console.log(err);
                setLoading(false);
                setData([]);
            })
            ;
    }, []);


    return (
        <>
            {
                loading ?
                    <div>
                        <Spinner size="xl" />
                    </div>
                    :
                    <div className="flex flex-col mt-10 ml-10 justify-center items-center">
                        <Timeline>
                            {
                                (data || []).map((item: any) => {
                                    return <ScheduleItem
                                        key={item.MatchID}
                                        date={item.MatchDateNew}
                                        matchName={item.MatchName}
                                        groundName={item.GroundName}
                                        time={item.MatchTime}
                                        ticketsURL={item.FBURL}
                                        status={item.MatchStatus}
                                    />
                                })
                            }
                        </Timeline>
                    </div>
            }
        </>

    );
}

export default Schedule;
