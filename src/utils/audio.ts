class AudioFeedback {
  private audioContext?: AudioContext
  private gainNode?: GainNode
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio()
    }
  }
  
  private async initAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.gainNode = this.audioContext.createGain()
      this.gainNode.gain.value = 0.1
      this.gainNode.connect(this.audioContext.destination)
    } catch (error) {
      console.warn('Audio not supported:', error)
    }
  }
  
  private playTone(frequency: number, duration: number = 50) {
    if (!this.audioContext || !this.gainNode) return
    
    const oscillator = this.audioContext.createOscillator()
    const envelope = this.audioContext.createGain()
    
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    
    envelope.gain.setValueAtTime(0, this.audioContext.currentTime)
    envelope.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01)
    envelope.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000)
    
    oscillator.connect(envelope)
    envelope.connect(this.gainNode)
    
    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + duration / 1000)
  }
  
  compare() {
    this.playTone(440, 30) // A4 note, short
  }
  
  swap() {
    this.playTone(660, 80) // E5 note, longer
  }
  
  pivot() {
    this.playTone(880, 120) // A5 note, longest
  }
  
  overwrite() {
    this.playTone(330, 40) // E4 note
  }
}

export const audioFeedback = new AudioFeedback()