'use client'

import {
    Timeline,
    TabItem,
    Tabs
} from "flowbite-react";
import { useEffect, useState } from "react";

import Loader from "../Loader/Loader";
import OverDetail from "../OverDetail/OverDetail";
import { socket } from '@/app/utils/socket';


const LiveMatch = ({
    match
}:
    {
        match: string
    }) => {

    const [innings1, setInnings1] = useState([]);
    const [innings2, setInnings2] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [chasingText, setChasingText] = useState("");

    const handleLiveScoreUpdate = (msg: any) => {
        console.log(msg);
        setChasingText(msg['ChasingText'])
    }

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
        const interval = setInterval(() => {
            console.log('Going to fetch Live scores');
            socket.emit('get-score', { match: match });
        }, 10 * 1000);

        return () => {
            socket.off('live-score', handleLiveScoreUpdate);
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
                            {chasingText}
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