import { FaApple } from "react-icons/fa";

export default function StockHeader() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <FaApple className="text-3xl" />
        <div>
          <h2 className="text-xl font-semibold">Apple</h2>
          <p className="text-sm text-muted-foreground">NASDAQ: AAPL</p>
          <p className="text-sm text-muted-foreground">
            After Hours: $230.43 <span className="text-red-500">(-0.049%)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
