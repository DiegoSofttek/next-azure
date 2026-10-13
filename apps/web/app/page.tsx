import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { LogoutButton } from "./_components/logout-button"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <div className="mt-2 flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/reference">Go to reference</Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
}
