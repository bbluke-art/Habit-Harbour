// Initialize Chart.js for progress visualization
document.addEventListener('DOMContentLoaded', function() {
    // Set up the weekly progress chart
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    // Sample data for the chart
    const progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Habit Completion',
                data: [80, 70, 90, 60, 85, 95, 100],
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Habit completion animation
    document.querySelectorAll('[data-feather="check"]').forEach(button => {
        button.addEventListener('click', function() {
            const habitCard = this.closest('.bg-white');
            habitCard.classList.add('habit-complete');
            setTimeout(() => {
                habitCard.classList.remove('habit-complete');
            }, 500);
        });
    });
});

// Fetch random motivational quote (mock implementation)
async function fetchMotivationalQuote() {
    try {
        // In a real app, you would call an API here
        const quotes = [
            "The secret of getting ahead is getting started.",
            "You don't have to be great to start, but you have to start to be great.",
            "Small daily improvements are the key to staggering long-term results.",
            "Success is the sum of small efforts, repeated day in and day out.",
            "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
        ];
        const authors = [
            "Mark Twain",
            "Zig Ziglar",
            "Robin Sharma",
            "Robert Collier",
            "Aristotle"
        ];
        
        const randomIndex = Math.floor(Math.random() * quotes.length);
        document.querySelector('#quote-text').textContent = quotes[randomIndex];
        document.querySelector('#quote-author').textContent = `— ${authors[randomIndex]}`;
    } catch (error) {
        console.error("Error fetching quote:", error);
    }
}

// Call the function when the page loads
window.addEventListener('load', fetchMotivationalQuote);
