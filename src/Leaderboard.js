import { useEffect, useRef, useState } from "react";
import { db, getLeaderboard } from "./firebase";

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const dataFetchedRef = useRef(false);
  const [time, setTime] = useState(0);

  const getData = async () => {
    const data = await getLeaderboard(db);
    setLeaderboardData(data);
  };

  useEffect(() => {
    let interval = setInterval(() => {
      setTime((time) => time + 1);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  console.log(time);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    console.log("here");
    dataFetchedRef.current = true;
    // setLeaderboardData(getLeaderboard(db));
    getData();
    dataFetchedRef.current = false;
  }, [time]);

  console.log(Promise.resolve(leaderboardData));

  return (
    <>
      <div class="mx-auto flex flex-row space-x-8 mt-8">
        <p class="text-3xl font-bold">Leaderboard</p>
      </div>
      <table class="mx-auto border border-black text-left  bg-white rounded table-auto mt-2 w-7/12 mb-2">
        <thead class="bg-gray-100">
          <tr>
            <th class="border border-black py-2 px-3">Username</th>
            <th class="border border-black py-2 px-3">Num Moves</th>
            <th class="border border-black py-2 px-3">Time</th>
            <th class="border border-black py-2 px-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((element, index) => (
            <tr key={index}>
              <td class="border border-black py-2 px-3">{element.username}</td>
              <td class="border border-black py-2 px-3">{element.numMoves}</td>
              <td class="border border-black py-2 px-3">
                {element.formattedTime}
              </td>
              <td class="border border-black py-2 px-3">{element.today}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Leaderboard;
