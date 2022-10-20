export default class AudioLevelsAnalyzer{
    constructor(stream, elementId){

        if(!stream && !elementId){
            return null;
        }

        this.stream = stream;
        this.elementId = elementId;
        this.requestLoop = true;

        this.audioContext = new AudioContext();
        this.audioSource = this.audioContext.createMediaStreamSource(this.stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 1024;
        this.analyser.smoothingTimeConstant = 0.4;
        this.audioSource.connect(this.analyser);
        this.volumes = new Uint8Array(this.analyser.frequencyBinCount);

        this.levelsLoop();
    }

    levelsLoop = () => {
        setTimeout(() => {
  
          this.analyser.getByteFrequencyData(this.volumes);
          let volumeSum = 0;
          for (const volume of this.volumes) {
            volumeSum += volume;
          }
          const averageVolume = Math.round(volumeSum / this.volumes.length);
          let scaleAmplitude = parseFloat(`1.${averageVolume / 20}`);

          if(scaleAmplitude > 1.4){
              scaleAmplitude = 1.4;
          }
          
          $(`#${this.elementId}`).css({transform: `translate(-50%, -50%) scale(${scaleAmplitude})`});
  
          this.requestLoop && this.levelsLoop();
  
        }, 50);
    }

    end = () =>{
        this.requestLoop = false;
        setTimeout(()=>{
            $(`#${this.elementId}`).css({transform: 'translate(-50%, -50%) scale(1)'});
        }, 100);
    }


}