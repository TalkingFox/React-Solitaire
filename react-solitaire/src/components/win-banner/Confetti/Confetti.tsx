import React from 'react';
import './Confetti.css';
import { CanvasSettings, ConfettiParticle } from './ConfettiParticle';

function rainConfetti(canvas: HTMLCanvasElement) {
    const confettiLimit = 500;
    const particles: ConfettiParticle[] = [];

    const context = canvas.getContext('2d');
    if (!context) {
        console.error('Could not fetch 2d canvas context.');
        return;
    }
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;

    const canvasSettings: CanvasSettings = {
        confettiLimit: confettiLimit,
        width: canvas.width,
        height: canvas.height,
        context: context
    };

    let shouldDestroyConfetti = false;
    setTimeout(() => {
        shouldDestroyConfetti = true;
    }, 3000);
    function draw() {
        const results = [];
        requestAnimationFrame(draw);

        const context = canvasSettings.context;
        context.clearRect(0, 0, canvasSettings.width, canvasSettings.height);

        for (let i = 0; i < particles.length; i++) {
            results.push(particles[i].Draw());
        }

        let particle: ConfettiParticle;
        let remainingFlakes = 0;
        for (let i = 0; i < particles.length; i++) {
            particle = particles[i];

            particle.tiltAngle += particle.tiltAngleIncrement;
            particle.y += (Math.cos(particle.d) + 3 + particle.radius / 2) / 2;
            particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

            if (particle.y <= canvasSettings.height) {
                remainingFlakes++;
            }

            if (shouldDestroyConfetti) {
                continue;
            }
            if (particle.x > canvasSettings.width + 30 || particle.x < -30 || particle.y > canvasSettings.height) {
                particle.x = Math.random() * canvasSettings.width;
                particle.y = -30;
                particle.tilt = Math.floor(Math.random() * 10) - 20;

            }
        }
        return results;
    }

    addEventListener('resize', () => {
        context.canvas.width = window.innerWidth;
        context.canvas.height = window.innerHeight;

        canvasSettings.width = canvas.width;
        canvasSettings.height = canvas.height;
    }, false);

    for (let i = 0; i < canvasSettings.confettiLimit; i++) {
        particles.push(new ConfettiParticle(canvasSettings));
    };
    draw();
}

function Confetti() {
    React.useEffect(() => {
        const canvas = document.getElementById('confetti') as HTMLCanvasElement;
        rainConfetti(canvas);
    });



    return (<canvas id="confetti"></canvas>)
}

export default Confetti;