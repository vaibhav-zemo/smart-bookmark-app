import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AddBookmarkForm } from '@/components/bookmarks/add-bookmark-form'
import { BookmarkList } from '@/components/bookmarks/bookmark-list'
import { LogOut, Bookmark as BookmarkIcon } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600">
              <BookmarkIcon className="h-6 w-6" />
              <span className="text-xl font-bold text-gray-900 tracking-tight">Smart Bookmark</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">
                {user.email}
              </span>
              <form action="/auth/signout" method="post">
                <button
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  title="Sign out"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-[350px,1fr]">
          {/* Sidebar - Add Form */}
          <div className="lg:sticky lg:top-24 h-fit">
            <AddBookmarkForm />
          </div>

          {/* Main Column - List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Your Bookmarks</h2>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                {bookmarks?.length || 0} items
              </span>
            </div>
            <BookmarkList initialBookmarks={bookmarks || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
