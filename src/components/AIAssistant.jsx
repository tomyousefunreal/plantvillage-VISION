import { useState, useRef, useEffect } from 'react'

// API URL
const API_URL = ''

function AIAssistant({ diagnosis, onClose, appLanguage, setAppLanguage }) {
    const language = appLanguage
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)

    const messagesEndRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const audioChunksRef = useRef([])
    const audioRef = useRef(null)

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Add initial greeting when component mounts or diagnosis changes
    useEffect(() => {
        if (diagnosis) {
            const greeting = language === 'ar'
                ? `مرحباً! لقد اكتشفت أن هذا النبات هو **${diagnosis.plant_ar}** والحالة هي **${diagnosis.disease_ar}** بنسبة ثقة ${diagnosis.confidence}%. كيف يمكنني مساعدتك؟`
                : `Hello! I detected this is a **${diagnosis.plant}** plant with condition: **${diagnosis.disease}** (${diagnosis.confidence}% confidence). How can I help you?`

            setMessages([{
                role: 'assistant',
                content: greeting
            }])
        } else {
            const greeting = language === 'ar'
                ? 'مرحباً! أنا مساعدك الزراعي. كيف يمكنني مساعدتك اليوم؟'
                : 'Hello! I\'m your plant health assistant. How can I help you today?'

            setMessages([{
                role: 'assistant',
                content: greeting
            }])
        }
    }, [diagnosis, language])

    // Toggle language
    const toggleLanguage = () => {
        setAppLanguage(prev => prev === 'en' ? 'ar' : 'en')
        setMessages([]) // Reset messages when changing language
    }

    // Send message to AI
    const sendMessage = async (text = inputText) => {
        if (!text.trim() || isLoading) return

        const userMessage = { role: 'user', content: text }
        setMessages(prev => [...prev, userMessage])
        setInputText('')
        setIsLoading(true)

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    language: language,
                    diagnosis: diagnosis || null
                })
            })

            if (!response.ok) throw new Error('Failed to get response')

            const data = await response.json()
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
        } catch (error) {
            console.error('Chat error:', error)
            const errorMsg = language === 'ar'
                ? 'عذراً، حدث خطأ. حاول مرة أخرى.'
                : 'Sorry, an error occurred. Please try again.'
            setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }])
        } finally {
            setIsLoading(false)
        }
    }

    // --- Browser Native TTS ---

    // Stop speaking when component unmounts or closes
    useEffect(() => {
        return () => window.speechSynthesis.cancel()
    }, [])

    const speakText = (text) => {
        // If already speaking, stop it
        if (isPlaying) {
            window.speechSynthesis.cancel()
            setIsPlaying(false)
            return
        }

        // Clean text (remove asterisks used for bold markdown)
        const cleanText = text.replace(/\*/g, '')

        const utterance = new SpeechSynthesisUtterance(cleanText)
        utterance.lang = appLanguage === 'ar' ? 'ar-SA' : 'en-US'
        utterance.rate = 1.0
        utterance.pitch = 1.0

        // Handle events
        utterance.onstart = () => setIsPlaying(true)
        utterance.onend = () => setIsPlaying(false)
        utterance.onerror = (err) => {
            console.error('TTS Error:', err)
            setIsPlaying(false)
        }

        // Try to pick a good voice
        const voices = window.speechSynthesis.getVoices()
        const preferredVoice = voices.find(voice =>
            voice.lang.includes(appLanguage === 'ar' ? 'ar' : 'en')
        )
        if (preferredVoice) utterance.voice = preferredVoice

        window.speechSynthesis.speak(utterance)
    }

    // Start recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data)
            }

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
                stream.getTracks().forEach(track => track.stop())
                await transcribeAudio(audioBlob)
            }

            mediaRecorder.start()
            setIsRecording(true)
        } catch (error) {
            console.error('Recording error:', error)
            const errorMsg = appLanguage === 'ar'
                ? 'لا يمكن الوصول للميكروفون'
                : 'Cannot access microphone'
            alert(errorMsg)
        }
    }

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }
    }

    // Transcribe audio
    const transcribeAudio = async (audioBlob) => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('file', audioBlob, 'recording.wav')
            formData.append('language', language)

            const response = await fetch(`${API_URL}/stt`, {
                method: 'POST',
                body: formData
            })

            if (!response.ok) throw new Error('STT failed')

            const data = await response.json()
            if (data.transcription) {
                // Automatically send the transcribed message
                await sendMessage(data.transcription)
            }
        } catch (error) {
            console.error('STT error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Handle Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    // Quick action buttons based on diagnosis
    const getQuickActions = () => {
        if (!diagnosis) return []

        if (language === 'ar') {
            return diagnosis.is_healthy ? [
                'كيف أحافظ على صحة النبات؟',
                'ما هي أفضل طريقة للري؟',
                'متى أقوم بالتسميد؟'
            ] : [
                'ما هو العلاج المناسب؟',
                'هل المرض معدي؟',
                'كيف أمنع انتشاره؟',
                'ما هي البدائل الطبيعية؟'
            ]
        } else {
            return diagnosis.is_healthy ? [
                'How to maintain plant health?',
                'Best watering practices?',
                'When to fertilize?'
            ] : [
                'What is the best treatment?',
                'Is this disease contagious?',
                'How to prevent spreading?',
                'What are organic alternatives?'
            ]
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <audio ref={audioRef} className="hidden" />

            <div className={`bg-slate-900/95 rounded-3xl border border-emerald-500/30 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden ${language === 'ar' ? 'rtl' : 'ltr'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-emerald-500/20 bg-emerald-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                            <span className="text-xl">🌿</span>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">
                                {language === 'ar' ? 'سنبلة' : 'Sonbola AI'}
                            </h3>
                            <p className="text-emerald-300 text-sm">
                                {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'AI-Powered'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold hover:bg-emerald-500/30 transition-colors flex items-center gap-2"
                        >
                            <span className="text-lg">{language === 'ar' ? '🇬🇧' : '🇸🇦'}</span>
                            <span className="text-sm">{language === 'ar' ? 'English' : 'العربية'}</span>
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user'
                                ? 'bg-emerald-500/30 text-white'
                                : 'bg-white/10 text-emerald-50'
                                }`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>

                                {/* Speak button for assistant messages */}
                                {msg.role === 'assistant' && (
                                    <button
                                        onClick={() => speakText(msg.content)}
                                        className="mt-2 p-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors text-sm flex items-center gap-1"
                                    >
                                        <span>{isPlaying ? '⏹️' : '🔊'}</span>
                                        <span>{language === 'ar' ? 'استمع' : 'Listen'}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white/10 rounded-2xl p-4 text-emerald-300">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length <= 1 && getQuickActions().length > 0 && (
                    <div className="px-4 pb-2">
                        <p className="text-emerald-400 text-sm mb-2">
                            {language === 'ar' ? 'أسئلة سريعة:' : 'Quick questions:'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {getQuickActions().map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => sendMessage(action)}
                                    className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-sm hover:bg-emerald-500/30 transition-colors"
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-emerald-500/20 bg-black/20">
                    <div className="flex items-center gap-3">
                        {/* Voice Record Button */}
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`p-3 rounded-full transition-all ${isRecording
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                }`}
                            disabled={isLoading}
                        >
                            {isRecording ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <rect x="6" y="6" width="12" height="12" rx="2" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            )}
                        </button>

                        {/* Text Input */}
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={language === 'ar' ? 'اكتب سؤالك هنا...' : 'Type your question here...'}
                            className="flex-1 bg-white/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400 transition-colors"
                            disabled={isLoading || isRecording}
                        />

                        {/* Send Button */}
                        <button
                            onClick={() => sendMessage()}
                            className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-colors disabled:opacity-50"
                            disabled={isLoading || !inputText.trim() || isRecording}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>

                    {isRecording && (
                        <p className="text-red-400 text-sm mt-2 text-center animate-pulse">
                            {language === 'ar' ? '🎙️ جاري التسجيل... اضغط للإيقاف' : '🎙️ Recording... Click to stop'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AIAssistant
