'use client';

import {
    Button,
    Timeline,
    TimelineBody,
    TimelineContent,
    TimelineItem,
    TimelinePoint,
    TimelineTime,
    TimelineTitle,
    Card
} from "flowbite-react";
import { 
    MdOutlineLooksOne, 
    MdOutlineLooksTwo, 
    MdOutlineLooks3, 
    MdOutlineLooks4, 
    MdOutlineLooks6, 
    MdSportsCricket, 
    MdCircle,
    MdOutlineCancel, 
} from "react-icons/md";

const OverDetail = (props: any) => {
    return (
        <TimelineItem>
            <TimelinePoint icon={() => {
                if (props.IsOne == '1') {
                    return <MdOutlineLooksOne className="text-xl" />
                } else if (props.IsTwo == '1') {
                    return <MdOutlineLooksTwo className="text-xl"/>
                } else if (props.IsThree == '1') {
                    return <MdOutlineLooks3 className="text-xl" />
                } else if (props.IsFour == '1') {
                    return <MdOutlineLooks4 className="text-orange-400 text-xl"/>
                } else if (props.IsSix == '1') {
                    return <MdOutlineLooks6 className="text-green-400 text-xl"/>
                } else if (props.IsWicket == '1') {
                    return <MdOutlineCancel className="text-red-400 text-xl"/>
                }  
                else if (props.IsDotball == '1') {
                    return <MdCircle />
                } 
                else {
                    return <MdSportsCricket />
                }
            }}/>
            <TimelineContent>
                <TimelineTime className="text-md">{props.CommentOver}</TimelineTime>
                <TimelineBody>
                    <Card className="w-full">
                        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-400">
                            {props.CommentStrikers}
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                           {props.Commentry}
                        </p>
                    </Card>
                </TimelineBody>
            </TimelineContent>
        </TimelineItem>
    );
}

export default OverDetail;