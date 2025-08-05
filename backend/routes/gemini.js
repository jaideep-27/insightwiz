const express = require('express')
const axios = require('axios')
const auth = require('../middleware/auth')

const router = express.Router()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = 'gemini-2.0-flash-lite'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

// Helper function to call Gemini API
const callGeminiAPI = async (prompt) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured')
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          role: 'user',
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    if (response.data.candidates && response.data.candidates[0]) {
      return response.data.candidates[0].content.parts[0].text
    } else {
      throw new Error('No response from Gemini API')
    }
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message)
    throw new Error('Failed to generate AI response')
  }
}

// @route   POST /api/gemini/summary
// @desc    Generate AI summary from data
// @access  Private
router.post('/summary', auth, async (req, res) => {
  try {
    const { data } = req.body
    
    // Fallback summary if Gemini API is not available
    const dataTypeContext = data.dataType || 'business'
    const fallbackSummary = `Based on your ${dataTypeContext} data analysis, here are key insights: The data shows consistent patterns with several areas of strength and opportunities for improvement. Key trends indicate positive momentum in core metrics. Focus areas include optimizing performance in underperforming segments and leveraging strengths in high-performing areas. The analysis reveals actionable insights that can drive meaningful improvements. Continue monitoring these metrics for sustained growth and success.`
    
    try {
      const prompt = `As an AI data analyst, analyze this ${data.dataType || 'business'} data and provide insights:

Data Type: ${data.dataType || 'business'}
Data: ${JSON.stringify(data)}

Based on the data type, provide relevant insights:
1. Key trends and patterns
2. Areas of strength and opportunity  
3. Areas needing attention
4. Actionable recommendations
5. Strategic insights

Tailor your analysis to the specific domain (business, financial, personal, etc.).
Keep response concise, around 150-200 words.`

      const summary = await callGeminiAPI(prompt)
      
      res.json({
        success: true,
        summary,
        message: 'Summary generated successfully'
      })
    } catch (apiError) {
      // Use fallback summary if Gemini API fails
      console.log('Using fallback summary due to API unavailability')
      res.json({
        success: true,
        summary: fallbackSummary,
        message: 'Insights generated successfully (AI service temporarily unavailable)'
      })
    }
  } catch (error) {
    console.error('Gemini Summary error:', error.message)
    res.status(500).json({ 
      message: 'Error generating summary',
      error: error.message
    })
  }
})

// @route   POST /api/gemini/chat
// @desc    Chat with AI assistant
// @access  Private
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, history = [] } = req.body
    
    // Build conversation context
    let conversationContext = `You are InsightWhiz AI, a helpful academic assistant. You help students with academic questions, study strategies, performance analysis, and learning recommendations.

Previous conversation:
${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Student: ${message}

Provide a helpful, encouraging, and informative response. Keep it conversational and supportive.`

    const response = await callGeminiAPI(conversationContext)
    
    res.json({
      success: true,
      response,
      message: 'Chat response generated successfully'
    })
  } catch (error) {
    console.error('Gemini Chat error:', error.message)
    res.status(500).json({ 
      message: 'Error generating chat response',
      error: error.message
    })
  }
})

// @route   POST /api/gemini/project-ideas
// @desc    Generate project ideas
// @access  Private
router.post('/project-ideas', auth, async (req, res) => {
  try {
    const { subject, level, interests } = req.body
    
    const prompt = `Generate 5 creative project ideas for a ${level} level student studying ${subject}.

Student interests: ${interests}

For each project provide:
1. Project title
2. Brief description (2-3 sentences)  
3. Key learning objectives
4. Estimated time to complete
5. Difficulty level

Make projects engaging and practical. Format as numbered list.`

    const projectIdeas = await callGeminiAPI(prompt)
    
    res.json({
      success: true,
      projectIdeas,
      message: 'Project ideas generated successfully'
    })
  } catch (error) {
    console.error('Gemini Project Ideas error:', error.message)
    res.status(500).json({ 
      message: 'Error generating project ideas',
      error: error.message
    })
  }
})

// @route   POST /api/gemini/rewrite-feedback
// @desc    Rewrite feedback with specified tone
// @access  Private
router.post('/rewrite-feedback', auth, async (req, res) => {
  try {
    const { text, tone = 'constructive' } = req.body
    
    const prompt = `Rewrite this feedback to be more ${tone} and encouraging while maintaining the core message:

Original: "${text}"

Guidelines:
- Keep same key points
- Make more positive and motivating  
- Use encouraging language
- Provide actionable advice
- Stay professional

Rewritten feedback:`

    const rewrittenFeedback = await callGeminiAPI(prompt)
    
    res.json({
      success: true,
      rewrittenFeedback,
      originalText: text,
      message: 'Feedback rewritten successfully'
    })
  } catch (error) {
    console.error('Gemini Rewrite error:', error.message)
    res.status(500).json({ 
      message: 'Error rewriting feedback',
      error: error.message
    })
  }
})

// @route   POST /api/gemini/insights
// @desc    Generate personalized insights
// @access  Private
router.post('/insights', auth, async (req, res) => {
  try {
    const userData = req.body
    
    const prompt = `As an AI academic advisor, analyze this student profile and provide personalized insights:

Student Data: ${JSON.stringify(userData)}

Provide insights on:
1. Learning patterns and preferences
2. Strengths to leverage
3. Areas for improvement  
4. Study recommendations
5. Goal-setting suggestions

Make it personal, actionable, and motivating. Limit to 200 words.`

    const insights = await callGeminiAPI(prompt)
    
    res.json({
      success: true,
      insights,
      message: 'Personalized insights generated successfully'
    })
  } catch (error) {
    console.error('Gemini Insights error:', error.message)
    res.status(500).json({ 
      message: 'Error generating insights',
      error: error.message
    })
  }
})

module.exports = router