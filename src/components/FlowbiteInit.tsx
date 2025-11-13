'use client'

import { useEffect } from 'react'

export default function FlowbiteInit() {
  useEffect(() => {
    // Import Flowbite JavaScript dynamically
    import('flowbite')
  }, [])

  return null
}
