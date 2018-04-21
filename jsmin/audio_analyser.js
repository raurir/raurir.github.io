"use strict";

var analyser, AudioContext = window.AudioContext || window.webkitAudioContext, fftSize = 128;

function WebAudioAnalyser(audio, ctx, opts) {
    if (!(this instanceof WebAudioAnalyser)) return new WebAudioAnalyser(audio, ctx, opts);
    if (ctx instanceof AudioContext || (opts = ctx, ctx = null), opts = opts || {}, 
    this.ctx = ctx = ctx || new AudioContext(), audio instanceof AudioNode || (audio = audio instanceof Audio || audio instanceof HTMLAudioElement ? ctx.createMediaElementSource(audio) : ctx.createMediaStreamSource(audio)), 
    this.analyser = ctx.createAnalyser(), this.analyser.fftSize = fftSize, this.stereo = !!opts.stereo, 
    this.audible = !1 !== opts.audible, this.wavedata = null, this.freqdata = null, 
    this.splitter = null, this.merger = null, this.source = audio, this.stereo) {
        this.analyser = [ this.analyser ], this.analyser.push(ctx.createAnalyser()), this.splitter = ctx.createChannelSplitter(2), 
        this.merger = ctx.createChannelMerger(2), this.output = this.merger, this.source.connect(this.splitter);
        for (var i = 0; i < 2; i++) this.splitter.connect(this.analyser[i], i, 0), this.analyser[i].connect(this.merger, 0, i);
        this.audible && this.merger.connect(ctx.destination);
    } else this.output = this.source, this.source.connect(this.analyser), this.audible && this.analyser.connect(ctx.destination);
}

WebAudioAnalyser.prototype.waveform = function(output, channel) {
    return output || (output = this.wavedata || (this.wavedata = new Uint8Array((this.analyser[0] || this.analyser).frequencyBinCount))), 
    (this.stereo ? this.analyser[channel || 0] : this.analyser).getByteTimeDomainData(output), 
    output;
}, WebAudioAnalyser.prototype.frequencies = function(output, channel) {
    return output || (output = this.freqdata || (this.freqdata = new Uint8Array((this.analyser[0] || this.analyser).frequencyBinCount))), 
    (this.stereo ? this.analyser[channel || 0] : this.analyser).getByteFrequencyData(output), 
    output;
}, analyse = WebAudioAnalyser;

var lastBars = new Uint8Array(fftSize / 2), d = document.createElement("div");

function createFreqBar(index) {
    var div = document.createElement("div");
    return div.style.width = "100%", div.style.height = "100px", div.style.position = "absolute", 
    div.style.top = 100 * index + "px", document.body.appendChild(div), div;
}

document.body.appendChild(d);

for (var lastPeak = [], numBands = 8, bands = [], i = 0; i < numBands; i++) bands[i] = createFreqBar(i), 
lastPeak[i] = 0;

var audio = new Audio();

function getBand(frequencies, band) {
    for (var total = 0, bandWidth = fftSize / 2 / numBands, endBand = band * bandWidth + bandWidth, i = band * bandWidth; i < endBand; i++) total += frequencies[i];
    return total /= bandWidth;
}

audio.crossOrigin = "Anonymous", audio.src = "exebeche.mp3", audio.loop = !0, audio.addEventListener("canplay", function() {
    console.log("playing!"), analyser = analyse(audio, {
        audible: !0,
        stereo: !1,
        fftSize: 16
    }), binCount = 64, levelBins = Math.floor(binCount / levelsCount), con.log(binCount, levelsCount), 
    audio.play(), audio.currentTime = 150, render(0);
}), audio.addEventListener("error", function(e) {
    switch (e.target.error.code) {
      case e.target.error.MEDIA_ERR_ABORTED:
        alert("You aborted the video playback.");
        break;

      case e.target.error.MEDIA_ERR_NETWORK:
        alert("A network error caused the audio download to fail.");
        break;

      case e.target.error.MEDIA_ERR_DECODE:
        alert("The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.");
        break;

      case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        alert("The video audio not be loaded, either because the server or network failed or because the format is not supported.");
        break;

      default:
        alert("An unknown error occurred.");
    }
});

var freqByteData, timeByteData, levelBins, levelsData = [], levelsCount = 32, levelHistory = [], beatCutOff = 0, beatTime = 0, length = 256;

for (i = 0; i < length; i++) levelHistory.push(0);

function render(time) {
    if (analyser) {
        var frequencies = analyser.frequencies();
        frequencies.length;
        requestAnimationFrame(render);
        for (var i = 0; i < levelsCount; i++) {
            for (var sum = 0, j = 0; j < levelBins; j++) sum += frequencies[i * levelBins + j];
            levelsData[i] = sum / levelBins / 256 * 1;
        }
        for (sum = 0, j = 0; j < levelsCount; j++) sum += levelsData[j];
        level = sum / levelsCount, levelHistory.push(level), levelHistory.shift(1);
        level > beatCutOff && .15 < level ? (document.body.style.background = "#fff", beatCutOff = 1.1 * level, 
        beatTime = 0) : (document.body.style.background = "#444", beatTime <= 50 ? beatTime++ : (beatCutOff *= .98, 
        beatCutOff = Math.max(beatCutOff, .15)));
        var b2 = [];
        levelsData.concat([ 10 * level ]).forEach(function(freq) {
            for (var f = 0, bar = "#"; f++ < 10 * freq; ) bar += "#";
            b2.push(bar);
        }), d.innerHTML = b2.join("<br>");
    }
}