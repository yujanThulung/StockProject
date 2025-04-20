export default function StockSummary() {
    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="bg-white p-4 rounded-md shadow text-center">
          <p className="text-sm text-muted-foreground">Open Stock</p>
          <h3 className="text-xl font-bold">228.92 USD</h3>
        </div>
        <div className="bg-white p-4 rounded-md shadow text-center">
          <p className="text-sm text-muted-foreground">Market Cap</p>
          <h3 className="text-xl font-bold">3.535T USD</h3>
        </div>
        <div className="bg-white p-4 rounded-md shadow text-center">
          <p className="text-sm text-muted-foreground">Volume</p>
          <h3 className="text-xl font-bold">69.1M USD</h3>
        </div>
      </div>
    );
  }
  