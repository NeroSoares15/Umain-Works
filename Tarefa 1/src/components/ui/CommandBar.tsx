import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, UserSearch } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../contexts/useAppContext'

export function CommandBar() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [isThinking, setIsThinking] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const focusTimeoutRef = useRef<number | null>(null)
    const resultTimeoutRef = useRef<number | null>(null)
    const navigate = useNavigate()
    const { activeProfileId } = useAppContext()

    const clearTimers = () => {
        if (focusTimeoutRef.current) {
            window.clearTimeout(focusTimeoutRef.current)
            focusTimeoutRef.current = null
        }
        if (resultTimeoutRef.current) {
            window.clearTimeout(resultTimeoutRef.current)
            resultTimeoutRef.current = null
        }
    }

    const closeCommandBar = () => {
        clearTimers()
        setIsOpen(false)
        setQuery('')
        setShowResult(false)
        setIsThinking(false)
    }

    useEffect(() => {
        const resetCommandBar = () => {
            clearTimers()
            setIsOpen(false)
            setQuery('')
            setShowResult(false)
            setIsThinking(false)
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                if (isOpen) {
                    resetCommandBar()
                    return
                }

                clearTimers()
                setIsOpen(true)
                setShowResult(false)
                setIsThinking(false)
            }
            if (e.key === 'Escape') resetCommandBar()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) {
            return
        }

        focusTimeoutRef.current = window.setTimeout(() => inputRef.current?.focus(), 100)

        return () => {
            clearTimers()
        }
    }, [isOpen])

    const resultCopy = activeProfileId === 'sas'
        ? {
            description: 'Encontrei 2 estudantes em risco prioritário. O caso mais urgente é o de Pedro Santos, com score de risco elevado, baixa assiduidade e atraso financeiro continuado.',
            route: '/students/4',
            title: 'Investigação Prioritária',
        }
        : {
            description: 'Identifiquei 2 estudantes prioritários com sinais combinados de assiduidade crítica e desengajamento digital. O caso mais urgente exige articulação com os SAS para validar fatores sensíveis.',
            route: '/students/4',
            title: 'Caso Prioritário',
        }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        clearTimers()
        setIsThinking(true)
        setShowResult(false)

        resultTimeoutRef.current = window.setTimeout(() => {
            setIsThinking(false)
            setShowResult(true)
        }, 1500)
    }

    const navigateToAlert = () => {
        closeCommandBar()
        navigate(resultCopy.route)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-umain-background/80 backdrop-blur-sm"
                        onClick={closeCommandBar}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="w-full max-w-2xl bg-umain-surface/90 backdrop-blur-2xl border border-umain-border/80 rounded-2xl shadow-2xl overflow-hidden relative z-10 mx-4"
                    >
                        {/* Glow effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-umain-accent to-transparent opacity-50" />

                        <form onSubmit={handleSubmit} className="relative border-b border-umain-border/50">
                            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-umain-accent/70" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Exemplo: 'Mostra-me estudantes em risco crítico devido a propinas...'"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-transparent border-0 text-white placeholder:text-umain-text-muted px-12 py-5 focus:outline-none focus:ring-0 text-lg"
                            />
                            <button type="button" onClick={closeCommandBar} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-umain-text-muted hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </form>

                        <AnimatePresence mode="wait">
                            {!isThinking && !showResult && (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="px-4 py-3 flex items-center justify-between text-xs text-umain-text-muted"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="px-1.5 py-0.5 rounded bg-umain-background border border-umain-border">ESC</span> para fechar
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-1.5 py-0.5 rounded bg-umain-accent/20 text-umain-accent border border-umain-accent/30 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Powered by RiskRadar AI
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            {isThinking && (
                                <motion.div
                                    key="thinking"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="px-6 py-12 flex flex-col items-center justify-center gap-4"
                                >
                                    <div className="relative w-12 h-12 flex items-center justify-center">
                                        <div className="absolute inset-0 border-2 border-umain-border rounded-full" />
                                        <div className="absolute inset-0 border-2 border-umain-accent rounded-full border-t-transparent animate-spin" />
                                        <Sparkles className="w-5 h-5 text-umain-accent animate-pulse" />
                                    </div>
                                    <p className="text-sm font-medium text-umain-text-muted animate-pulse">A analisar a base de dados de estudantes...</p>
                                </motion.div>
                            )}

                            {showResult && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4"
                                >
                                    <div className="p-4 rounded-xl border border-umain-accent/20 bg-umain-accent/5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-umain-accent/10 border border-umain-accent/20 flex items-center justify-center shrink-0">
                                                <Sparkles className="w-5 h-5 text-umain-accent" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-white font-medium mb-1">{resultCopy.title}</p>
                                                <p className="text-sm text-umain-text-muted leading-relaxed mb-4">
                                                    {resultCopy.description}
                                                </p>
                                                <button
                                                    onClick={navigateToAlert}
                                                    className="w-full sm:w-auto px-4 py-2 bg-umain-accent text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-umain-accent/90 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <UserSearch className="w-4 h-4" /> Abrir Caso Prioritário
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
