'use client'

import { Card, Button } from 'flowbite-react';
import { HiLocationMarker } from "react-icons/hi";
import Image from "next/image";
import { MouseEventHandler } from 'react';

interface MatchCardProps extends Record<string, any> {
    handleClick: MouseEventHandler,
    actionText: string,
    date: Date,
}

const MatchCard = (props: MatchCardProps) => {
    return (
        <div className='flex p-5 flex-col justify-center items-center'>
            <Card className="flex-1 max-w-md w-full">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {props.MatchName}
                </h5>

                <div className='flex items-center'>
                    <p className="text-gray-700 dark:text-gray-400">
                        {props.MatchDateNew}, {props.date.getHours() - 12}:{props.date.getMinutes()} pm IST
                    </p>
                </div>

                <div className='flex justify-between items-center'>
                    <div className='flex flex-col justify-between items-center'>
                        {
                            props.HomeTeamLogo && props.FirstBattingTeamName
                                ?
                                <Image
                                    src={props.HomeTeamLogo}
                                    width={150}
                                    height={150}
                                    alt={props.FirstBattingTeamName} />
                                : <></>
                        }

                        <div className='text-gray-900 dark:text-gray-100'>
                            {props.FirstBattingTeamCode}
                        </div>
                    </div>
                    <h6 className="text-xl text-gray-900 dark:text-gray-400">
                        vs
                    </h6>
                    <div className='flex flex-col justify-between items-center'>
                        {
                            props.AwayTeamLogo && props.SecondBattingTeamName
                                ?
                                <Image
                                    src={props.AwayTeamLogo}
                                    width={150}
                                    height={150}
                                    alt={props.SecondBattingTeamName} />
                                : <></>
                        }
                        <div className='text-gray-900 dark:text-gray-100'>
                            {props.SecondBattingTeamCode}
                        </div>
                    </div>
                </div>
                <div className='flex justify-center items-center'>
                    <p className="text-gray-700 dark:text-gray-400">
                        IPL {props.MatchOrder}
                    </p>
                </div>

                <div className='flex items-center'>
                    <HiLocationMarker className='mr-2 w-4 h-4' />
                    <p className="text-gray-700 dark:text-gray-400">
                        {props.GroundName ? props.GroundName : 'To be declared'}
                    </p>
                </div>

                <Button onClick={props.handleClick}>
                    {props.actionText}
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
    );
}

export default MatchCard;