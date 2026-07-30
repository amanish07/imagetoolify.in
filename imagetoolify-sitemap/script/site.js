document.addEventListener('DOMContentLoaded', () => {
    // Theme System Setup
    const body = document.body;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    function applyTheme(isDark) {
        body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }

    applyTheme(systemPrefersDark.matches);
    systemPrefersDark.addEventListener('change', (e) => applyTheme(e.matches));

    // Global Active Category State
    let activeCategory = 'all';

    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    const keyHint = document.getElementById('keyHint');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const backToTopBtn = document.getElementById('backToTop');

    // Live Link Counter
    function updateStats() {
        const allLinks = document.querySelectorAll('.link-item');
        let visible = 0;

        allLinks.forEach(link => {
            if (link.style.display !== 'none' && link.closest('.section-card').style.display !== 'none') {
                visible++;
            }
        });

        document.getElementById('totalCount').textContent = allLinks.length;
        document.getElementById('visibleCount').textContent = visible;
    }

    // Filter Logic
    function filterLinks() {
        const query = searchInput.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.section-card');
        let hasVisibleCards = false;

        if (query.length > 0) {
            clearBtn.style.display = 'block';
            keyHint.style.display = 'none';
        } else {
            clearBtn.style.display = 'none';
            keyHint.style.display = 'block';
        }

        cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const links = card.querySelectorAll('.link-item');
            let visibleCountInCard = 0;

            const categoryMatch = (activeCategory === 'all' || cardCategory === activeCategory);

            links.forEach(item => {
                const text = item.querySelector('.link-content').textContent.toLowerCase();
                const matchesSearch = text.includes(query);

                if (matchesSearch && categoryMatch) {
                    item.style.display = 'flex';
                    visibleCountInCard++;
                } else {
                    item.style.display = 'none';
                }
            });

            if (visibleCountInCard > 0 && categoryMatch) {
                card.style.display = 'flex';
                card.querySelector('.category-count').textContent = visibleCountInCard;
                hasVisibleCards = true;
            } else {
                card.style.display = 'none';
            }
        });

        const noResults = document.getElementById('noResults');
        noResults.style.display = hasVisibleCards ? 'none' : 'block';
        updateStats();
    }

    // Category Tabs Event Listeners
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-category');
            filterLinks();
        });
    });

    // Search Box Inputs
    searchInput.addEventListener('keyup', filterLinks);
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterLinks();
        searchInput.focus();
    });

    // Clipboard Functionality
    document.addEventListener('click', (e) => {
        const copyBtn = e.target.closest('.copy-btn');
        if (copyBtn) {
            const url = copyBtn.getAttribute('data-url');
            if (url) {
                navigator.clipboard.writeText(url).then(() => {
                    showToast("Link copied to clipboard!");
                }).catch(() => {
                    showToast("Failed to copy link.");
                });
            }
        }
    });

    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // Keyboard Shortcut (Ctrl + K)
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });

    // Scroll to Top Listener
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initial Load
    updateStats();
});