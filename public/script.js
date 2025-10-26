
// Habit data store
let habits = JSON.parse(localStorage.getItem('habits')) || [
    {
        id: 1,
        name: "Morning Meditation",
        frequency: "daily",
        goal: "10 minutes",
        streak: 7,
        completionRate: 85,
        longestStreak: 21,
        completions: [],
        lastCompleted: new Date().toISOString(),
        dailyCompletions: {}
    },
{
        id: 2,
        name: "Drink 2L Water",
        frequency: "daily",
        goal: "2 liters",
        streak: 14,
        completionRate: 92,
        longestStreak: 30,
        completions: [],
        lastCompleted: new Date().toISOString(),
        dailyCompletions: {}
},
    {
        id: 3,
        name: "30 Min Workout",
        frequency: "weekly",
        goal: "5 times",
        streak: 4,
        completionRate: 80,
        longestStreak: 12,
        completions: [],
        lastCompleted: new Date().toISOString(),
        dailyCompletions: {}
}
];

// Save habits to localStorage
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}
// Load habits on dashboard
function loadDashboardHabits() {
    const container = document.getElementById('habitsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    const today = new Date().toISOString().split('T')[0];
    
    // Create active habits section
    const activeSection = document.createElement('div');
    activeSection.innerHTML = '<h2 class="text-xl font-bold text-gray-800 mb-4">Active Habits</h2>';
    container.appendChild(activeSection);
    
    // Filter and show active habits
    const activeHabits = habits.filter(habit => !habit.completions.includes(today));
    activeHabits.forEach(habit => {
        const habitElement = createHabitElement(habit);
        activeSection.appendChild(habitElement);
    });
    
    // Create completed habits section if there are any
    const completedHabits = habits.filter(habit => habit.completions.includes(today));
    if (completedHabits.length > 0) {
        const completedSection = document.createElement('div');
        completedSection.classList.add('mt-8');
        completedSection.innerHTML = '<h2 class="text-xl font-bold text-gray-800 mb-4">Completed Today</h2><div id="completedHabitsContainer" class="space-y-4"></div>';
        container.appendChild(completedSection);
        
        completedHabits.forEach(habit => {
            const habitElement = createHabitElement(habit, true);
            document.getElementById('completedHabitsContainer').appendChild(habitElement);
        });
    }
    
    feather.replace();
}
function createHabitElement(habit, isCompleted = false) {
    const today = new Date().toISOString().split('T')[0];
    const habitElement = document.createElement('div');
    habitElement.className = `bg-white p-4 rounded-lg shadow-md flex justify-between items-center ${isCompleted ? 'completed-habit' : ''}`;
    habitElement.dataset.id = habit.id;
    
    const todayCount = habit.dailyCompletions[today] || 0;
    const countColor = todayCount > 0 ? 'text-green-600' : 'text-gray-500';
    
    habitElement.innerHTML = `
        <div>
            <h3 class="font-semibold text-lg text-gray-800">${habit.name}</h3>
            <p class="text-gray-500">${getHabitProgressText(habit)}</p>
            <p class="text-sm ${countColor}">Completed today: ${todayCount}x</p>
        </div>
<div class="flex gap-2">
            <button class="p-2 rounded-full hover:bg-gray-100 transition" data-id="${habit.id}" data-action="complete">
                <i data-feather="${isCompleted ? 'check-circle' : 'check'}" class="${isCompleted ? 'text-green-500' : 'text-gray-400'}"></i>
            </button>
            <button class="p-2 rounded-full hover:bg-gray-100 transition" data-id="${habit.id}" data-action="edit">
                <i data-feather="edit-2" class="text-blue-500"></i>
            </button>
            <button class="p-2 rounded-full hover:bg-gray-100 transition" data-id="${habit.id}" data-action="delete">
                <i data-feather="trash-2" class="text-red-500"></i>
            </button>
        </div>
    `;
    return habitElement;
}

function handleHabitActions() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="complete"]')) {
            const btn = e.target.closest('[data-action="complete"]');
            const id = btn.getAttribute('data-id');
            completeHabit(id);
        }
        
        if (e.target.closest('[data-action="edit"]')) {
            const btn = e.target.closest('[data-action="edit"]');
            const id = btn.getAttribute('data-id');
            const habit = habits.find(h => h.id == id);
            if (habit) {
                document.getElementById('modalTitle').textContent = 'Edit Habit';
                document.getElementById('habitId').value = habit.id;
                document.getElementById('habitName').value = habit.name;
                document.getElementById('habitFrequency').value = habit.frequency;
                document.getElementById('habitGoal').value = habit.goal;
                document.getElementById('habitModal').classList.remove('hidden');
            }
        }
        
        if (e.target.closest('[data-action="delete"]')) {
            const btn = e.target.closest('[data-action="delete"]');
            const id = btn.getAttribute('data-id');
            const habitElement = btn.closest('[data-id]');
            
            if (confirm('Are you sure you want to delete this habit?')) {
                // Add animation class before deletion
                habitElement.classList.add('habit-delete-animation');
                
                // Remove after animation completes
                setTimeout(() => {
                    habits = habits.filter(h => h.id != id);
                    saveHabits();
                    loadDashboardHabits();
                    updateStatsOverview();
                }, 500);
            }
        }
    });
}
// Get progress text for a habit
function getHabitProgressText(habit) {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const todayDateStr = today.toISOString().split('T')[0];
    
    if (habit.frequency === 'daily') {
        const completedDays = habit.completions.filter(date => {
            return new Date(date) >= new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        }).length;
        
        const todayCount = habit.dailyCompletions[todayDateStr] || 0;
        return `Completed ${completedDays}/7 days | Today: ${todayCount}`;
} else if (habit.frequency === 'weekly') {
        const completedWeeks = Math.floor(habit.streak / 7);
        return `Streak: ${completedWeeks} weeks`;
    } else {
        return `Streak: ${habit.streak} months`;
    }
}

