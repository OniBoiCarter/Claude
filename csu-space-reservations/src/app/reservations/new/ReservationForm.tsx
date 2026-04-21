"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Room {
  id: string
  name: string
  type: string
  building: string | null
  capacity: number | null
}

interface Advisor {
  id: string
  name: string | null
  email: string | null
  department: string | null
}

interface CurrentUser {
  id: string
  name: string
  email: string
  role: string
  department: string
  title: string
}

interface Props {
  currentUser: CurrentUser
  rooms: Room[]
  advisors: Advisor[]
}

const SPACE_TYPES = [
  "Lecture Hall",
  "Arena",
  "Conference Room",
  "Auditorium",
  "Gymnasium",
  "Cafeteria",
  "Outdoor Area",
  "Classroom",
  "Multipurpose Room",
  "Student Center",
  "Other",
]

export function ReservationForm({ currentUser, rooms, advisors }: Props) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    // Application Info
    requestorName: currentUser.name,
    title: currentUser.title,
    department: currentUser.department,
    address: "",
    city: "Chicago",
    state: "IL",
    zip: "",
    telephone: "",
    fax: "",
    email: currentUser.email,
    fundingAccountNo: "",
    submitterType: currentUser.role === "SUBMITTER" ? "STUDENT_ORG" : currentUser.role === "FACULTY" ? "FACULTY" : "STAFF",
    advisorId: "",

    // Event Info
    eventName: "",
    eventDate: "",
    alternativeDate: "",
    startTime: "",
    endTime: "",
    attendance: "",
    purpose: "",
    speakerPerformer: "",
    whoMayAttend: "",
    admissionType: "FREE",
    ticketPrice: "",
    payOnSitePrice: "",
    foodBeverages: false,
    musicProvided: false,
    musicType: "",
    concessionsNeeded: false,
    catered: false,
    webCalendar: false,

    // Space Info
    requestedSpace: "",
    roomId: "",
    setupDescription: "",
    doorOpenTimeSponsor: "",
    doorOpenTimePublic: "",

    // Additional Services
    soundMicrophone: false,
    audiovisual: false,
    podium: false,
    stage: false,
    stageSize: "",
    parking: false,
    telecomDevices: false,
    tablesNeeded: false,
    tableType: "",
    registrationTable: false,
    chairs: false,
    chairCount: "",
    lighting: false,
    pipeDrape: false,
    otherServices: "",
  })

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const payload = {
      ...form,
      attendance: parseInt(form.attendance) || 0,
      ticketPrice: form.ticketPrice ? parseFloat(form.ticketPrice) : null,
      payOnSitePrice: form.payOnSitePrice ? parseFloat(form.payOnSitePrice) : null,
      chairCount: form.chairCount ? parseInt(form.chairCount) : null,
      roomId: form.roomId || null,
      advisorId: form.advisorId || null,
      alternativeDate: form.alternativeDate || null,
    }

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Submission failed. Please try again.")
      setSubmitting(false)
      return
    }

    const created = await res.json()
    router.push(`/reservations/${created.id}`)
  }

  const inputClass = "w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"
  const sectionClass = "border border-gray-300 rounded-lg overflow-hidden mb-6"
  const sectionHeaderClass = "bg-gray-100 border-b border-gray-300 px-4 py-2 font-bold text-sm text-gray-800 uppercase tracking-wide"

  return (
    <form onSubmit={handleSubmit} className="space-y-0">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-start justify-between mb-2">
          <div className="text-left">
            <div className="font-bold text-lg">CHICAGO STATE UNIVERSITY</div>
            <div className="text-sm italic font-semibold">Office of Meetings &amp; Events</div>
            <div className="text-xs text-gray-500 mt-1">9501 South King Drive – Room 2304</div>
            <div className="text-xs text-gray-500">Chicago, IL 60628-1598</div>
            <div className="text-xs text-gray-500">Office: (773) 821-2183 · Fax: (773) 821-2721</div>
          </div>
          <div className="border border-red-600 p-3 text-center text-xs max-w-[160px]">
            <div className="font-bold text-red-600">PLEASE NOTE:</div>
            <div className="mt-1 font-semibold text-gray-800">ONE EVENT, ONE DATE, and ONE LOCATION per form.</div>
          </div>
        </div>
        <h1 className="text-xl font-bold underline mt-2 text-[#006633]">Space Reservation Request Form</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {/* APPLICATION INFORMATION */}
      <div className={sectionClass}>
        <div className={sectionHeaderClass}>Application Information (Please print or type.)</div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Requestor&apos;s Name *</label>
              <input className={inputClass} required value={form.requestorName} onChange={(e) => set("requestorName", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Department / Organization *</label>
            <input className={inputClass} required value={form.department} onChange={(e) => set("department", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input className={inputClass} value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className={labelClass}>City</label>
              <input className={inputClass} value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input className={inputClass} value={form.state} onChange={(e) => set("state", e.target.value)} maxLength={2} />
            </div>
            <div>
              <label className={labelClass}>Zip</label>
              <input className={inputClass} value={form.zip} onChange={(e) => set("zip", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Telephone</label>
              <input className={inputClass} type="tel" value={form.telephone} onChange={(e) => set("telephone", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Fax</label>
              <input className={inputClass} value={form.fax} onChange={(e) => set("fax", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <input className={inputClass} type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                Funding Account # <span className="text-red-600 font-semibold">(Required)</span>
              </label>
              <input className={inputClass} required value={form.fundingAccountNo} onChange={(e) => set("fundingAccountNo", e.target.value)} placeholder="Account number required to process" />
              <p className="text-xs text-red-600 mt-1 font-medium">Please include your account number or your reservation will not be processed if blank</p>
            </div>
            <div>
              <label className={labelClass}>Submitter Type *</label>
              <select className={inputClass} required value={form.submitterType} onChange={(e) => set("submitterType", e.target.value)}>
                <option value="STUDENT_ORG">Student Organization</option>
                <option value="FACULTY">Faculty</option>
                <option value="STAFF">Staff</option>
                <option value="EXTERNAL">External Organization / Company</option>
              </select>
            </div>
          </div>
          {form.submitterType === "STUDENT_ORG" && (
            <div>
              <label className={labelClass}>Club / Organization Advisor *</label>
              <select className={inputClass} required={form.submitterType === "STUDENT_ORG"} value={form.advisorId} onChange={(e) => set("advisorId", e.target.value)}>
                <option value="">Select your advisor...</option>
                {advisors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name ?? a.email} {a.department ? `– ${a.department}` : ""}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Required for student organization requests — your advisor must approve before it goes to the Director.</p>
            </div>
          )}
        </div>
      </div>

      {/* EVENT / ACTIVITY INFORMATION */}
      <div className={sectionClass}>
        <div className={sectionHeaderClass}>Event / Activity Information (Please be specific)</div>
        <div className="p-4 space-y-3">
          <div>
            <label className={labelClass}>Name / Type of Event *</label>
            <input className={inputClass} required value={form.eventName} onChange={(e) => set("eventName", e.target.value)} />
          </div>
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-2">
              <label className={labelClass}>Event Date * (min. 15 days ahead)</label>
              <input
                className={inputClass}
                type="date"
                required
                value={form.eventDate}
                min={new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0]}
                onChange={(e) => set("eventDate", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Alternative Date</label>
              <input className={inputClass} type="date" value={form.alternativeDate} min={new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0]} onChange={(e) => set("alternativeDate", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Attendance *</label>
              <input className={inputClass} type="number" required min="1" value={form.attendance} onChange={(e) => set("attendance", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Start Time *</label>
              <input className={inputClass} type="time" required value={form.startTime} onChange={(e) => set("startTime", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>End Time *</label>
              <input className={inputClass} type="time" required value={form.endTime} onChange={(e) => set("endTime", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Purpose of Event (Describe the outcome and benefit of this event.) *</label>
            <textarea className={inputClass + " resize-none"} rows={3} required value={form.purpose} onChange={(e) => set("purpose", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Name of Speaker / Performer</label>
            <input className={inputClass} value={form.speakerPerformer} onChange={(e) => set("speakerPerformer", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Who may attend this event?</label>
            <input className={inputClass} value={form.whoMayAttend} onChange={(e) => set("whoMayAttend", e.target.value)} placeholder="e.g., CSU students, faculty, general public..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Admission Charge</label>
              <select className={inputClass} value={form.admissionType} onChange={(e) => set("admissionType", e.target.value)}>
                <option value="FREE">Free</option>
                <option value="TICKETS">Tickets</option>
                <option value="PAY_ON_SITE">Pay on Site</option>
              </select>
            </div>
            {form.admissionType === "TICKETS" && (
              <div>
                <label className={labelClass}>Ticket Price ($)</label>
                <input className={inputClass} type="number" step="0.01" min="0" value={form.ticketPrice} onChange={(e) => set("ticketPrice", e.target.value)} />
              </div>
            )}
            {form.admissionType === "PAY_ON_SITE" && (
              <div>
                <label className={labelClass}>Pay on Site Price ($)</label>
                <input className={inputClass} type="number" step="0.01" min="0" value={form.payOnSitePrice} onChange={(e) => set("payOnSitePrice", e.target.value)} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.foodBeverages} onChange={(e) => set("foodBeverages", e.target.checked)} className="w-4 h-4 accent-green-700" />
              Food / Beverages
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.concessionsNeeded} onChange={(e) => set("concessionsNeeded", e.target.checked)} className="w-4 h-4 accent-green-700" />
              Concessions Needed
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.catered} onChange={(e) => set("catered", e.target.checked)} className="w-4 h-4 accent-green-700" />
              Catered
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.webCalendar} onChange={(e) => set("webCalendar", e.target.checked)} className="w-4 h-4 accent-green-700" />
              Web Calendar
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.musicProvided} onChange={(e) => set("musicProvided", e.target.checked)} className="w-4 h-4 accent-green-700" />
              Music Provided
            </label>
            {form.musicProvided && (
              <div>
                <label className={labelClass}>Music Type (DJ / Band / Other)</label>
                <input className={inputClass} value={form.musicType} onChange={(e) => set("musicType", e.target.value)} placeholder="DJ, Band, Recorded Music, etc." />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SPACE REQUESTED */}
      <div className={sectionClass}>
        <div className={sectionHeaderClass}>Space Requested &amp; Space Set-Up Arrangements (Please be specific)</div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Requested Space * (Lecture Halls, Arena, Conference Rooms, Auditorium, etc.)</label>
              <input
                className={inputClass}
                required
                list="space-types"
                value={form.requestedSpace}
                onChange={(e) => set("requestedSpace", e.target.value)}
                placeholder="Enter or select space type..."
              />
              <datalist id="space-types">
                {SPACE_TYPES.map((s) => <option key={s} value={s} />)}
                {rooms.map((r) => <option key={r.id} value={r.name} />)}
              </datalist>
            </div>
            <div>
              <label className={labelClass}>Specific Room (if known)</label>
              <select className={inputClass} value={form.roomId} onChange={(e) => set("roomId", e.target.value)}>
                <option value="">Any available room</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} {r.building ? `– ${r.building}` : ""} {r.capacity ? `(cap. ${r.capacity})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Set-Up Description (Describe how you want the space arranged and attach a sketch to this request.)</label>
            <textarea className={inputClass + " resize-none"} rows={3} value={form.setupDescription} onChange={(e) => set("setupDescription", e.target.value)} placeholder="Describe seating arrangement, stage placement, table configuration, etc." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>What time should doors be opened? For Sponsor:</label>
              <input className={inputClass} type="time" value={form.doorOpenTimeSponsor} onChange={(e) => set("doorOpenTimeSponsor", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>For Public:</label>
              <input className={inputClass} type="time" value={form.doorOpenTimePublic} onChange={(e) => set("doorOpenTimePublic", e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* ADDITIONAL SERVICES */}
      <div className={sectionClass}>
        <div className={sectionHeaderClass}>Additional Services (Subject to Cost)</div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.soundMicrophone} onChange={(e) => set("soundMicrophone", e.target.checked)} className="w-4 h-4 accent-green-700" />
                Sound / Microphone
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.audiovisual} onChange={(e) => set("audiovisual", e.target.checked)} className="w-4 h-4 accent-green-700" />
                Audiovisual
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.podium} onChange={(e) => set("podium", e.target.checked)} className="w-4 h-4 accent-green-700" />
                Podium
              </label>
              <div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.stage} onChange={(e) => set("stage", e.target.checked)} className="w-4 h-4 accent-green-700" />
                  Stage
                </label>
                {form.stage && (
                  <input className={inputClass + " mt-1 ml-6 w-auto"} placeholder="How big?" value={form.stageSize} onChange={(e) => set("stageSize", e.target.value)} />
                )}
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.parking} onChange={(e) => set("parking", e.target.checked)} className="w-4 h-4 accent-green-700" />
                Parking
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.telecomDevices} onChange={(e) => set("telecomDevices", e.target.checked)} className="w-4 h-4 accent-green-700" />
                Telecommunication Devices
              </label>
            </div>
            <div className="space-y-2">
              <div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.tablesNeeded} onChange={(e) => set("tablesNeeded", e.target.checked)} className="w-4 h-4 accent-green-700" />
                  Tables
                </label>
                {form.tablesNeeded && (
                  <div className="ml-6 mt-1">
                    <p className="text-xs text-gray-500 mb-1">Type (select one):</p>
                    <div className="flex gap-3">
                      {["4ft", "6ft", "8ft", "Round"].map((t) => (
                        <label key={t} className="flex items-center gap-1 text-sm cursor-pointer">
                          <input type="radio" name="tableType" value={t} checked={form.tableType === t} onChange={() => set("tableType", t)} className="accent-green-700" />
                          {t}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.registrationTable} onChange={(e) => set("registrationTable", e.target.checked)} className="w-4 h-4 accent-green-700" />
                Registration Table
              </label>
              <div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.chairs} onChange={(e) => set("chairs", e.target.checked)} className="w-4 h-4 accent-green-700" />
                  Chairs
                </label>
                {form.chairs && (
                  <input className={inputClass + " mt-1 ml-6 w-32"} type="number" min="1" placeholder="How many?" value={form.chairCount} onChange={(e) => set("chairCount", e.target.value)} />
                )}
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.lighting} onChange={(e) => set("lighting", e.target.checked)} className="w-4 h-4 accent-green-700" />
                Lighting
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.pipeDrape} onChange={(e) => set("pipeDrape", e.target.checked)} className="w-4 h-4 accent-green-700" />
                Pipe &amp; Drape
              </label>
              <div>
                <label className={labelClass}>Other:</label>
                <input className={inputClass} value={form.otherServices} onChange={(e) => set("otherServices", e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature notice */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-sm text-gray-600 mb-6">
        <p>
          * By submitting this form you are agreeing to the General Rules &amp; Regulations that governs space requests in the Office of Meetings &amp; Events.
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Your electronic submission serves as your signature. The workflow will collect approval signatures from your Advisor (if applicable), Director of Student Affairs, and the Office Coordinator.
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-2 bg-[#006633] text-white rounded-lg text-sm font-semibold hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </form>
  )
}
