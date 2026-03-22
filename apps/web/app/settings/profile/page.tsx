'use client'

import { useState, useEffect } from 'react'
import { Breadcrumb } from '@/components/layout/breadcrumb'

const REGIONS = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']
const EMPLOYMENT_OPTIONS = [
  { value: 'JOB_SEEKER', label: '구직 중' },
  { value: 'EMPLOYED', label: '재직 중' },
  { value: 'STUDENT', label: '학생' },
  { value: 'SELF_EMPLOYED', label: '자영업' },
]

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/v1/users/me')
      .then(r => r.json())
      .then(json => {
        if (json.success) setUser(json.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/v1/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
      const json = await res.json()
      if (json.success) {
        setMessage('저장되었습니다')
        setUser(json.data)
      }
    } catch {
      setMessage('저장에 실패했습니다')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="h-64 rounded-2xl bg-slate-200" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Breadcrumb items={[
        { label: '설정', href: '/settings/profile' },
        { label: '프로필' },
      ]} />

      <h1 className="mb-6 text-2xl font-bold text-slate-900">프로필 설정</h1>

      <form onSubmit={handleSave} className="rounded-2xl border border-white/20 bg-white/70 p-8 shadow-xl backdrop-blur-xl">
        {message && (
          <div className={`mb-4 rounded-lg p-3 text-sm ${message.includes('실패') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">이메일</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">나이</label>
          <input
            type="number"
            value={user?.age || ''}
            onChange={e => setUser({ ...user, age: parseInt(e.target.value) || 0 })}
            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">지역</label>
          <select
            value={user?.region || ''}
            onChange={e => setUser({ ...user, region: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">고용 상태</label>
          <select
            value={user?.employmentStatus || ''}
            onChange={e => setUser({ ...user, employmentStatus: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {EMPLOYMENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={user?.isSelfEmployed || false}
              onChange={e => setUser({ ...user, isSelfEmployed: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm text-slate-700">자영업자</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl disabled:opacity-50"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </form>
    </div>
  )
}
