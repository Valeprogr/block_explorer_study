import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { getBlockInfo, getBlockNumber, getBlockWithTransactions } from './services/alchemy';


function App() {


  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      // cleanup
      mountedRef.current = false;
    };
  }, []);

  const safeSet = (setter) => (...args) => {
    if (mountedRef.current) setter(...args);
  };


  const [loading, _setLoading] = useState(false);
  const [error, _setError] = useState("");
  const [blockNumber, _setBlockNumber] = useState();
  const [blockInfo, _setBlockInfo] = useState();
  const [txs, _setTxs] = useState([]);

  const setLoading = safeSet(_setLoading);
  const setError = safeSet(_setError);
  const setBlockNumber = safeSet(_setBlockNumber);
  const setBlockInfo = safeSet(_setBlockInfo);
  const setTxs = safeSet(_setTxs);


  const getDt = useCallback(
    async () => {
      setLoading(true);
      setError("");
      try {
        const blockNumber = await getBlockNumber();
        const info = await getBlockInfo(blockNumber);
        const withTx = await getBlockWithTransactions(blockNumber);

        //console.log("Block Number: ", blockNumber);
        //console.log("Block Info: ", info);
        //console.log("Block With Transactions: ", withTx);

        setBlockNumber(blockNumber);
        setBlockInfo(info);
        setTxs(withTx?.transactions ?? []);
      } catch (error) {
        setError(error?.message || 'Unexpected Error');
      } finally {
        setLoading(false);
      }
    }, [setLoading, setError, setBlockNumber, setBlockInfo, setTxs])


  useEffect(() => {
    getDt();
  });

  // Stringify “safe” for BigInt
  const safeStringify = (obj) =>
    JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 2);

  const fmtTs = (ts) => {
    try {
      const n = typeof ts === "string" ? parseInt(ts, 10) : ts;
      const ms = n > 1e12 ? n : n * 1000;
      return new Date(ms).toLocaleString();
    } catch {
      return String(ts ?? "—");
    }
  };

  const truncate = (str, lead = 10, tail = 6) => {
    if (!str) return "—";
    const s = String(str);
    if (s.length <= lead + tail + 3) return s;
    return `${s.slice(0, lead)}…${s.slice(-tail)}`;
  };

  // If some values are null/undefined/BigInt/objects, display them properly

  const toDisplay = (v) => {
    if (v == null) return "—";
    if (typeof v === "bigint") return String(v);
    if (typeof v === "object") {

    if (typeof v.toString === "function" && v.toString !== Object.prototype.toString) {
        const s = v.toString();
        if (s !== "[object Object]") return s;
      }
      if ("_hex" in v) return v._hex;  // mostra hex senza convertirlo
      if ("hex" in v) return v.hex;
      try { return JSON.stringify(v); } catch { return String(v); }
    }
    return String(v);
  };

  const keyRows = [
    ["Hash", blockInfo?.hash ? truncate(blockInfo.hash) : "—"],
    ["Parent", blockInfo?.parentHash ? truncate(blockInfo.parentHash) : "—"],
    ["Timestamp", fmtTs(blockInfo?.timestamp)],
    ["Miner / Proposer", toDisplay(blockInfo?.miner || blockInfo?.proposer)],
    ["Base Fee (wei)", toDisplay(blockInfo?.baseFeePerGas)],
    ["Gas Used", toDisplay(blockInfo?.gasUsed)],
    ["Gas Limit", toDisplay(blockInfo?.gasLimit)],
    ["Tx Count", String(txs?.length ?? blockInfo?.transactions?.length ?? 0)],
  ];

  if (error.length > 0) {
    return <div>Error : {error}</div>
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased" >
      <header className="sticky top-0 z-10 backdrop-blur bg-neutral-950/70 border-b border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-neutral-800 grid place-items-center font-semibold">⛓️</div>
            <h1 className="text-lg md:text-xl font-semibold tracking-tight">Latest Block</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={getDt}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 disabled:opacity-50"
              title="Refresh"
            >
              {loading ? "Updating…" : "Refresh"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 p-3 text-sm">
            {error}
          </div>
        )}


        {/* Summary Card */}
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm text-neutral-400">Block Number</p>
              <p className="text-3xl font-semibold leading-tight">
                {blockNumber ?? (loading ? "—" : "N/D")}
              </p>
            </div>
            <div className="text-sm text-neutral-400">
              Last block seen: {fmtTs(Date.now())}
            </div>
          </div>
        </section>


        {/* Details Grid */}
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40">
          <div className="p-5 border-b border-neutral-800">
            <h2 className="text-base font-medium">Block Details</h2>
          </div>
          <div className="p-5 grid md:grid-cols-2 gap-4">
            {keyRows.map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-6 border border-neutral-800/60 rounded-xl px-4 py-3">
                <span className="text-neutral-400 text-sm">{label}</span>
                <span className="font-mono text-sm break-all">
                  {["Hash", "Parent"].includes(label)
                    ? truncate(toDisplay(value))
                    : toDisplay(value)}
                </span>
              </div>
            ))}
          </div>
        </section>


        {/* Transactions List */}
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="text-base font-medium">Recent Transactions</h2>
            <span className="text-xs text-neutral-400">first 10 transactions</span>
          </div>
          <ul className="divide-y divide-neutral-800">
            {(txs?.slice(0, 10) ?? []).map((tx) => (
              <li key={tx?.hash} className="px-5 py-3 flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                <span className="font-mono text-xs md:text-sm truncate" title={tx?.hash}>{truncate(tx?.hash, 14, 10)}</span>
                <div className="text-xs text-neutral-400 flex-1 grid md:grid-cols-3 gap-2">
                  <span title={tx?.from}><strong className="text-neutral-300">from</strong> {truncate(tx?.from, 8, 6)}</span>
                  <span title={tx?.to}><strong className="text-neutral-300">to</strong> {truncate(tx?.to, 8, 6)}</span>
                  <span><strong className="text-neutral-300">nonce</strong> {tx?.nonce ?? "—"}</span>
                </div>
              </li>
            ))}
            {!loading && (!txs || txs.length === 0) && (
              <li className="px-5 py-6 text-sm text-neutral-400">Nessuna transazione trovata per questo blocco.</li>
            )}
            {loading && (
              <li className="px-5 py-6 text-sm text-neutral-400">Caricamento transazioni…</li>
            )}
          </ul>
        </section>


        {/* Raw JSON (collapsible) */}
        <details className="rounded-2xl border border-neutral-800 bg-neutral-900/40">
          <summary className="cursor-pointer select-none p-4 text-sm text-neutral-300">See raw JSON</summary>
          <pre className="p-4 text-xs overflow-auto">
            {blockInfo ? safeStringify(blockInfo) : "Nessun dato"}
          </pre>
        </details>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-10 text-center text-xs text-neutral-500">
        Ethereum Block Explorer • Valentina Vittoria © 2025
      </footer>

    </div>
  );
}

export default App;
