import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  sentimentCounts: {
    POSITIVE: number;
    NEGATIVE: number;
    PENDING: number;
  };
};

export default function SentimentChart({ sentimentCounts }: Props) {
  const data = {
    labels: ['Positive', 'Negative', 'Pending'],
    datasets: [
      {
        data: [
          sentimentCounts.POSITIVE,
          sentimentCounts.NEGATIVE,
          sentimentCounts.PENDING,
        ],
        backgroundColor: ['#22c55e', '#ef4444', '#facc15'],
      },
    ],
  };

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-2">Sentiment Analysis</h2>
      <Pie data={data} />
    </div>
  );
}
