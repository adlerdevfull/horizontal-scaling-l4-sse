import { useState } from 'react'
import { health } from '../services/api'
import { Server, Play, BarChart3 } from 'lucide-react'

export default function LoadBalancer() {
  const [results, setResults] = useState([])
  const [distribution, setDistribution] = useState({})
  const [running, setRunning] = useState(false)

  const runTest = async (count = 10) => {
    setRunning(true)
    setResults([])
    const dist = {}
    const newResults = []

    for (let i = 0; i < count; i++) {
      try {
        const res = await health()
        const instance = res.data.instance || res.data.source_instance || 'unknown'
        dist[instance] = (dist[instance] || 0) + 1
        newResults.push({ id: i + 1, instance, time: Date.now() })
        setResults([...newResults])
        setDistribution({ ...dist })
      } catch {
        newResults.push({ id: i + 1, instance: 'ERROR', time: Date.now() })
        setResults([...newResults])
      }
      await new Promise(r => setTimeout(r, 200))
    }
    setRunning(false)
  }

  const total = results.length
  const instanceColors = { app1: 'bg-blue-500', app2: 'bg-green-500', app3: 'bg-purple-500' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Load Balancer Test</h2>
        <div className="flex gap-2">
          <button onClick={() => runTest(10)} disabled={running} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 disabled:opacity-50 flex items-center gap-2"><Play size={16} /> 10 requests</button>
          <button onClick={() => runTest(30)} disabled={running} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 disabled:opacity-50 flex items-center gap-2"><BarChart3 size={16} /> 30 requests</button>
        </div>
      </div>

      {/* Distribution visualization */}
      {Object.keys(distribution).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <h3 className="font-semibold mb-3">Distribución</h3>
          <div className="space-y-2">
            {Object.entries(distribution).map(([instance, count]) => (
              <div key={instance} className="flex items-center gap-3">
                <Server size={16} className="text-gray-400" />
                <span className="w-16 text-sm font-medium">{instance}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div className={`h-full ${instanceColors[instance] || 'bg-gray-500'} rounded-full transition-all duration-500 flex items-center justify-end pr-2`} style={{ width: `${(count / total) * 100}%` }}>
                    <span className="text-xs text-white font-medium">{count} ({Math.round((count / total) * 100)}%)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request log */}
      {results.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm max-h-80 overflow-auto">
          {results.map(r => (
            <div key={r.id} className="flex gap-4 text-gray-300 py-0.5">
              <span className="text-gray-500 w-8">#{r.id}</span>
              <span className={`${r.instance === 'ERROR' ? 'text-red-400' : r.instance === 'app1' ? 'text-blue-400' : r.instance === 'app2' ? 'text-green-400' : 'text-purple-400'}`}>
                → {r.instance}
              </span>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && !running && (
        <div className="text-center py-12 text-gray-400">
          <Server size={48} className="mx-auto mb-3 opacity-50" />
          <p>Pulsa un botón para enviar requests y ver la distribución del Load Balancer</p>
        </div>
      )}
    </div>
  )
}
