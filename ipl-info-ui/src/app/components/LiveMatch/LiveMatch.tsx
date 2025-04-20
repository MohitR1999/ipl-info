'use client'

import {
    Timeline,
    TabItem,
    Tabs
} from "flowbite-react";
import { useEffect, useState } from "react";

import Loader from "../Loader/Loader";
import OverDetail from "../OverDetail/OverDetail";


const LiveMatch = ({
    match
}:
    {
        match: string
    }) => {

    const [innings1, setInnings1] = useState([]);
    const [innings2, setInnings2] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

        fetchInningsData('1')
            .catch(err => {
                console.log(err);
            })
            .then(() => {
                return fetchInningsData('2');
            })
            .then(() => {
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            })
    }, []);

    return (
        <div>
            {
                isLoading ? <Loader /> :
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
                    </Tabs>}
        </div>
    );
}

export default LiveMatch;