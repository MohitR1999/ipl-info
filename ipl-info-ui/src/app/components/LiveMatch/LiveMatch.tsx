'use client'

import {
    Timeline,
    TabItem,
    Tabs,
    Card
} from "flowbite-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Loader from "../Loader/Loader";
import OverDetail from "../OverDetail/OverDetail";
import { socket } from '@/app/utils/socket';

const StatsCard = (props: any) => {
    const IMG_SIZE = 100

    const homeTeamStats = props.firstInnings.includes(props.homeTeamName) ? props.firstSummary : props.secondSummary;
    const awayTeamStats = props.firstInnings.includes(props.awayTeamName) ? props.firstSummary : props.secondSummary;

    console.log({
        homeTeamStats,
        awayTeamStats
    });

    return (
        <div className='flex p-5 flex-col justify-center items-center'>
            <Card className="flex-1 max-w-md w-full">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {props.matchName}
                </h5>

                <div className='flex justify-between items-center'>
                    <div className='flex flex-col justify-between items-center'>
                        {
                            props.homeTeamLogo && props.homeTeamName
                                ?
                                <Image
                                    src={props.homeTeamLogo}
                                    width={IMG_SIZE}
                                    height={IMG_SIZE}
                                    alt={props.homeTeamName} />
                                : <></>
                        }
                        <div className='text-gray-900 dark:text-gray-100'>
                            {homeTeamStats ? homeTeamStats : "-/-"}
                        </div>
                    </div>
                    <h6 className="text-xl text-gray-900 dark:text-gray-400">
                        vs
                    </h6>
                    <div className='flex flex-col justify-between items-center'>
                        {
                            props.awayTeamLogo && props.awayTeamName
                                ?
                                <Image
                                    src={props.awayTeamLogo}
                                    width={IMG_SIZE}
                                    height={IMG_SIZE}
                                    alt={props.awayTeamName} />
                                : <></>
                        }
                        <div className='text-gray-900 dark:text-gray-100'>
                            {awayTeamStats ? awayTeamStats : " "}
                        </div>
                    </div>
                </div>

                <div className='flex items-center'>
                    <p className="text-gray-700 dark:text-gray-400">
                        {props.tossDetails}
                    </p>
                </div>

            </Card>
        </div>
    );
}

