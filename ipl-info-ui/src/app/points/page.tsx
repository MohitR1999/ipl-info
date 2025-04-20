'use client'

import { Spinner, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const Win = () => {
    return (
        <span className="border-green-400 border-1 p-0.5 rounded-full">
            W
        </span>
    );
}

const Loss = () => {
    return (
        <span className="border-red-400 border-1 p-0.5 rounded-full">
            L
        </span>
    );
}

interface TableItemProps {
    name: string;
    position: string;
    image: string;
    points: string;
    performance: string;
}

const TableItem = ({
    name,
    position,
    image,
    points,
    performance
}: TableItemProps) => {
    return (
        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {position}
            </TableCell>
            <TableCell>
                <Image
                    src={image}
                    width={32}
                    height={32}
                    alt="Team logo" />
            </TableCell>
            <TableCell>
                {name}
            </TableCell>
            <TableCell>
                {points}
            </TableCell>
            <TableCell>
                <div className="flex justify-center items-center">
                    {performance.split(",").map((s, i) => {
                        return (
                            <div key={i} className="ml-1">
                                {s == 'L' ? <Loss/> : <Win/>}
                            </div>
                        )
                    })}
                </div>
            </TableCell>
        </TableRow>
    );
}

const Points = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPointsTable = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/points`);
            const pointsData = await response.json();
            console.log(pointsData);
            setLoading(false);
            setData(pointsData['data']['points']);
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
                    <div className="flex flex-col justify-center items-center">
                        <div className='text-2xl text-gray-400 mb-8'>
                           Points table
                        </div>
                        <div className="overflow-x-auto max-w-full flex-1">
                            <Table className="min-w-full">
                                <TableHead>
                                    <TableRow>
                                        <TableHeadCell>Position</TableHeadCell>
                                        <TableHeadCell>Team</TableHeadCell>
                                        <TableHeadCell>Name</TableHeadCell>
                                        <TableHeadCell>Points</TableHeadCell>
                                        <TableHeadCell>Performance</TableHeadCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="divide-y">
                                    {(data || []).map((item: any) => {
                                        return <TableItem
                                            key={item.TeamID}
                                            name={item.TeamName}
                                            position={item.OrderNo}
                                            image={item.TeamLogo}
                                            points={item.Points}
                                            performance={item.Performance}
                                        />
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
            }
        </>

    );
}

export default Points;

