import { useState, useEffect } from 'react'
import { health } from '../services/api'
import { Server, Activity, Shield } from 'lucide-react'
export default function Dashboard() {
  const [instance, setInstance] = useState('—')
  useEffect(() => { health().then(r => setInstance(r.data.instance || r.data.source_instance || 'unknown')).catch(() => {}) }, [])
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4"><div className="bg-amber-500 p-3 rounded-lg text-white"><Server size={24} /></div><div><p className="text-sm text-gray-500">Instancia Actual</p><p className="text-2xl font-bold">{instance}</p></div></div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4"><div className="bg-blue-500 p-3 rounded-lg text-white"><Activity size={24} /></div><div><p className="text-sm text-gray-500">Réplicas</p><p className="text-2xl font-bold">3</p></div></div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4"><div className="bg-green-500 p-3 rounded-lg text-white"><Shield size={24} /></div><div><p className="text-sm text-gray-500">LB Type</p><p className="text-2xl font-bold">L4 TCP</p></div></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold mb-3">Arquitectura</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg"><p className="font-medium">API Traffic (8000)</p><p className="text-gray-400 text-xs">least_conn - distribuye por carga</p></div>
          <div className="p-3 bg-gray-50 rounded-lg"><p className="font-medium">SSE Traffic (8001)</p><p className="text-gray-400 text-xs">hash $remote_addr consistent - sticky</p></div>
          <div className="p-3 bg-gray-50 rounded-lg"><p className="font-medium">Health Checks</p><p className="text-gray-400 text-xs">max_fails=3 fail_timeout=30s</p></div>
          <div className="p-3 bg-gray-50 rounded-lg"><p className="font-medium">Shared State</p><p className="text-gray-400 text-xs">Redis para sessions, cache, events</p></div>
        </div>
      </div>
    </div>
  )
}
