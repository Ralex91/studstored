"use client"
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"

const queryClient = new QueryClient()

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div>{children}</div>
      <Toaster />
    </QueryClientProvider>
  )
}
