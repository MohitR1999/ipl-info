import LiveMatch from "../components/LiveMatch/LiveMatch";

const Match = async ({
    params
}: {
    params : Promise<{ match : string }>
}) => {
    const { match } = await params
    return(
        <div>
            <LiveMatch
                match={match} />
        </div>
    )
}

export default Match;