export default function Totalstudents({ contTitle, count }) {
    return (
        <div id="numbercontainer" className="defcontainer">
            <h1>{contTitle}</h1>
            <h2>{count ?? 0}</h2>
        </div>
    );
}