// JavaScript para o Conversor de Distância - Server-Side Only

class DistanceConverter {
    constructor() {
        this.conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadHistory();
        this.setupRealTimeConversion();
    }

    bindEvents() {
        // Botão swap
        const swapBtn = document.getElementById('swapBtn');
        if (swapBtn) {
            swapBtn.addEventListener('click', this.swapUnits.bind(this));
        }

        // Formulário
        const form = document.getElementById('converterForm');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }

        // Input em tempo real (agora via AJAX)
        const valueInput = document.getElementById('valorRef');
        if (valueInput) {
            valueInput.addEventListener('input', this.debounce(this.realTimeConversionAjax.bind(this), 800));
        }

        // Mudança de seleção (agora via AJAX)
        const selectConversion = document.getElementById('selectTemp');
        if (selectConversion) {
            selectConversion.addEventListener('change', this.realTimeConversionAjax.bind(this));
        }
    }

    // Conversão em tempo real via AJAX para o servidor
    async realTimeConversionAjax() {
        const valueInput = document.getElementById('valorRef');
        const selectConversion = document.getElementById('selectTemp');
        
        // Validação básica no frontend
        if (!valueInput.value || isNaN(valueInput.value) || valueInput.value === '') {
            this.clearRealTimeResult();
            return;
        }

        const value = parseFloat(valueInput.value);
        const conversionType = selectConversion.value;

        if (value === 0) {
            this.clearRealTimeResult();
            return;
        }

        try {
            // Chamada AJAX para o servidor
            const response = await fetch('/convert-api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversion_type: conversionType,
                    value: value
                })
            });

            const data = await response.json();

            if (data.success) {
                this.displayRealTimeResult(data.result, data.unit);
            } else {
                this.showError(data.error);
            }
        } catch (error) {
            console.error('Erro na conversão AJAX:', error);
            this.clearRealTimeResult();
        }
    }

    displayRealTimeResult(result, unit) {
        // Verificar se já existe uma área de resultado em tempo real
        let realTimeResult = document.getElementById('realTimeResult');
        
        if (!realTimeResult) {
            realTimeResult = this.createRealTimeResultElement();
        }

        const formattedResult = this.formatNumber(result);
        
        realTimeResult.innerHTML = `
            <div class="d-flex align-items-center justify-content-between">
                <span class="text-muted">
                    <i class="fas fa-flash me-1"></i>
                    Conversão em tempo real:
                </span>
                <strong class="text-gradient fs-5">
                    ${formattedResult} ${unit}
                </strong>
            </div>
        `;
        
        realTimeResult.classList.remove('d-none');
        realTimeResult.classList.add('animate-pulse');
    }

    showError(errorMessage) {
        let realTimeResult = document.getElementById('realTimeResult');
        
        if (!realTimeResult) {
            realTimeResult = this.createRealTimeResultElement();
        }

        realTimeResult.innerHTML = `
            <div class="d-flex align-items-center justify-content-center">
                <span class="text-danger">
                    <i class="fas fa-exclamation-triangle me-1"></i>
                    ${errorMessage}
                </span>
            </div>
        `;
        
        realTimeResult.classList.remove('d-none');
    }

    createRealTimeResultElement() {
        const form = document.getElementById('converterForm');
        const realTimeResult = document.createElement('div');
        realTimeResult.id = 'realTimeResult';
        realTimeResult.className = 'alert alert-info d-none mt-3';
        form.appendChild(realTimeResult);
        return realTimeResult;
    }

    clearRealTimeResult() {
        const realTimeResult = document.getElementById('realTimeResult');
        if (realTimeResult) {
            realTimeResult.classList.add('d-none');
        }
    }

    // Trocar unidades
    swapUnits() {
        const select = document.getElementById('selectTemp');
        const currentValue = select.value;
        
        // Mapeamento de conversões inversas
        const swapMap = {
            '1': '2', '2': '1',  // Metro <-> Quilômetros
            '3': '4', '4': '3',  // Metro <-> Milhas
            '5': '6', '6': '5',  // Metro <-> Pés
            '7': '8', '8': '7',  // Centímetros <-> Metro
            '9': '10', '10': '9', // Polegadas <-> Centímetros
            '11': '12', '12': '11' // Jardas <-> Metro
        };

        if (swapMap[currentValue]) {
            select.value = swapMap[currentValue];
            this.realTimeConversion();
            
            // Animação do botão
            const swapBtn = document.getElementById('swapBtn');
            swapBtn.style.transform = 'rotate(180deg) scale(1.1)';
            setTimeout(() => {
                swapBtn.style.transform = '';
            }, 300);
        }
    }

    // Manipular submit do formulário (agora via AJAX)
    async handleSubmit(e) {
        e.preventDefault(); // Impedir envio tradicional
        
        const convertBtn = document.getElementById('convertBtn');
        const spinner = convertBtn.querySelector('.spinner');
        const valueInput = document.getElementById('valorRef');
        const selectConversion = document.getElementById('selectTemp');
        
        // Validação
        if (!valueInput.value || isNaN(valueInput.value)) {
            this.showError('Por favor, digite um valor válido');
            return;
        }
        
        // Mostrar loading
        convertBtn.classList.add('loading');
        spinner.classList.remove('d-none');
        
        try {
            // Chamada AJAX para converter
            const response = await fetch('/convert-api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversion_type: selectConversion.value,
                    value: parseFloat(valueInput.value)
                })
            });

            const data = await response.json();

            if (data.success) {
                // Exibir resultado
                this.displayMainResult(data.result, data.unit, data.original_value);
                
                // Adicionar ao histórico
                this.addToHistory({
                    originalValue: data.original_value,
                    convertedValue: data.result,
                    unit: data.unit,
                    conversionType: selectConversion.value,
                    timestamp: new Date().toLocaleString('pt-BR')
                });
                
                // Limpar resultado em tempo real
                this.clearRealTimeResult();
            } else {
                this.showError(data.error);
            }
        } catch (error) {
            console.error('Erro na conversão:', error);
            this.showError('Erro ao conectar com o servidor');
        } finally {
            // Remover loading
            convertBtn.classList.remove('loading');
            spinner.classList.add('d-none');
        }
    }

    // Exibir resultado principal (similar ao resultado do formulário tradicional)
    displayMainResult(result, unit, originalValue) {
        // Remover resultado anterior se existir
        let existingResult = document.querySelector('.result-card');
        if (existingResult) {
            existingResult.remove();
        }
        
        // Criar card de resultado
        const resultHTML = `
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="result-card">
                        <div class="result-title">
                            <i class="fas fa-check-circle me-2"></i>
                            Resultado da Conversão
                        </div>
                        <div class="result-value">
                            ${this.formatNumber(result)}
                        </div>
                        <div class="result-unit">${unit}</div>
                    </div>
                </div>
            </div>
        `;
        
        // Inserir após o formulário
        const mainContainer = document.querySelector('.main-container');
        mainContainer.insertAdjacentHTML('beforeend', resultHTML);
    }

    // Histórico de conversões
    addToHistory(conversion) {
        this.conversionHistory.unshift(conversion);
        
        // Manter apenas os últimos 10
        if (this.conversionHistory.length > 10) {
            this.conversionHistory = this.conversionHistory.slice(0, 10);
        }
        
        localStorage.setItem('conversionHistory', JSON.stringify(this.conversionHistory));
        this.loadHistory();
    }

    loadHistory() {
        if (this.conversionHistory.length === 0) return;

        const historySection = document.getElementById('historySection');
        const historyList = document.getElementById('historyList');
        
        if (!historySection || !historyList) return;

        historyList.innerHTML = this.conversionHistory.map(item => `
            <div class="history-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${this.formatNumber(item.originalValue)}</strong>
                        <i class="fas fa-arrow-right mx-2 text-muted"></i>
                        <strong class="text-primary">${this.formatNumber(item.convertedValue)} ${item.unit}</strong>
                    </div>
                    <small class="text-muted">${item.timestamp}</small>
                </div>
            </div>
        `).join('');

        historySection.classList.remove('d-none');
    }

    clearHistory() {
        this.conversionHistory = [];
        localStorage.removeItem('conversionHistory');
        document.getElementById('historySection').classList.add('d-none');
    }

    // Inicialização da conversão em tempo real
    setupRealTimeConversion() {
        // Verificar se há valores preenchidos na página e fazer conversão via AJAX
        setTimeout(() => {
            this.realTimeConversionAjax();
        }, 100);
    }

    // Utilitários
    formatNumber(num) {
        if (Math.abs(num) >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (Math.abs(num) >= 1000) {
            return (num / 1000).toFixed(2) + 'K';
        } else if (Math.abs(num) < 0.01 && num !== 0) {
            return num.toExponential(2);
        } else {
            return parseFloat(num.toFixed(6)).toString();
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    new DistanceConverter();
    
    // Adicionar efeitos de animação
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.5s ease-out';
            }
        });
    });
    
    // Observar elementos para animação
    document.querySelectorAll('.converter-card, .result-card').forEach(el => {
        observer.observe(el);
    });
    
    // Melhorar acessibilidade
    document.querySelectorAll('input, select, button').forEach(el => {
        el.addEventListener('focus', function() {
            this.closest('.form-group, .mb-3, .mb-4')?.classList.add('focused');
        });
        
        el.addEventListener('blur', function() {
            this.closest('.form-group, .mb-3, .mb-4')?.classList.remove('focused');
        });
    });
});

// Adicionar funcionalidade de teclado
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter para converter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('converterForm').dispatchEvent(new Event('submit'));
    }
    
    // Esc para limpar
    if (e.key === 'Escape') {
        document.getElementById('valorRef').value = '';
        document.querySelector('#realTimeResult')?.classList.add('d-none');
    }
});

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Registrar service worker se necessário
    });
}