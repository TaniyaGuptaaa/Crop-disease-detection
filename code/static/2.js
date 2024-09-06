document.addEventListener('DOMContentLoaded', () => {
    gsap.from('.hero-content', { duration: 1, opacity: 0, y: -50 });
    gsap.from('nav', { duration: 1, opacity: 0, y: -50, delay: 0.5 });

    gsap.utils.toArray('.plant-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            duration: 1,
            opacity: 0,
            y: 50
        });
    });
});