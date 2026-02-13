'use client'

import { Bookmark } from '@/lib/types'
import { Trash2, ExternalLink, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function BookmarkItem({ bookmark }: { bookmark: Bookmark }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await supabase.from('bookmarks').delete().eq('id', bookmark.id)
            router.refresh()
        } catch (error) {
            console.error('Error deleting:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
            <div className="flex items-center gap-4 overflow-hidden">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Globe size={20} />
                </div>
                <div className="min-w-0">
                    <h3 className="truncate font-medium text-gray-900">
                        {bookmark.title}
                    </h3>
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 hover:underline truncate"
                    >
                        {new URL(bookmark.url).hostname}
                        <ExternalLink size={12} />
                    </a>
                </div>
            </div>

            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 transition-all rounded-lg hover:bg-red-50 focus:opacity-100"
                aria-label="Delete bookmark"
                title="Delete"
            >
                <Trash2 size={18} />
            </button>
        </div>
    )
}
