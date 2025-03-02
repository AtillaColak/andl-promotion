"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"

export default function WaitlistSignup() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
  })
  const [isDark, setIsDark] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const formRef = useRef<HTMLDivElement>(null)
  
  // Remove the MutationObserver that's causing re-renders and focus loss
  useEffect(() => {
    const checkDarkMode = () => document.documentElement.classList.contains("dark");
    setIsDark(checkDarkMode());
    
    // Instead of using a MutationObserver, check dark mode on a less frequent interval
    // This prevents constant re-renders that cause input focus loss
    const darkModeCheckInterval = setInterval(() => {
      const newIsDark = checkDarkMode();
      setIsDark((prev) => (prev !== newIsDark ? newIsDark : prev));
    }, 1000); // Check once per second instead of on every DOM change
    
    return () => clearInterval(darkModeCheckInterval);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "name" && !value.trim()) {
      error = "Full name is required";
    } else if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Email is invalid";
      }
    }
    return error;
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    Object.entries(formState).forEach(([key, value]) => {
      if (key === "name" || key === "email") {  // Only validate required fields
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setTouched({
      name: true,
      email: true,
      organization: false,
      role: false,
    })
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Replace with your actual Google Form submission URL and field IDs
      const googleFormId = "YOUR_GOOGLE_FORM_ID"
      const formData = new FormData()

      // Map your form fields to Google Form entry IDs
      formData.append("entry.123456789", formState.name)
      formData.append("entry.987654321", formState.email)
      formData.append("entry.456789123", formState.organization)
      formData.append("entry.789123456", formState.role)

      // Submit to Google Form
      await fetch(`https://docs.google.com/forms/d/e/${googleFormId}/formResponse`, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      })

      setIsSubmitted(true)
      setFormState({ name: "", email: "", organization: "", role: "" })
      setTouched({})
      setErrors({})
    } catch (err) {
      setErrors({ form: "Something went wrong. Please try again." })
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Simplified mouse effect that doesn't cause re-renders on every mouse movement
  function MouseMoveEffect() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const positionRef = useRef({ x: 0, y: 0 })
    const requestRef = useRef<number>()
    
    useEffect(() => {
      const container = formRef.current
      if (!container) return
      
      const handleMouseMove = (event: MouseEvent) => {
        const rect = container.getBoundingClientRect()
        positionRef.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        }
      }
      
      const updateMousePosition = () => {
        // Only update state if position changed significantly (reduces renders)
        const dx = Math.abs(positionRef.current.x - mousePosition.x)
        const dy = Math.abs(positionRef.current.y - mousePosition.y)
        
        if (dx > 5 || dy > 5) {
          setMousePosition(positionRef.current)
        }
        
        requestRef.current = requestAnimationFrame(updateMousePosition)
      }
      
      container.addEventListener("mousemove", handleMouseMove)
      requestRef.current = requestAnimationFrame(updateMousePosition)
      
      return () => {
        container.removeEventListener("mousemove", handleMouseMove)
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
        }
      }
    }, [mousePosition.x, mousePosition.y])

    return (
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(139,92,246,0.15), transparent 80%)`,
        }}
      />
    )
  }

  const InputField = ({
    name,
    label,
    type = "text",
    required = false,
    placeholder = "",
  }: { name: keyof typeof formState; label: string; type?: string; required?: boolean; placeholder?: string }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formState[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`w-full px-4 py-2 rounded-lg border ${
          touched[name] && errors[name] ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent outline-none transition-all duration-200`}
        placeholder={placeholder}
      />
      {touched[name] && errors[name] && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors[name]}
        </p>
      )}
    </div>
  )

  return (
    <div
      ref={formRef}
      className="relative w-full max-w-md mx-auto overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F2937] shadow-lg transition-all duration-300"
    >
      {isDark && <MouseMoveEffect />}

      <div className="relative z-10 p-8">
        <h2 className="text-2xl font-bold mb-6 text-[#111827] dark:text-[#F9FAFB] text-center">Join Our Waitlist</h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField name="name" label="Full Name" required placeholder="John Doe" />
            <InputField name="email" label="Email Address" type="email" required placeholder="you@example.com" />
            <InputField name="organization" label="Organization" placeholder="Company or School" />

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Role
              </label>
              <select
                id="role"
                name="role"
                value={formState.role}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent outline-none transition-all duration-200"
              >
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="administrator">Administrator</option>
                <option value="other">Other</option>
              </select>
            </div>

            {errors.form && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.form}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 text-lg border-2 border-[#636FF6] dark:border-[#3B82F6] bg-transparent hover:bg-[#636FF6]/10 dark:hover:bg-[#3B82F6]/10 text-[#111827] dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Submitting...
                </span>
              ) : (
                "Join Waitlist"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#8B5CF6]" />
            <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] mb-2">Thank you for joining!</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We'll keep you updated on our progress and let you know when we're ready to launch.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-6 py-2 px-4 rounded-full font-medium text-sm text-[#8B5CF6] hover:text-[#7C3AED] dark:text-[#A78BFA] dark:hover:text-[#C4B5FD] transition-colors"
            >
              Submit another response
            </button>
          </div>
        )}
      </div>
    </div>
  )
}