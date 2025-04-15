'use client'

import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface TableItemProps {
    name: string;
    position : string;
    image : string;
    points : string;
}

const TableItem = ({
    name,
    position,
    image,
    points
}: TableItemProps) => {
    return (
        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {position}
            </TableCell>
            <TableCell>
                <div className="flex">
                    <Image
                        src={image}
                        width={30}
                        height={30}
                        className="mr-4"
                        alt="Team logo" />
                    {name}
                </div>
            </TableCell>
            <TableCell>
                {points}
            </TableCell>
        </TableRow>
    );
}

const Points = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPointsTable = async () => {
            const response = await fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/points`);
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
                        Loading...
                    </div>
                    :
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="text-lg m-8">Points table</h1>
                        <div className="overflow-x-auto max-w-full flex-1">
                            <Table className="min-w-full">
                                <TableHead>
                                    <TableRow>
                                        <TableHeadCell>Position</TableHeadCell>
                                        <TableHeadCell>Team</TableHeadCell>
                                        <TableHeadCell>Points</TableHeadCell>
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

