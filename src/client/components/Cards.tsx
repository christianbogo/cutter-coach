export const Cards: React.FC = () => {
  // team card - team name short, seasons list
  // season card - season year, meets list
  // meet card - meet name, date, location

  // person card - person name, age, gender
  // athlete card - athlete name, team code, season, meets list
  // result card - athlete name, time, time-diff (implied event)
  // record card - eventCode, athlete n. , time

  return (
    <>
      <div className="card team">
        <div className="head">
          <p>WHS Girls</p>
          <p>4 Seasons</p>
        </div>
        <div className="list">
          <p>Spring 2024</p>
          <p>Spring 2023</p>
        </div>
      </div>
    </>
  );
};
