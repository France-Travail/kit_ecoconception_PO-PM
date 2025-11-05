// exercice-roles.js - Gestion de l'exercice interactif "Le jeu des responsabilités"

document.addEventListener('DOMContentLoaded', function() {
    // Définition des bonnes réponses
    const correctAnswers = {
        'mvp': 'pm',
        'eliminer-fonctionnalites': 'pm',
        'quantifier-besoin': 'pm',
        'design-simple': 'ux',
        'pagination': 'ux',
        'moteur-recherche': 'ux',
        'carrousel': 'intruse', // Cette pratique est une intruse
        'limiter-requetes': 'dev',
        'optimiser-images': 'dev',
        'cache': 'dev',
        'polices-systeme': 'ux',
        'pas-autoplay': 'ux'
    };

    // Sélection de tous les boutons de rôles
    const roleButtons = document.querySelectorAll('.role-btn');
    
    // État des sélections de l'utilisateur
    const userSelections = {};

    // Gestion du clic sur les boutons de rôles
    roleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const practiceCard = this.closest('.practice-card');
            const practiceId = practiceCard.dataset.practice;
            const selectedRole = this.dataset.role;
            
            // Retirer la sélection des autres boutons de cette carte
            const buttonsInCard = practiceCard.querySelectorAll('.role-btn');
            buttonsInCard.forEach(btn => {
                btn.classList.remove('selected', 'correct', 'incorrect');
            });
            
            // Ajouter la classe 'selected' au bouton cliqué
            this.classList.add('selected');
            
            // Enregistrer la sélection
            userSelections[practiceId] = selectedRole;
            
            // Mettre à jour le compteur de progression
            updateProgress();
        });
    });

    // Fonction pour mettre à jour la progression
    function updateProgress() {
        const totalPractices = Object.keys(correctAnswers).length;
        const selectedCount = Object.keys(userSelections).length;
        const progressElement = document.getElementById('progress-count');
        
        if (progressElement) {
            progressElement.textContent = `${selectedCount} / ${totalPractices} pratiques associées`;
            
            if (selectedCount === totalPractices) {
                progressElement.classList.add('complete');
            } else {
                progressElement.classList.remove('complete');
            }
        }
    }

    // Gestion du bouton "Afficher la solution"
    const toggleSolutionBtn = document.querySelector('.js-toggle-solution');
    const solutionBlock = document.querySelector('.solution');
    
    if (toggleSolutionBtn && solutionBlock) {
        toggleSolutionBtn.addEventListener('click', function() {
            const isHidden = solutionBlock.style.display === 'none' || !solutionBlock.style.display;
            
            if (isHidden) {
                // Afficher la solution et marquer les réponses
                solutionBlock.style.display = 'block';
                toggleSolutionBtn.textContent = 'Masquer la solution';
                markAnswers();
                
                // Scroll vers la solution
                solutionBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                // Masquer la solution et réinitialiser les marquages
                solutionBlock.style.display = 'none';
                toggleSolutionBtn.textContent = 'Afficher la solution';
                resetAnswers();
            }
        });
    }

    // Fonction pour marquer les réponses (correct/incorrect)
    function markAnswers() {
        Object.keys(correctAnswers).forEach(practiceId => {
            const practiceCard = document.querySelector(`[data-practice="${practiceId}"]`);
            if (!practiceCard) return;
            
            const correctRole = correctAnswers[practiceId];
            const userRole = userSelections[practiceId];
            const selectedButton = practiceCard.querySelector('.role-btn.selected');
            
            if (selectedButton) {
                if (userRole === correctRole) {
                    selectedButton.classList.add('correct');
                    selectedButton.classList.remove('incorrect');
                } else {
                    selectedButton.classList.add('incorrect');
                    selectedButton.classList.remove('correct');
                    
                    // Mettre en évidence la bonne réponse
                    const correctButton = practiceCard.querySelector(`[data-role="${correctRole}"]`);
                    if (correctButton && correctRole !== 'intruse') {
                        correctButton.classList.add('correct-answer-hint');
                    }
                }
            }
            
            // Marquer la carte "intruse" spécialement
            if (practiceId === 'carrousel') {
                practiceCard.classList.add('intruse-card');
            }
        });
    }

    // Fonction pour réinitialiser les marquages
    function resetAnswers() {
        const allButtons = document.querySelectorAll('.role-btn');
        allButtons.forEach(btn => {
            btn.classList.remove('correct', 'incorrect', 'correct-answer-hint');
        });
        
        const allCards = document.querySelectorAll('.practice-card');
        allCards.forEach(card => {
            card.classList.remove('intruse-card');
        });
    }

    // Initialiser la progression
    updateProgress();
});
