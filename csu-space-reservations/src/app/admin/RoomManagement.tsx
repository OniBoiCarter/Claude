"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Room {
  id: string
  name: string
  type: string
  building: string | null
  capacity: number | null
  isActive: boolean
}

export function RoomManagement({ initialRooms }: { initialRooms: Room[] }) {
  const router = useRouter()
  const [rooms, setRooms] = useState(initialRooms)
  const [adding, setAdding] = useState(false)
  const [newRoom, setNewRoom] = useState({ name: "", type: "", building: "", capacity: "" })
  const [saving, setSaving] = useState(false)

  async function addRoom() {
    if (!newRoom.name || !newRoom.type) return
    setSaving(true)
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newRoom,
        capacity: newRoom.capacity ? parseInt(newRoom.capacity) : null,
      }),
    })
    if (res.ok) {
      const created = await res.json()
      setRooms((prev) => [...prev, created])
      setNewRoom({ name: "", type: "", building: "", capacity: "" })
      setAdding(false)
      router.refresh()
    }
    setSaving(false)
  }

  async function toggleRoom(roomId: string, isActive: boolean) {
    const res = await fetch(`/api/rooms/${roomId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    })
    if (res.ok) {
      setRooms((prev) => prev.map((r) => r.id === roomId ? { ...r, isActive } : r))
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-800">Rooms / Spaces ({rooms.length})</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage available spaces on campus</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="text-xs bg-[#006633] text-white px-3 py-1.5 rounded-lg hover:bg-green-800"
        >
          + Add Room
        </button>
      </div>

      {adding && (
        <div className="px-6 py-4 bg-green-50 border-b border-gray-200 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input className="border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="Room name *" value={newRoom.name} onChange={(e) => setNewRoom((r) => ({ ...r, name: e.target.value }))} />
            <input className="border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="Type (Lecture Hall, etc.) *" value={newRoom.type} onChange={(e) => setNewRoom((r) => ({ ...r, type: e.target.value }))} />
            <input className="border border-gray-300 rounded px-2 py-1.5 text-sm" placeholder="Building" value={newRoom.building} onChange={(e) => setNewRoom((r) => ({ ...r, building: e.target.value }))} />
            <input className="border border-gray-300 rounded px-2 py-1.5 text-sm" type="number" placeholder="Capacity" value={newRoom.capacity} onChange={(e) => setNewRoom((r) => ({ ...r, capacity: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button onClick={addRoom} disabled={saving} className="text-sm bg-[#006633] text-white px-4 py-1.5 rounded hover:bg-green-800 disabled:opacity-50">
              {saving ? "Adding..." : "Add Room"}
            </button>
            <button onClick={() => setAdding(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-y-auto max-h-[450px]">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left px-4 py-2 text-gray-500 font-medium">Room</th>
              <th className="text-left px-4 py-2 text-gray-500 font-medium">Type</th>
              <th className="text-left px-4 py-2 text-gray-500 font-medium">Cap.</th>
              <th className="text-left px-4 py-2 text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rooms.map((room) => (
              <tr key={room.id} className={room.isActive ? "" : "opacity-50"}>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{room.name}</div>
                  {room.building && <div className="text-xs text-gray-400">{room.building}</div>}
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{room.type}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{room.capacity ?? "—"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleRoom(room.id, !room.isActive)}
                    className={`text-xs px-2 py-0.5 rounded transition-colors ${
                      room.isActive
                        ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700"
                        : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700"
                    }`}
                  >
                    {room.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
