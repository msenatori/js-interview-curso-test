import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'
import { v4 } from 'uuid'

const ratelimit = new Ratelimit({
  redis: kv,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(5, '1 s'),
})

export const config = {
  runtime: 'edge',
}

export default async function handler(request: NextRequest) {
    try {
        switch (request.method) {
          case 'POST': {
            // You could alternatively limit based on user ID or similar
            const ip = request.ip ?? '127.0.0.1'
            const { limit, reset, remaining } = await ratelimit.limit(ip)

            const estudiante  = await request.json()

            if (!estudiante || !estudiante.email || !estudiante.curso) {
                return  new Response(JSON.stringify({ 
                  error: { message: `Invalid payload` }
               }), {
                  status: 400
              })
            }
        
            const enrolled =  {...estudiante, curso_enroll_id: v4()}

            return new Response(JSON.stringify({
                message: 'Enrolled',
                data: enrolled
              }), {
                status: 200,
                headers: {
                'X-RateLimit-Limit': limit.toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': reset.toString(),
                },
            })
          }
        }
    } catch (err) {
        console.error(err)
        new Response(JSON.stringify({ 
            error: { message: `An error ocurred, ${err}` }
         }), {
            status: 500
        })
    }

  
}
