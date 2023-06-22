interface ActivityBoardProps {
    activities: any[] //To change later
}
export default function ActivityBoard () {
    return (
        <>
            <div className="activity-board grow p-4 bg-gradient-to-br from-slate-500/20 from-10% to-transparent to-95% backdrop-blur-lg rounded shadow-lg mx-4">
                <h1>Activity Board</h1>
            </div>
        </>
    )
}