import { FaApple } from "react-icons/fa";
import useStockStore from "../../../../store/usePricePrediction.store";

export default function StockHeader() {
  const { ticker, stockData } = useStockStore();

  const name = stockData?.Name ?? "N/A";
  const exchange = stockData?.Exchange ?? "N/A";
  const symbol = ticker?.toUpperCase() ?? "N/A";
  

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <FaApple size={32} />
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground">{exchange}: {symbol}</p>
        </div>
      </div>
    </div>
  );
}
