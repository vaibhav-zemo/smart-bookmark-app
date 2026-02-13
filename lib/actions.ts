'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    url: z.string().url('Must be a valid URL'),
})

export async function addBookmark(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title')
    const url = formData.get('url')

    const validatedFields = schema.safeParse({
        title,
        url,
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Bookmark.',
        }
    }

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { message: 'Unauthorized' }
    }

    try {
        const { error } = await supabase.from('bookmarks').insert({
            title: validatedFields.data.title,
            url: validatedFields.data.url,
            user_id: user.id
        })

        if (error) {
            console.error('DB Error:', error)
            return { message: 'Database Error: Failed to Create Bookmark.' }
        }
    } catch (error) {
        return { message: 'Failed to Create Bookmark.' }
    }

    revalidatePath('/')
    return { message: 'Success' }
}
