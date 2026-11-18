# Relatório Técnico - API de Microsserviço Financeiro (Wallet API)

## 1. Engenharia de Requisitos (SRS)
### Requisitos Funcionais (RF)
* **RF01:** O sistema deve permitir a criação de contas digitais com saldo inicial maior ou igual a zero.
* **RF02:** O sistema deve permitir consultar o saldo e os dados de uma conta digital pelo ID.
* **RF03:** O sistema deve processar transferências entre contas garantindo isolamento de concorrência, validação de saldo insuficiente e idempotência (evitando transferências duplicadas via chave única).
* **RF04:** O sistema deve gerar extratos financeiros filtrados por período de data e tipo (débito ou crédito).
* **RF05:** O sistema deve integrar-se de forma assíncrona/síncrona com um gateway antifraude externo simulado por webhook.

### Requisitos Não Funcionais (RNF)
* **RNF01:** A suíte de testes automatizados deve atingir cobertura mínima de 80% de branches e 85% de statements.
* **RNF02:** O pipeline de CI/CD no GitHub Actions deve barrar merges caso os testes falhem ou a cobertura caia abaixo da meta.
* **RNF03:** O endpoint de transferência deve suportar concorrência mínima de 50 requisições simultâneas sem inconsistências de saldo.

## 2. Estratégia de Branching
O projeto adota o **Trunk-Based Development** com branches curtas de curta duração (`feature/*` e `bugfix/*`) integradas via Pull Requests revisados e validados obrigatoriamente pela pipeline de CI do GitHub Actions antes do merge na branch `main`.