const LiveMatch = ({
    match
}:
    {
        match: string
    }) => {

    const [innings1, setInnings1] = useState<any>([]);
    const [innings2, setInnings2] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [chasingText, setChasingText] = useState("");
    const [tossDetails, setTossDetails] = useState("");
    const [matchName, setMatchName] = useState("");
    const [homeTeamLogo, setHomeTeamLogo] = useState("");
    const [awayTeamLogo, setAwayTeamLogo] = useState("");
    const [homeTeamName, setHomeTeamName] = useState("");
    const [awayTeamName, setAwayTeamName] = useState("");
    const [firstSummary, setFirstSummary] = useState("");
    const [secondSummary, setSecondSummary] = useState("");
    const [firstInnings, setFirstInnings] = useState("");
    const [secondInnings, setSecondInnings] = useState("");

    const handleLiveScoreUpdate = (msg: any) => {
        console.log(msg);
        setChasingText(msg['ChasingText'])
        setTossDetails(msg['TossDetails'])
        setFirstInnings(msg['1InningsName']);
        setSecondInnings(msg['2InningsName']);
        setFirstSummary(msg['1Summary']);
        setSecondSummary(msg['2Summary']);
    }

    const handleLiveCommentaryUpdate = (msg: any) => {
        switch (msg.InningsNo) {
            case 1: {
                setInnings1((prevInnings1 : any) => {
                    if (prevInnings1.length === 0 || msg.BallUniqueID !== prevInnings1[0].BallUniqueID) {
                        return [msg, ...prevInnings1];
                    }
                    return prevInnings1;
                });
                break;
            }
            case 2: {
                setInnings2((prevInnings2 : any) => {
                    if (prevInnings2.length === 0 || msg.BallUniqueID !== prevInnings2[0].BallUniqueID) {
                        return [msg, ...prevInnings2];
                    }
                    return prevInnings2;
                });
                break;
            }
            default:
                break;
        }
    };

    useEffect(() => {
        setIsLoading(true);
        const fetchInningsData = async (innings: string) => {
            try {
                const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/live?matchId=${match}&innings=${innings}`);
                const data = await result.json();
                data.reverse();
                if (innings == '1') {
                    setInnings1(data);
                } else if (innings == '2') {
                    setInnings2(data);
                }
            } catch (err) {
                console.log(err);
            }
        }

        const fetchMatchSummary = async () => {
            try {
                const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/summary?matchId=${match}`);
                const data = await result.json();
                setChasingText(data['ChasingText']);
                setTossDetails(data['TossDetails']);
                setMatchName(data['MatchName']);
                setHomeTeamLogo(data['HomeTeamLogo']);
                setAwayTeamLogo(data['AwayTeamLogo']);
                setHomeTeamName(data['HomeTeamName']);
                setAwayTeamName(data['AwayTeamName']);
                setFirstInnings(data['1InningsName']);
                setSecondInnings(data['2InningsName']);
                setFirstSummary(data['1Summary']);
                setSecondSummary(data['2Summary']);
            } catch (err) {
                console.log(err);
            }
        }

        fetchInningsData('1')
            .catch(err => {
                console.log(err);
            })
            .then(() => {
                return fetchInningsData('2');
            })
            .then(() => {
                return fetchMatchSummary();
            })
            .then(() => {
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            })
    }, []);

    useEffect(() => {
        socket.connect();
        socket.on('live-score', handleLiveScoreUpdate);
        socket.on('live-commentary', handleLiveCommentaryUpdate);
        const interval = setInterval(() => {
            socket.emit('get-score', { match: match });
            socket.emit('get-commentary', { match: match });
        }, 10 * 1000);

        return () => {
            socket.off('live-score', handleLiveScoreUpdate);
            socket.off('live-commentary', handleLiveCommentaryUpdate);
            socket.disconnect();
            clearInterval(interval);
        }

    }, [])

    return (
        <div>
            {
                isLoading ? <Loader /> :
                    <div className="flex flex-col">
                        <div>
                            <StatsCard
                                tossDetails={tossDetails}
                                matchName={matchName}
                                homeTeamLogo={homeTeamLogo}
                                awayTeamLogo={awayTeamLogo}
                                homeTeamName={homeTeamName}
                                awayTeamName={awayTeamName}
                                firstInnings={firstInnings}
                                firstSummary={firstSummary}
                                secondInnings={secondInnings}
                                secondSummary={secondSummary}
                            />
                        </div>

                        <Tabs aria-label="Pills" variant="fullWidth">
                            <TabItem active title="Innings 1">
                                <div className="flex ml-5 mr-5">
                                    <Timeline>
                                        {
                                            innings1.map((ball: any) => {
                                                const random = Math.floor(Math.random() * 1000);
                                                return <OverDetail
                                                    key={`${ball.BallUniqueID}${random}`}
                                                    {...ball}
                                                />
                                            })
                                        }
                                    </Timeline>
                                </div>
                            </TabItem>
                            <TabItem title="Innings 2">
                                <div className="flex ml-5 mr-5">
                                    <Timeline>
                                        {
                                            innings2.map((ball: any) => {
                                                const random = Math.floor(Math.random() * 1000);
                                                return <OverDetail
                                                    key={`${ball.BallUniqueID}${random}`}
                                                    {...ball}
                                                />
                                            })
                                        }
                                    </Timeline>
                                </div>
                            </TabItem>
                        </Tabs>
                    </div>

            }
        </div>
    );
}

export default LiveMatch;