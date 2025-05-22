'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function SignupPage() {
  const [userType, setUserType] = useState<'individual' | 'business'>('individual')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    name: ''
  })

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          user_type: userType,
          phone: formData.phone,
          full_name: formData.name
        }
      }
    })

    if (authError) {
      alert(`Signup error: ${authError.message}`)
      return
    }

    // Create profile entry
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user?.id,
        role: userType,
        phone: formData.phone,
        ...(userType === 'individual' ? {
          full_name: formData.name
        } : {
          business_name: formData.name
        })
      }])

    if (profileError) {
      alert(`Profile creation error: ${profileError.message}`)
      return
    }

    // Redirect to KYC
    window.location.href = '/kyc'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Create Account</h2>
        
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setUserType('individual')}
            className={`flex-1 py-2 rounded ${
              userType === 'individual' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Individual
          </button>
          <button
            type="button"
            onClick={() => setUserType('business')}
            className={`flex-1 py-2 rounded ${
              userType === 'business' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Business
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {userType === 'individual' ? 'Full Name' : 'Business Name'}
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone (MPESA)</label>
            <input
              type="tel"
              required
              pattern="^\+?[0-9]{10,15}$"
              className="w-full px-4 py-2 border rounded-lg"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full px-4 py-2 border rounded-lg"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  )
}