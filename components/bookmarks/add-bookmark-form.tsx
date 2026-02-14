'use client'

import { useActionState } from 'react'
import { addBookmark } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus } from 'lucide-react'
import { useEffect, useRef } from 'react'

const initialState = {
    message: '',
    errors: undefined,
}

export function AddBookmarkForm() {
    const [state, formAction, isPending] = useActionState(addBookmark, initialState)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state.message === 'Success') {
            formRef.current?.reset()
        }
    }, [state])

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-gray-900">Add New Bookmark</h3>
            <form ref={formRef} action={formAction} className="space-y-4">

                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
                    <Input
                        id="title"
                        name="title"
                        placeholder="e.g. My Favorite Blog"
                        aria-describedby="title-error"
                        disabled={isPending}
                        className="bg-gray-50 placeholder:text-gray-400 text-gray-900 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-indigo-500 border-gray-200"
                    />
                    {state.errors?.title && (
                        <p id="title-error" className="text-sm text-red-500">
                            {state.errors.title}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="url" className="text-sm font-medium text-gray-700">URL</label>
                    <Input
                        id="url"
                        name="url"
                        placeholder="https://example.com"
                        aria-describedby="url-error"
                        disabled={isPending}
                        className="bg-gray-50 placeholder:text-gray-400 text-gray-900 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-indigo-500 border-gray-200"
                    />
                    {state.errors?.url && (
                        <p id="url-error" className="text-sm text-red-500">
                            {state.errors.url}
                        </p>
                    )}
                </div>

                <Button type="submit" disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Plus className="mr-2 h-4 w-4" />
                    )}
                    Add Bookmark
                </Button>

                {state.message && state.message !== 'Success' && (
                    <p className="text-sm text-red-500 text-center">{state.message}</p>
                )}
            </form>
        </div>
    )
}
