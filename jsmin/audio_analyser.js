"use strict";var AudioContext=window.AudioContext||window.webkitAudioContext;var fftSize=128;function WebAudioAnalyser(audio,ctx,opts){if(!(this instanceof WebAudioAnalyser))return new WebAudioAnalyser(audio,ctx,opts);if(!(ctx instanceof AudioContext))opts=ctx,ctx=null;opts=opts||{};this.ctx=ctx=ctx||new AudioContext;if(!(audio instanceof AudioNode)){audio=audio instanceof Audio||audio instanceof HTMLAudioElement?ctx.createMediaElementSource(audio):ctx.createMediaStreamSource(audio)}this.analyser=ctx.createAnalyser();this.analyser.fftSize=fftSize;this.stereo=!!opts.stereo;this.audible=opts.audible!==false;this.wavedata=null;this.freqdata=null;this.splitter=null;this.merger=null;this.source=audio;if(!this.stereo){this.output=this.source;this.source.connect(this.analyser);if(this.audible)this.analyser.connect(ctx.destination)}else{this.analyser=[this.analyser];this.analyser.push(ctx.createAnalyser());this.splitter=ctx.createChannelSplitter(2);this.merger=ctx.createChannelMerger(2);this.output=this.merger;this.source.connect(this.splitter);for(var i=0;i<2;i++){this.splitter.connect(this.analyser[i],i,0);this.analyser[i].connect(this.merger,0,i)}if(this.audible)this.merger.connect(ctx.destination)}}WebAudioAnalyser.prototype.waveform=function(output,channel){if(!output)output=this.wavedata||(this.wavedata=new Uint8Array((this.analyser[0]||this.analyser).frequencyBinCount));var analyser=this.stereo?this.analyser[channel||0]:this.analyser;analyser.getByteTimeDomainData(output);return output};WebAudioAnalyser.prototype.frequencies=function(output,channel){if(!output)output=this.freqdata||(this.freqdata=new Uint8Array((this.analyser[0]||this.analyser).frequencyBinCount));var analyser=this.stereo?this.analyser[channel||0]:this.analyser;analyser.getByteFrequencyData(output);return output};analyse=WebAudioAnalyser;var analyser;var lastBars=new Uint8Array(fftSize/2);var d=document.createElement("div");document.body.appendChild(d);function createFreqBar(index){var div=document.createElement("div");div.style.width="100%";div.style.height="100px";div.style.position="absolute";div.style.top=index*100+"px";document.body.appendChild(div);return div}var lastPeak=[];var numBands=8;var bands=[];for(var i=0;i<numBands;i++){bands[i]=createFreqBar(i);lastPeak[i]=0}var audio=new Audio;audio.crossOrigin="Anonymous";audio.src="exebeche.mp3";audio.loop=true;audio.addEventListener("canplay",function(){console.log("playing!");analyser=analyse(audio,{audible:true,stereo:false,fftSize:16});binCount=64;levelBins=Math.floor(binCount/levelsCount);con.log(binCount,levelsCount);audio.play();audio.currentTime=150;render(0)});audio.addEventListener("error",function(e){switch(e.target.error.code){case e.target.error.MEDIA_ERR_ABORTED:alert("You aborted the video playback.");break;case e.target.error.MEDIA_ERR_NETWORK:alert("A network error caused the audio download to fail.");break;case e.target.error.MEDIA_ERR_DECODE:alert("The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.");break;case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:alert("The video audio not be loaded, either because the server or network failed or because the format is not supported.");break;default:alert("An unknown error occurred.");break}});function getBand(frequencies,band){var total=0;var bandWidth=fftSize/2/numBands;var startBand=band*bandWidth;var endBand=band*bandWidth+bandWidth;for(var i=startBand;i<endBand;i++){total+=frequencies[i]}total/=bandWidth;return total}var levelsData=[];var freqByteData;var timeByteData;var levelsCount=32;var levelBins;var levelHistory=[];var beatCutOff=0;var beatTime=0;var length=256;for(var i=0;i<length;i++){levelHistory.push(0)}function render(time){if(analyser){var frequencies=analyser.frequencies();var size=frequencies.length;requestAnimationFrame(render);for(var i=0;i<levelsCount;i++){var sum=0;for(var j=0;j<levelBins;j++){sum+=frequencies[i*levelBins+j]}levelsData[i]=sum/levelBins/256*1}var sum=0;for(var j=0;j<levelsCount;j++){sum+=levelsData[j]}level=sum/levelsCount;levelHistory.push(level);levelHistory.shift(1);var BEAT_HOLD_TIME=40;var BEAT_DECAY_RATE=.98;var BEAT_MIN=.15;if(level>beatCutOff&&level>BEAT_MIN){document.body.style.background="#fff";beatCutOff=level*1.1;beatTime=0}else{document.body.style.background="#444";if(beatTime<=50){beatTime++}else{beatCutOff*=.98;beatCutOff=Math.max(beatCutOff,BEAT_MIN)}}var b2=[];levelsData.concat([level*10]).forEach(function(freq){var f=0,bar="#";while(f++<freq*10){bar+="#"}b2.push(bar)});d.innerHTML=b2.join("<br>")}}