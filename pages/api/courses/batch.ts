import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'
import { v4 } from 'uuid'

const ratelimit = new Ratelimit({
  redis: kv,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(5, '10 s'),
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
            console.log('limit', limit, reset, remaining)

            if (remaining < 1) {
                return new Response(JSON.stringify({ 
                    error: { message: `Rate limit exceeded` }
                 }), {
                    status: 429
                })
            }

            const cursos  = await request.json()

            if (!cursos || !cursos.length) {
                return  new Response(JSON.stringify({ 
                  error: { message: `Invalid payload` }
                }), {
                  status: 400
                })
            }

            if (cursos.length > 100) {
                return  new Response(JSON.stringify({ 
                  error: { message: `Max 100 courses` }
                }), {
                  status: 400
                })
            }

            const cursosFilled = cursos.map(async (curso: any) => {
              if (!curso || !curso.email || !curso.curso) {
                throw new Error('Invalid payload')
              }

              return  {...curso, curso_enroll_id: v4()}
            })


            return new Response(JSON.stringify({
                message: 'Enrolled',
                data: cursosFilled
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
