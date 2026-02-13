'use client'

import { Bookmark } from '@/lib/types'
import { BookmarkItem } from './bookmark-item'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        // Sync local state with initialBookmarks when they change (e.g. from server action revalidate)
        setBookmarks(initialBookmarks)
    }, [initialBookmarks])

    useEffect(() => {
        const channel = supabase
            .channel('realtime bookmarks')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'bookmarks'
            }, (payload) => {
                console.log('Change received!', payload)
                router.refresh() // This will trigger a server re-fetch, keeping data consistent

                // Optimistic updates for faster UI
                if (payload.eventType === 'INSERT') {
                    const newBookmark = payload.new as Bookmark
                    setBookmarks((prev) => {
                        if (prev.some(b => b.id === newBookmark.id)) {
                            return prev
                        }
                        return [newBookmark, ...prev]
                    })
                } else if (payload.eventType === 'DELETE') {
                    setBookmarks((prev) => prev.filter(b => b.id !== payload.old.id))
                }
                // We could handle UPDATE here too if we implemented editing
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, router])

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No bookmarks yet. Add one above!
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {bookmarks.map((bookmark) => (
                <BookmarkItem key={bookmark.id} bookmark={bookmark} />
            ))}
        </div>
    )
}
