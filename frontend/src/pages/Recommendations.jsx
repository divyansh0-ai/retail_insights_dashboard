import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import { fetchProducts, postRecommend } from '../api'

function ScoreBadge({ score }) {
  const pct = Math.round(score * 100)
  if (pct >= 90) return <span className="text-[14px] font-semibold text-tertiary-container bg-tertiary-fixed px-3 py-1 rounded-full flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">moving</span>{pct}% Match</span>
  if (pct >= 75) return <span className="text-[14px] font-semibold text-primary-container bg-primary-fixed px-3 py-1 rounded-full flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span>{pct}% Match</span>
  return <span className="text-[14px] font-semibold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">trending_up</span>{pct}% Match</span>
}

export default function Recommendations() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [showList, setShowList] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    fetchProducts().then(setProducts)
  }, [])

  const filtered = query.length > 1
    ? products.filter(p =>
        p.description?.toLowerCase().includes(query.toLowerCase()) ||
        p.stock_code?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  function selectProduct(p) {
    setSelected(p)
    setQuery(`${p.stock_code} — ${p.description}`)
    setShowList(false)
  }

  async function handleRecommend() {
    if (!selected) return
    setLoading(true)
    setSearched(true)
    const recs = await postRecommend(selected.stock_code)
    setResults(recs)
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Product Recommendations" />

      <div className="flex-1 overflow-y-auto p-gutter bg-surface">
        <div className="max-w-[1440px] mx-auto space-y-10">

          <div className="max-w-2xl">
            <h1 className="text-[30px] font-bold text-on-surface mb-2">Product Recommendations</h1>
            <p className="text-[18px] text-on-surface-variant">
              Identify cross-selling opportunities based on customer purchase history.
            </p>
          </div>

          {/* Search panel */}
          <section className="bg-surface-container-lowest rounded-xl shadow-level-1 border border-outline-variant/20 p-8">
            <div className="max-w-3xl">
              <h3 className="text-[20px] font-semibold text-on-surface mb-6">Target Product Selection</h3>
              <div className="flex flex-col md:flex-row gap-4 items-end">

                <div className="flex-1 w-full relative">
                  <label className="text-[14px] font-semibold tracking-wide text-on-surface-variant block mb-2 uppercase">
                    Search by SKU or Name
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                    <input
                      value={query}
                      onChange={e => { setQuery(e.target.value); setSelected(null); setShowList(true) }}
                      onFocus={() => setShowList(true)}
                      onBlur={() => setTimeout(() => setShowList(false), 150)}
                      className="w-full bg-surface-container-low text-on-surface text-[16px] rounded-lg py-3 pl-10 pr-4 border-transparent focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-outline/70"
                      placeholder="e.g. White Hanging Heart T-Light Holder"
                    />
                  </div>
                  {showList && filtered.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-level-1 max-h-64 overflow-y-auto">
                      {filtered.map(p => (
                        <li
                          key={p.stock_code}
                          onMouseDown={() => selectProduct(p)}
                          className="px-4 py-3 cursor-pointer hover:bg-surface-container text-[14px] text-on-surface"
                        >
                          <span className="font-semibold text-primary">{p.stock_code}</span>
                          {' — '}
                          {p.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  onClick={handleRecommend}
                  disabled={!selected || loading}
                  className="w-full md:w-auto bg-primary text-on-primary text-[14px] font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 h-[48px] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">auto_awesome</span>
                  {loading ? 'Loading…' : 'Get Recommendations'}
                </button>
              </div>
            </div>
          </section>

          {/* Results */}
          {searched && (
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
                <div>
                  <h3 className="text-[20px] font-semibold text-on-surface">Top Matches</h3>
                  {selected && (
                    <p className="text-[12px] text-on-surface-variant mt-1">
                      Based on &quot;{selected.description}&quot;
                    </p>
                  )}
                </div>
              </div>

              {loading ? (
                <p className="text-on-surface-variant">Computing recommendations…</p>
              ) : results.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-lg p-8 text-center border border-outline-variant/30">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2 block">search_off</span>
                  <p className="text-on-surface-variant">No recommendations found for this product.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {results.map((rec, i) => (
                    <div
                      key={rec.stock_code}
                      className="bg-surface-container-lowest rounded-lg p-4 flex items-center justify-between border border-outline-variant/30 hover:border-primary transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-[14px] font-semibold text-on-surface-variant shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="text-[14px] font-semibold text-on-surface group-hover:text-primary transition-colors">
                            {rec.description}
                          </h4>
                          <span className="text-[12px] text-on-surface-variant">SKU: {rec.stock_code}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <ScoreBadge score={rec.similarity} />
                        <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>
      </div>
    </div>
  )
}
