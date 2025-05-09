export const Cards: React.FC = () => {
  return (
    <>
      <p className="cards-header">WHS Girls</p>

      <p className="cards-subheader">Seasons List</p>

      <div className="cards-list">
        <div className="card season">
          <div className="split">
            <div className="two-strong">
              <p>Fall 2024</p>
              <p>3/12 - 6-20</p>
            </div>
            <p>Open Icon</p>
          </div>
        </div>

        <div className="card season">
          <div className="split">
            <div className="two-strong">
              <p>Spring 2025</p>
              <p>3/12 - 6-20</p>
            </div>
            <div className="drop">
              <p>Close Icon</p>
            </div>
          </div>
          <br />
          <div className="list">
            <div className="two">
              <p>27 Athletes</p>
              <p>4FR, 6SO, 8JR, 9SR</p>
            </div>
            <div className="two">
              <p>12 Meets</p>
              <p>311 Swims</p>
            </div>
            <div className="list">
              <div className="two">
                <p>JR Champs</p>
                <p>3/14</p>
              </div>
              <div className="two">
                <p>Spring Champs</p>
                <p>3/14</p>
              </div>
              <div className="two">
                <p>Spring Champs</p>
                <p>3/14</p>
              </div>
            </div>
          </div>
          <br />
          <button className="cta">Call to Action</button>
        </div>
      </div>

      <p className="cards-subheader">Team Records</p>

      <div className="records-list">
        <div className="record">
          <p className="code">2FRR</p>
          <p className="result">2:00.00</p>
          <p className="athlete">Christian C.</p>
        </div>
        <div className="record">
          <p className="code">1BR</p>
          <p className="result">57.62</p>
          <p className="athlete">Christian C.</p>
        </div>
      </div>

      <p className="cards-subheader">Top 25</p>

      <div className="records-list">
        <div className="record">
          <p className="rank">1</p>
          <p className="result">2:00.00</p>
          <p className="athlete">Christian C.</p>
        </div>
        <div className="record">
          <p className="rank">12</p>
          <p className="result">57.62</p>
          <p className="athlete">Christian C.</p>
        </div>
      </div>
    </>
  );
};
