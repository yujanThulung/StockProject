import { useEffect, useState } from 'react';
import { fetchPrediction } from '../../services/stock.services';

const Dashboard = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await fetchPrediction('AAPL', 3);
    setData(res.data.predictions);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <Chart data={data} />;
};

export default Dashboard;
