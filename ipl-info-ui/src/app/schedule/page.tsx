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
    Card
} from "flowbite-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { HiArrowNarrowRight, HiCalendar } from "react-icons/hi";

interface ScheduleItemProps {
    date: string,
    matchName: string,
    groundName: string,
    homeTeamLogo: string,
    awayTeamLogo: string
}

const ScheduleItem = ({
    date,
    matchName,
    groundName,
    homeTeamLogo,
    awayTeamLogo

}: ScheduleItemProps) => {
    return (
        <TimelineItem>
            <TimelineContent>
                <TimelinePoint icon={HiCalendar} />
                <Card 
                    renderImage={() => {
                        return (
                        <div className="flex flex-1 justify-center items-center mt-10 ml-5 mr-5">
                            <Image
                                width={100}
                                height={100}
                                src={homeTeamLogo}
                                alt="home team logo" />
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white ml-5 mr-5">
                                V/S
                            </h5>
                            <Image
                                width={100}
                                height={100}
                                src={awayTeamLogo}
                                alt="away team logo" />
                        </div>
                        )
                    }}
                    className="max-w-sm">
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        {date}
                    </p>
                </Card>
            </TimelineContent>
        </TimelineItem>
    );
}


const Schedule = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPointsTable = async () => {
            const response = await fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/schedule`);
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
                    <div className="flex flex-col mt-10 justify-center items-center">
                        <Timeline>
                            {
                                (data || []).map((item: any) => {
                                    return <ScheduleItem
                                        key={item.MatchID}
                                        date={item.MatchDateNew}
                                        matchName={item.MatchName}
                                        groundName={item.GroundName}
                                        homeTeamLogo={item.HomeTeamLogo}
                                        awayTeamLogo={item.AwayTeamLogo}
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
