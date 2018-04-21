"use strict";

var synth_ambient = function(Tone) {
    return {
        init: function() {
            var watchOut = dom.element("h1", {
                innerHTML: "Beware your speakers!"
            });
            document.body.appendChild(watchOut);
            var loadNext = dom.button("Load another permutation", {
                style: {
                    border: "1px solid black",
                    borderRadius: "5px",
                    display: "inline-block",
                    padding: "5px"
                }
            });
            document.body.appendChild(loadNext), dom.on(loadNext, [ "click" ], function() {
                window.location = "?synth_ambient," + Math.round(1e10 * Math.random());
            }), Tone.Transport.bpm.value = rand.getInteger(80, 115);
            var notes = [ [ "b2", "g2", "c3", "b3", "g3", "c4" ], [ "c#3", "g#3", "c#4", "g#4", "c#5" ], [ "g3", "b3", "f#4", "g4", "b4", "f#5", "g5", "b5" ], [ "A3", "C4", "E4", "A4", "C5", "E5", "A5", "C6", "E6" ], [ "e3", "a#4", "e4", "a#5", "e5" ] ];
            function timeGenerator(min, max) {
                return Math.pow(2, rand.getInteger(min, max)) + "n";
            }
            notes = notes[rand.getInteger(0, notes.length - 1)], new Tone.PingPongDelay({
                delayTime: "6n",
                feedback: .9,
                wet: .2
            }).toMaster();
            var delayFeedback = new Tone.FeedbackDelay({
                delayTime: timeGenerator(2, 4),
                feedback: .9,
                wet: .4
            }).toMaster(), lowPass = new Tone.Filter({
                frequency: rand.getNumber(6e3, 2e4)
            }).toMaster(), freeverb = new Tone.Freeverb().toMaster();
            freeverb.dampening.value = rand.getNumber(10, 5e3);
            var phaser = new Tone.Phaser({
                frequency: rand.getNumber(10, 3e3),
                octaves: rand.getInteger(1, 7),
                baseFrequency: rand.getNumber(1e3, 2e3)
            }).toMaster(), crusher = new Tone.BitCrusher(rand.getInteger(2, 6)).toMaster(), chorus = new Tone.Chorus(rand.getNumber(2, 6), rand.getNumber(1, 3), rand.getNumber(.2, 1)).toMaster();
            function connectGenerator(synth) {
                return .7 < rand.random() ? synth.connect(freeverb) : .7 < rand.random() ? synth.connect(delayFeedback) : .6 < rand.random() ? synth.connect(lowPass) : .5 < rand.random() ? synth.connect(phaser) : .5 < rand.random() ? synth.connect(chorus) : .5 < rand.random() ? synth.connect(crusher) : synth;
            }
            var kickTime = timeGenerator(1, 2), kick = connectGenerator(new Tone.MembraneSynth({
                envelope: {
                    sustain: 0,
                    attack: .02,
                    decay: .8
                },
                octaves: 10
            })), snare = (new Tone.Loop(function(time) {
                kick.triggerAttackRelease("C2", "1n", time);
            }, kickTime).start(0), connectGenerator(new Tone.NoiseSynth({
                volume: -5,
                envelope: {
                    attack: .001,
                    decay: .7,
                    sustain: 0
                },
                filterEnvelope: {
                    attack: .001,
                    decay: .6,
                    sustain: 0
                }
            }))), hihatClosed = (new Tone.Loop(function(time) {
                snare.triggerAttack(time);
            }, "2n").start("4n"), connectGenerator(new Tone.NoiseSynth({
                volume: -9,
                envelope: {
                    attack: .001,
                    decay: .1,
                    sustain: 0
                },
                filterEnvelope: {
                    attack: .001,
                    decay: .01,
                    sustain: 0
                }
            }))), hihatOpen = connectGenerator(new Tone.NoiseSynth({
                volume: -10,
                filter: {
                    Q: 1
                },
                envelope: {
                    attack: .01,
                    decay: .3
                },
                filterEnvelope: {
                    attack: .01,
                    decay: .03,
                    baseFrequency: 14e3,
                    octaves: -2.5,
                    exponent: 4
                }
            })), hihatTime = timeGenerator(2, 4), hihat = 0, synthArpeggio = (new Tone.Loop(function(time) {
                hihatClosed.triggerAttack(time), (hihat + 2) % 4 == 0 && hihatOpen.triggerAttack(time), 
                hihat++;
            }, hihatTime).start(0), connectGenerator(new Tone.DuoSynth()));
            synthArpeggio.voice0.oscillator.type = "sine", synthArpeggio.voice1.oscillator.type = "square";
            var synthPoly = connectGenerator(new Tone.PolySynth(6, Tone.Synth, {
                oscillator: {
                    partials: [ 0, 2, 3, 4 ]
                },
                envelope: {
                    attack: .3,
                    decay: .05,
                    sustain: 0,
                    release: .02
                }
            })), bass = connectGenerator(new Tone.MonoSynth({
                volume: -10,
                envelope: {
                    attack: .1,
                    decay: .3,
                    release: 2
                },
                filterEnvelope: {
                    attack: .001,
                    decay: .01,
                    sustain: .5,
                    baseFrequency: 200,
                    octaves: 2.6
                }
            })), bassTime = timeGenerator(2, 4), bassNotes = notes.slice(0, rand.getInteger(1, 2));
            new Tone.Sequence(function(time, note) {
                bass.triggerAttackRelease(note, bassTime, time);
            }, bassNotes).start(0).probability = .9;
            var noise = connectGenerator(new Tone.Noise({
                volume: -20,
                type: [ "white", "brown", "pink" ][rand.getInteger(0, 2)]
            })), noiseVolume = rand.getNumber(0, .4);
            .02 < noiseVolume && (noise.start(), Tone.Master.volume.rampTo(0, noiseVolume));
            var notesArpeggio = notes.slice(0, rand.getInteger(2, 6)), noteArpeggioCurrent = 0, noteArpeggioLoop = Math.pow(2, rand.getInteger(4, 8));
            Tone.Transport.scheduleRepeat(function(time) {
                var note = notesArpeggio[noteArpeggioCurrent % notesArpeggio.length];
                noteArpeggioCurrent < notesArpeggio.length && synthArpeggio.triggerAttackRelease(note, "16n", time), 
                noteArpeggioCurrent++, noteArpeggioCurrent %= noteArpeggioLoop;
            }, "16n");
            var polyTime = timeGenerator(1, 4), notesPoly = notes.slice(0, rand.getInteger(2, 6));
            Tone.Transport.scheduleRepeat(function(time) {
                synthPoly.triggerAttackRelease(notesPoly, "8n");
            }, polyTime), Tone.Transport.start();
        },
        resize: function() {}
    };
};

define("synth_ambient", [ "Tone" ], synth_ambient);