// Initialize all charts and habits
function initializeCharts() {
// Dashboard Chart
    if (document.getElementById('progressChart')) {
        const ctx = document.getElementById('progressChart').getContext('2d');
        new Chart(ctx, {
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
    }

    // Statistics Page Charts
    if (document.getElementById('meditationChart')) {
        const meditationCtx = document.getElementById('meditationChart').getContext('2d');
        new Chart(meditationCtx, {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Completion %',
                    data: [70, 85, 90, 95],
                    backgroundColor: 'rgba(99, 102, 241, 0.7)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    if (document.getElementById('waterChart')) {
        const waterCtx = document.getElementById('waterChart').getContext('2d');
        new Chart(waterCtx, {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Completion %',
                    data: [85, 90, 95, 98],
                    backgroundColor: 'rgba(6, 182, 212, 0.7)',
                    borderColor: 'rgba(6, 182, 212, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

// Habit Management Functions
function loadHabits() {
    if (!document.getElementById('habitsList')) return;
    
    const habitsList = document.getElementById('habitsList');
    habitsList.innerHTML = '';
    
    habits.forEach(habit => {
        const habitElement = document.createElement('div');
        habitElement.className = 'grid grid-cols-12 p-4 items-center';
        habitElement.innerHTML = `
            <div class="col-span-5 font-medium">${habit.name}</div>
            <div class="col-span-2 text-sm text-gray-600 capitalize">${habit.frequency}</div>
            <div class="col-span-2">${habit.streak} days</div>
            <div class="col-span-3 flex justify-end gap-2">
                <button class="p-2 text-green-500 hover:bg-green-50 rounded-full" data-id="${habit.id}" data-action="complete">
                    <i data-feather="check"></i>
                </button>
                <button class="p-2 text-blue-500 hover:bg-blue-50 rounded-full" data-id="${habit.id}" data-action="edit">
                    <i data-feather="edit-2"></i>
                </button>
                <button class="p-2 text-red-500 hover:bg-red-50 rounded-full" data-id="${habit.id}" data-action="delete">
                    <i data-feather="trash-2"></i>
                </button>
            </div>
        `;
        habitsList.appendChild(habitElement);
    });
    feather.replace();
}

function setupHabitModal() {
    const modal = document.getElementById('habitModal');
    if (!modal) return;
    
    const addBtn = document.getElementById('addHabitBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('habitForm');
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Add New Habit';
            document.getElementById('habitId').value = '';
            document.getElementById('habitName').value = '';
            document.getElementById('habitFrequency').value = 'daily';
            document.getElementById('habitGoal').value = '';
            modal.classList.remove('hidden');
        });
    }
    
    if (closeBtn && cancelBtn) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('habitId').value;
            const name = document.getElementById('habitName').value;
            const frequency = document.getElementById('habitFrequency').value;
            const goal = document.getElementById('habitGoal').value;
            
            if (id) {
                // Edit existing habit
                const index = habits.findIndex(h => h.id == id);
                if (index !== -1) {
                    habits[index] = {
                        ...habits[index],
                        name,
                        frequency,
                        goal
                    };
                }
            } else {
                // Add new habit
                const newHabit = {
                    id: habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1,
                    name,
                    frequency,
                    goal,
                    streak: 0,
                    completionRate: 0,
                    longestStreak: 0
                };
                habits.push(newHabit);
            }
            
            modal.classList.add('hidden');
            loadHabits();
        });
    }
}

function handleHabitActions() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="complete"]')) {
            const btn = e.target.closest('[data-action="complete"]');
            const id = btn.getAttribute('data-id');
            const habit = habits.find(h => h.id == id);
            if (habit) {
                habit.streak += 1;
                if (habit.streak > habit.longestStreak) {
                    habit.longestStreak = habit.streak;
                }
                loadHabits();
            }
        }
        
        if (e.target.closest('[data-action="edit"]')) {
            const btn = e.target.closest('[data-action="edit"]');
            const id = btn.getAttribute('data-id');
            const habit = habits.find(h => h.id == id);
            if (habit) {
                document.getElementById('modalTitle').textContent = 'Edit Habit';
                document.getElementById('habitId').value = habit.id;
                document.getElementById('habitName').value = habit.name;
                document.getElementById('habitFrequency').value = habit.frequency;
                document.getElementById('habitGoal').value = habit.goal;
                document.getElementById('habitModal').classList.remove('hidden');
            }
        }
        
        if (e.target.closest('[data-action="delete"]')) {
            const btn = e.target.closest('[data-action="delete"]');
            const id = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this habit?')) {
                habits = habits.filter(h => h.id != id);
                loadHabits();
            }
        }
    });
}
// Complete a habit
function completeHabit(habitId) {
    const today = new Date().toISOString().split('T')[0];
    const habit = habits.find(h => h.id == habitId);
    
    if (!habit) return;
    
    // Check if already completed today
    if (habit.completions.includes(today)) {
        return; // Already completed
    }
    
    habit.completions.push(today);
    habit.lastCompleted = new Date().toISOString();
    habit.completedToday = true;
    
    // Update daily completion count
    const todayDateStr = today;
    if (!habit.dailyCompletions[todayDateStr]) {
        habit.dailyCompletions[todayDateStr] = 0;
    }
    habit.dailyCompletions[todayDateStr]++;
// Check if streak continues
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (habit.completions.includes(yesterdayStr) || habit.streak === 0) {
        habit.streak += 1;
        if (habit.streak > habit.longestStreak) {
            habit.longestStreak = habit.streak;
        }
    } else {
        habit.streak = 1; // Reset streak
    }
    
    // Update completion rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCompletions = habit.completions.filter(date => 
        new Date(date) >= thirtyDaysAgo
    ).length;
    
    habit.completionRate = Math.round((recentCompletions / 30) * 100);
    
    saveHabits();
    loadDashboardHabits();
    updateStatsOverview();
}
// Update stats overview cards
function updateStatsOverview() {
    if (!document.getElementById('statsOverview')) return;
    
    // Calculate current streak (longest of all habits)
    const currentStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
    
    // Calculate average completion rate
    const avgCompletion = habits.length > 0 
        ? Math.round(habits.reduce((sum, h) => sum + h.completionRate, 0) / habits.length) 
        : 0;
    
    // Update DOM
    document.querySelector('#currentStreakValue').textContent = `${currentStreak} days`;
    document.querySelector('#currentStreakBar').style.width = `${Math.min(100, currentStreak)}%`;
    
    document.querySelector('#completionRateValue').textContent = `${avgCompletion}%`;
    document.querySelector('#completionRateBar').style.width = `${avgCompletion}%`;
    
    document.querySelector('#habitsTrackedValue').textContent = habits.length;
    document.querySelector('#habitsTrackedBar').style.width = `${Math.min(100, habits.length * 10)}%`;
}
// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    loadDashboardHabits();
    loadHabits();
    setupHabitModal();
    handleHabitActions();
    updateStatsOverview();
    
    // Reset daily counts for a new day
    const today = new Date().toISOString().split('T')[0];
    habits.forEach(habit => {
        if (!habit.dailyCompletions) {
            habit.dailyCompletions = {};
        }
        if (!habit.dailyCompletions[today]) {
            habit.dailyCompletions[today] = 0;
        }
    });
    saveHabits();
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
