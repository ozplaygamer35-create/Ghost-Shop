// Helper using Browser's Native Web Audio API to play fully functional calling tones
class WebRTCAudioCall {
  private ctx: AudioContext | null = null;
  private ringInterval: any = null;

  startRinging() {
    try {
      this.stop();
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      
      const playTone = () => {
        if (!this.ctx) return;
        // Ringtone consists of 440Hz + 480Hz combined frequencies
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        
        osc1.frequency.value = 440;
        osc2.frequency.value = 480;
        
        gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime + 1.8);
        gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2.0);
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        
        osc1.start();
        osc2.start();
        
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
          } catch (e) {}
        }, 2200);
      };

      playTone();
      this.ringInterval = setInterval(playTone, 4000);
    } catch (error) {
      console.warn('Web Audio API is not supported or was blocked by gesture constraints', error);
    }
  }

  startConnectedTone() {
    try {
      this.stop();
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      
      // Play a quick, clean click / notification tone to signal the connection is established
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 580;
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      
      setTimeout(() => {
        try {
          osc.stop();
        } catch (e) {}
      }, 500);
    } catch (e) {}
  }

  playHangupTone() {
    try {
      this.stop();
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      
      // Play 3 rapid, short busy/hang-up signal beeps (350Hz)
      const playBeep = (delay: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.value = 350;
        gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + delay + 0.04);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + delay + 0.16);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + delay + 0.20);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        
        setTimeout(() => {
          try {
            osc.stop();
          } catch (e) {}
        }, (delay + 0.3) * 1000);
      };

      playBeep(0);
      playBeep(0.28);
      playBeep(0.56);
    } catch (e) {}
  }

  stop() {
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
  }
}

export const audioCall = new WebRTCAudioCall();
