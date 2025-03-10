import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex items-center justify-center h-full p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to HIMTALKS</CardTitle>
          <CardDescription>View messages and song confessions from UNSIKA students</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button asChild className="w-full">
            <Link href="/messages">View Messages</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/songfess">View Songfess</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
