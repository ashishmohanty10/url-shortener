'use server'

import { env } from '@/lib/env'
import { requireAuth } from '@/utils/auth-guard'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAi = new GoogleGenerativeAI(env.NEXT_PUBLIC_GEMINI_API_KEY)

export type UrlSafetyCheck = {
  isSafe: boolean
  flagged: boolean
  reason: string | ''
  category: 'safe' | 'suspicious' | 'malicious' | 'inappropriate' | 'unknown'
  confidence: 'high' | 'medium' | 'low'
}

export async function checkUrlSafetyAction(url: string) {
  await requireAuth() // comment this when running seed.ts
  try {
    try {
      new URL(url)
    } catch (error) {
      return {
        success: false,
        error: error as string,
      }
    }

    const model = genAi.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `
    Return ONLY valid JSON. No markdown, no backticks, no commentary.
    Analyze this URL for safety: ${url}

    Consider the following criteria:
    1. Is it a known site?
    2. Does it contain malware or suspicious redirects?
    3. Is is associated with phishing or fraud?
    4. Is it associated with inappropriate or offensive content?
    5. Is the domain suspicious or newly registered?


    Response in JSON format with the following structure:
    {
      "isSafe": boolean,
      "flagged": boolean,
      "reason": string or '',
      "category": "safe" | "suspicious" | "malicious" | "inappropriate" | "unknown",
      "confidence": "high" | "medium" | "low"
    }

    Example response:
    {
      "isSafe": true,
      "flagged": false,
      "reason": "The url is safe",
      "category": "safe",
      "confidence": "high"
    }`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    const cleaned = text.replace(/```(\w+)?/g, '').trim()
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      return {
        success: false,
        error: 'Invalid response format',
      }
    }

    const jsonResponse = JSON.parse(jsonMatch[0]) as UrlSafetyCheck

    return {
      success: true,
      data: jsonResponse,
    }
  } catch (error) {
    return {
      success: false,
      error: error as string,
    }
  }
}
